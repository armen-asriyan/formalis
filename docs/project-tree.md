# Project tree

This document describes the repository layout and the purpose of the main files and folders.

Top-level tree (trimmed):

```
docker-compose.yml
README.md
TP.md
docs/
mysql/
	init.sql
nginx/
	Dockerfile
	nginx.conf
node-app/
	Dockerfile
	package.json
	server.js
scripts/
	renew_cert.md
```

Brief descriptions

- `docker-compose.yml`

  - Central compose file defining the multi-container application (nginx, node-app, mysql, etc.). Use this to build and run the stack.

- `README.md`

  - Project overview, usage and any high-level instructions.

- `docs/`

  - Documentation directory. Contains project documentation (this file and related docs).

- `mysql/`

  - `init.sql`: initial SQL used by the MySQL container during startup. Typically used to create schema, seed data or users.

- `nginx/`

  - `Dockerfile`: Docker image build instructions for the nginx service (if customized).
  - `nginx.conf`: nginx configuration file used by the container to route/reverse-proxy traffic to application services.

- `node-app/`

  - `Dockerfile`: build instructions for the Node.js application image.
  - `package.json`: Node dependencies and npm scripts.
  - `server.js`: main server entrypoint for the Node app (Express or similar).

- `scripts/`
  - `renew_cert.md`: notes or commands related to renewing TLS certificates (ACME/Let's Encrypt or internal process).
