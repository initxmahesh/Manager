# Preparation Dashboard

A personal preparation dashboard built with Next.js App Router for tracking Loksewa exam preparation and software engineering job hunting. Uses Google Sheets API v4 as its database.

## Features

- **Dashboard** — Overview with stats, today's timeline, weekly goals, and follow-ups
- **Daily Schedule** — Plan and manage tasks by day type (weekday/saturday/sunday)
- **Loksewa Tracker** — Log study sessions, track mock exam scores, identify weak areas
- **Job Applications** — Kanban board with drag-and-drop status management
- **Weekly Goals** — Set and track weekly targets with progress visualization
- **Real-time Sync** — 15-second polling with optimistic updates
- **Dark Mode** — System-aware theme with manual toggle

## Tech Stack

- Next.js (App Router) + TypeScript
- Google Sheets API v4 (database)
- Tailwind CSS + shadcn/ui components
- @dnd-kit (drag and drop)
- Recharts (data visualization)
- Zod + React Hook Form (validation)
