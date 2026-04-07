# lab6-app solution

## Files included
- `app.js` - Express app updated to read tasks from PostgreSQL
- `package.json` - fixed dependency file
- `init.sql` - database initialization and seed data
- `Dockerfile` - container image for the app
- `docker-compose.yml` - runs app + PostgreSQL together
- `WRITEUPS.md` - draft answers for the assignment write-ups

## Commands to run on your EC2 instance
```bash
cd ~/lab6-app
npm install

docker build -t lab6-app .
docker compose up -d
docker compose ps
curl localhost:3000/tasks
docker logs lab6-app
```

## Publish to Docker Hub
```bash
docker login
docker tag lab6-app <your-dockerhub-username>/lab6-app:v1
docker push <your-dockerhub-username>/lab6-app:v1
```

## Cleanup
```bash
docker compose down -v
docker rmi lab6-app
docker rmi <your-dockerhub-username>/lab6-app:v1
docker logout
```
