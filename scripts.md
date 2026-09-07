curl -sS -i -X POST http://localhost:3001/api/v1/tasks -H 'Content-Type: application/json' -d '{"userId":"112c9068-a834-4f5c-bb90-4c7e6a69fee2","title":"Task API","description":"Implement task endpoints","priority":"HIGH"}'

The error was caused by an empty database. Prisma was connected successfully, but the migration had not been applied.

Fixed by running:

npx prisma migrate deploy
npx prisma db seed

The database now contains:

users
goals
tasks
daily_focus
\_prisma_migrations

# Принцип здесь очень важный:

# Zod
"Данные вообще корректной формы?"

# Controller
"Какой HTTP response вернуть?"

# Service
"Разрешена ли эта операция с точки зрения бизнес-логики?"

# Repository
"Как получить/сохранить данные?"

# Prisma
"Как превратить это в SQL?"

# Testing:
Schema → Test → Middleware → Controller → Service

                    HTTP
                     │
                     ▼
              ┌─────────────┐
              │    Route    │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │    Zod      │
              │ Validation  │
              └──────┬──────┘
                     │
              valid  │  invalid
                     │
                     │       └──► AppError
                     │                │
                     │                ▼
                     │             400 JSON
                     ▼
              ┌─────────────┐
              │ Controller  │
              └──────┬──────┘
                     ▼
              ┌─────────────┐
              │   Service   │
              └──────┬──────┘
                     ▼
              ┌─────────────┐
              │ Repository  │
              └──────┬──────┘
                     ▼
                 Prisma
                     ▼
                PostgreSQL
                
taskSchema.test.ts
        │
        └── Zod contract

validate.test.ts
        │
        └── HTTP validation middleware

