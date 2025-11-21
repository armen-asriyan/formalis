# Docker configuration

This doc explains the Docker-related files and how to run, build, and troubleshoot the stack.

Services and roles

- nginx

  - Purpose: Reverse proxy, TLS termination, static file serving and forwarding requests to `node-app`.
  - Files: `nginx/Dockerfile`, `nginx/nginx.conf`.
  - Typical config: maps ports 80/443 to host, proxies `/api` or app routes to `node-app` container by service name.

- node-app

  - Purpose: The application server (Node.js). Serves dynamic content and APIs.
  - Files: `node-app/Dockerfile`, `node-app/package.json`, `node-app/server.js`.
  - Typical behavior: listens on an internal port (e.g. 3000) and nginx forwards requests to it.

- mysql
  - Purpose: Database server for persistence.
  - Files: `mysql/init.sql` — initialization SQL executed on first container startup (creates DB/schema/seed data).
  - Persistent data: usually mounted to a Docker volume on the host — check `docker-compose.yml` for exact volume mapping.

Global file: `docker-compose.yml`

- Defines the services, networks and volumes used by the app.
- Typically includes:
  - image/build details for each service
  - environment variables (DB credentials, node_env, etc.)
  - ports mapping (host:container)
  - volumes for persistent data or for mounting config files (e.g., `./nginx/nginx.conf:/etc/nginx/nginx.conf`)
  - depends_on or healthchecks to order bootstrapping

Common docker-compose commands

- Build all images:

```bash
docker compose build
```

- Build & start in the background:

```bash
docker compose up -d --build
```

- View logs for all services:

```bash
docker compose logs -f
```

- View logs for one service (example: `node-app`):

```bash
docker compose logs -f node-app
```

- Stop and remove containers, networks, volumes (be careful with volumes):

```bash
docker compose down
```

- Rebuild a single service and restart it:

```bash
docker compose restart node-app
```

TLS / certificates

- There is a `scripts/renew_cert.md` file with notes on renewing certificates. If you're using Let's Encrypt or certbot automation, follow the steps there.
- If nginx is configured for TLS, check `nginx/nginx.conf` and any referenced certificate file paths (usually volumes) to ensure they map to the host location where certs live.
