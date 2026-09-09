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

# Main Dashboard

┌─────────────────────────────────────────────┐
│ Good morning │
│ Here's what matters today. │
├─────────────────────────────────────────────┤
│ │
│ TODAY'S FOCUS │
│ ┌─────────────────────────────────────────┐ │
│ │ Finish LifeOS API architecture HIGH │ │
│ │ → Continue │ │
│ └─────────────────────────────────────────┘ │
│ │
│ TODAY │
│ 3 tasks 1 in progress 2 done │
│ │
│ Progress │
│ ████████████░░░░░░ 60% │
│ │
├─────────────────────────────────────────────┤
│ Quick Capture │
│ [ What needs to be done? ] [Add] │
├─────────────────────────────────────────────┤
│ INBOX │ IN PROGRESS │ DONE │
│ ... │ ... │ ... │
└─────────────────────────────────────────────┘
