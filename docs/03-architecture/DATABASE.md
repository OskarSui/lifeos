# Database Design

## MVP entities

- User
- Goal
- Task
- DailyFocus

## Relationships

User 1:N Goal
User 1:N Task
User 1:N DailyFocus
Goal 1:N Task
Task 1:N DailyFocus

## Important rule

A task can be Today's Focus on multiple dates.

Example:

2026-09-05 → Build API
2026-09-06 → Build API
2026-09-07 → Finish API

There is only one focus task per user per date.

This is enforced with:

@@unique([userId, date])
