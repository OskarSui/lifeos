# Architecture

## High-level

Browser
↓
React + TypeScript + Vite + Tailwind
↓ HTTP/REST
Node.js + Express + TypeScript
↓
Prisma
↓
PostgreSQL

## Backend layering

Route → Controller → Service → Repository → Prisma → PostgreSQL

Example:

POST /api/v1/tasks
→ taskController
→ taskService
→ taskRepository
→ Prisma
→ PostgreSQL

## Monorepo

lifeos/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   └── shared/
├── docs/
├── docker/
├── docker-compose.yml
└── README.md
