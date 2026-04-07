CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('done', 'pending'))
);

INSERT INTO tasks (id, name, status)
VALUES
  (1, 'Milk', 'done'),
  (2, 'Eggs', 'done'),
  (3, 'Bread', 'pending'),
  (4, 'Butter', 'pending'),
  (5, 'Orange juice', 'pending')
ON CONFLICT (id) DO NOTHING;
