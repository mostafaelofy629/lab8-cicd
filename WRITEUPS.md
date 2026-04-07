# CISC 886 - Assignment 6 Write-ups

## Write-up 1
**Database chosen:** PostgreSQL.

I chose PostgreSQL because it is reliable, widely used in cloud deployments, and the Node.js `pg` package makes it easy to connect from the Express application. The Docker image must be rebuilt after changing the application source files because the image contains a snapshot of the app code and dependencies taken at build time; rebuilding creates a new image with the updated files included.

## Write-up 2
**docker compose ps output:**

Run this on your EC2 instance after starting the services:

```bash
docker compose up -d
docker compose ps
```

Paste the real output from your EC2 instance into your submission. A typical result will show both `lab6-app` and `lab6-db` in the `running` state, with the app exposing port `3000`.

**One-sentence explanation:**
The app container can reach the database container by the name `db` because Docker Compose places both services on the same default network and automatically provides service-name-based DNS resolution.

## Write-up 3
A container registry is a remote service that stores and distributes container images so they can be pulled onto other machines when needed. It is useful in cloud deployment workflows because it gives you a central place to version, share, and deploy the exact same image consistently across environments.
