                    GitHub
                       │
                       │ git push
                       ▼
                 GitHub Actions
                       │
                 ┌─────┴─────┐
                 │    CI     │
                 └─────┬─────┘
                       │
                  CI PASSED
                       │
                       ▼
                  Build images
                       │
                       ▼
                      GHCR
                       │
                    docker pull
                       │
                       ▼
              ┌─────────────────┐
              │ Oracle Free VPS │
              │                 │
              │ Docker Compose  │
              │ ├── web         │
              │ ├── api         │
              │ └── postgres    │
              └─────────────────┘
                       │
                       ▼
                 https://...

# Phase 1 — VPS

Создаём:

Oracle Cloud
↓
Ubuntu VM
↓
SSH access

# Phase 2 — Server setup

На VPS:

Ubuntu
├── Docker
├── Docker Compose
├── firewall
└── deployment directory

# Phase 3 — Manual deployment

Сначала вручную проверим:

docker compose pull
docker compose up -d

и убедимся, что LifeOS реально работает на публичном сервере.

# Phase 4 — GHCR

Добавим:

GitHub
↓
Docker build
↓
GHCR

Вместо того чтобы VPS самостоятельно собирать приложение из исходников.

# Phase 5 — Continuous Deployment

Только после этого:

git push main
↓
CI
↓
Docker build
↓
GHCR
↓
SSH
↓
VPS
↓
docker compose pull
↓
docker compose up -d
↓
health check

# One thing before deployment

VPS has only:
RAM: 1 GB
Disk: 10 GB

So we should not install Node.js, npm, PostgreSQL, or Nginx directly on the server.

Docker will handle the application environment.

The host should remain minimal:

Debian
├── Docker
├── Docker Compose
├── SSH
└── firewall

Docker
├── LifeOS Web
├── LifeOS API
└── PostgreSQL

That's cleaner and much closer to the containerized deployment model we want to learn.
