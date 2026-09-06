# LifeOS

LifeOS is a simple personal operating system designed to reduce the gap between intention and action.

## Current stage

Product foundation + database design.

## Core principle

> Action over organization.

LifeOS should help the user decide what matters and act, rather than spend time organizing.

## MVP

- Today Dashboard
- Today's Focus
- Quick Capture
- Kanban: INBOX → IN_PROGRESS → DONE
- Tasks
- Goals
- Daily Review
- Mobile-friendly web experience

## Stack

- Backend: Node.js + Express + TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Frontend: React + Vite + TypeScript
- Styling: Tailwind CSS
- Infrastructure: Docker / Docker Compose
- API: REST

## Architecture

Browser → React → REST API → Express → Service → Repository → Prisma → PostgreSQL
