apps/web/
├── src/
│ ├── components/
│ │ ├── ui/
│ │ └── layout/
│ │
│ ├── features/
│ │ └── tasks/
│ │ ├── components/
│ │ │ ├── TaskCard.tsx
│ │ │ ├── TaskList.tsx
│ │ │ ├── TaskForm.tsx
│ │ │ └── TaskFilters.tsx
│ │ │
│ │ ├── task.api.ts
│ │ ├── task.types.ts
│ │ └── task.utils.ts
│ │
│ ├── pages/
│ │ └── TasksPage.tsx
│ │
│ ├── services/
│ │ └── api-client.ts
│ │
│ ├── lib/
│ ├── App.tsx
│ └── main.tsx

 #                   REAL LIFEOS FLOW

┌──────────────┐
│ React Client │
│ Vite + TS    │
│ Tailwind     │
└──────┬───────┘
       │ HTTP / JSON
       ▼
┌──────────────┐
│ Express API  │
│ REST v1      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Prisma     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ PostgreSQL   │
│ Docker       │
└──────────────┘