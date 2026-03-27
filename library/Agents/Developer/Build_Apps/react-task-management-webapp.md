---
title: "🤖 React Task Management Web App"
tags: ["it", "build-apps", "react", "task", "management"]
category: "IT"
subcategory: "Build_Apps"
---
# React Task Management Web App

Build a comprehensive Task Management Web Application from scratch. The application should allow users to create, organize, and track tasks across different projects with collaborative features.

---

## Role & Context

You are a senior full-stack web developer and UI/UX expert with extensive experience in React ecosystem and modern web architecture.

**Tech Stack (Fixed):**
- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, TypeScript (RESTful API)
- **Database:** PostgreSQL (with Prisma ORM)
- **State Management:** Redux Toolkit or React Query
- **Deployment:** Vercel (Frontend), Render/Heroku (Backend)

---

## Product Requirements

### Core Features

#### 1) User Authentication & Authorization
Secure access control and user identity management.
- Email/password registration and login with JWT.
- Role-based access control (Admin, Project Manager, Team Member).
- OAuth integration (Google, GitHub) for quick sign-in.

#### 2) Project & Task Management
Core functionality to organize work.
- Create, edit, and archive projects.
- Create tasks within projects, assign to users, set due dates and priorities.
- Kanban board view with drag-and-drop functionality for task statuses (To Do, In Progress, Review, Done).

#### 3) Collaboration & Notifications
Features to keep teams aligned.
- Real-time updates on task changes (via WebSockets).
- Comments on tasks with @mentions.
- In-app and email notifications for assignments and approaching deadlines.

---

## Technical Requirements

### Architecture
A decoupled client-server architecture. The frontend will be a Single Page Application (SPA) consuming a RESTful API provided by the Node.js backend. Real-time features will be handled via Socket.io.

### Data Model
- **User:** ID, Name, Email, PasswordHash, Role, CreatedAt
- **Project:** ID, Name, Description, OwnerID, CreatedAt
- **Task:** ID, Title, Description, Status, Priority, ProjectID, AssigneeID, DueDate
- **Comment:** ID, TaskID, UserID, Content, CreatedAt

### API Design
- `POST /api/auth/login` - Authenticate user
- `GET /api/projects` - List user's projects
- `POST /api/projects/:id/tasks` - Create a task in a project
- `PUT /api/tasks/:id` - Update task details (status, assignee, etc.)

### Security Requirements
- All API endpoints (except login/register) must be protected with JWT authentication.
- Password hashing using bcrypt.
- Input validation and sanitization using Zod or Joi.
- CORS configuration to only allow the specific frontend origin.

### Performance Requirements
- Initial page load time under 1.5 seconds.
- API response time under 200ms for 95th percentile.

---

## Implementation Details

### Frontend Architecture
Organize the React codebase using a feature-based folder structure.
- `src/features/auth` - Authentication logic and UI
- `src/features/projects` - Project listing and management
- `src/features/tasks` - Kanban board and task details
- Use custom hooks for reusable business logic.

### Backend Setup
Implement a layered architecture.
- Routes -> Controllers -> Services -> Repositories (Prisma)
- Centralized error handling middleware.

---

## UI/UX Requirements

### Key Pages/Views
1. **Dashboard:** Overview of active projects, assigned tasks, and recent notifications.
2. **Project Board:** Kanban-style board showing tasks categorized by status.
3. **Task Details Modal:** Overlay showing full task information, assignee, dates, and comment thread.

### Design Principles
- Clean, minimalist interface with ample whitespace.
- Consistent typography and color palette defined in Tailwind config.
- Responsive design ensuring full functionality on mobile, tablet, and desktop.

---

## Testing & Validation

### Unit Tests
- Test utility functions and custom React hooks using Vitest and React Testing Library.
- Test backend services and utility functions using Jest.

### Integration Tests
- Test API endpoints with Supertest.
- Test Redux/React Query state transitions.

### E2E Tests
- Complete user flows (login -> create project -> create task -> move task) using Playwright or Cypress.

---

## Deployment & Operations

### Environment Setup
- `.env` template required for both frontend and backend.
- Define `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`.

### Deployment Steps
1. Provision PostgreSQL database.
2. Deploy backend API and run Prisma migrations.
3. Build and deploy frontend SPA, linking it to the backend URL.

### Monitoring & Logging
- Integrate Sentry for frontend and backend error tracking.
- Structured logging on the backend using Winston or Pino.

---

## Documentation Requirements

Generate:
- [ ] README.md with setup instructions for both frontend and backend
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Architecture diagram
- [ ] Database schema diagram (ERD)
- [ ] Deployment guide

---

## Constraints & Limitations

- Must support modern browsers (Chrome, Firefox, Safari, Edge).
- Real-time updates should gracefully degrade to polling if WebSockets fail.
- Total bundle size should not exceed 1MB (minified and gzipped).

---

## Success Criteria

The project is complete when:
- [ ] A user can register, log in, and log out.
- [ ] A user can create a project and invite others.
- [ ] Tasks can be created, edited, and moved across the Kanban board.
- [ ] Real-time updates reflect instantly for other connected users.
- [ ] All tests pass in the CI/CD pipeline.

---

## Tags

`#project` `#react` `#typescript` `#nodejs` `#build` `#webapp`

---

**Version:** 1.0 | **Created:** 2024-03-05 | **Updated:** 2024-03-05