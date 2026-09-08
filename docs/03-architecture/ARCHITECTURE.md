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
│ ├── web/
│ └── api/
├── packages/
│ └── shared/
├── docs/
├── docker/
├── docker-compose.yml
└── README.md

# Frontend

 ## TasksPage

Отвечает за:

loading
error
state
CRUD handlers
TaskList

Отвечает за:

отображение списка
TaskCard

Отвечает за:

отображение одной задачи
пользовательские действия
task.api.ts

Отвечает за:

HTTP API
api-client.ts

Отвечает за:

transport
HTTP errors
API envelope
