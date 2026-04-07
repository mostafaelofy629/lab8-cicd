const express = require('express');
const os = require('os');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'lab8',
  user: process.env.DB_USER || 'lab8user',
  password: process.env.DB_PASSWORD || 'lab8pass',
};

const pool = new Pool(dbConfig);

function groupTasksByStatus(rows) {
  return rows.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {});
}

async function waitForDatabase(maxRetries = 20, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      console.log(`Database connection established on attempt ${attempt}.`);
      return;
    } catch (error) {
      console.log(`Database not ready yet (attempt ${attempt}/${maxRetries}): ${error.message}`);
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*)::int AS total FROM tasks');
    res.json({
      app: 'CISC 886 Lab 8',
      mode: process.env.MODE || 'local',
      node: process.version,
      host: os.hostname(),
      database: dbConfig.database,
      totalTasks: result.rows[0].total,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to query database',
      details: error.message,
    });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, status FROM tasks ORDER BY id ASC');
    res.json(groupTasksByStatus(result.rows));
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve tasks from database',
      details: error.message,
    });
  }
});

async function startServer() {
  try {
    await waitForDatabase();
    app.listen(PORT, () => {
      console.log('--------------------------------------------------');
      console.log('  CISC 886 Lab 8 - App started');
      console.log(`  Port:  ${PORT}`);
      console.log(`  Mode:  ${process.env.MODE || 'local'}`);
      console.log(`  Node:  ${process.version}`);
      console.log(`  Host:  ${os.hostname()}`);
      console.log(`  DB:    ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
      console.log('--------------------------------------------------');
    });
  } catch (error) {
    console.error('Unable to start app because the database connection failed.');
    console.error(error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});

startServer();