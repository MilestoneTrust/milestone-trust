# MilestoneTrust Backend

NestJS TypeScript PostgreSQL TypeORM Stellar License: MIT

The MilestoneTrust Backend is a robust NestJS API that powers the MilestoneTrust platform. It provides project management, milestone tracking, and integration with the Soroban smart contract.

## 📚 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## 🎯 Overview
MilestoneTrust Backend enables:

- Project creation and management
- Milestone tracking per project
- User authentication with JWT
- Integration with Soroban smart contract
- Transaction history and audit trails

## ✨ Features

| Feature | Description |
|---------|-------------|
| Project Management | Create, read, update projects |
| Milestone Tracking | Track milestone status and payments |
| JWT Authentication | Secure API access |
| Swagger Documentation | Auto-generated API docs |
| PostgreSQL Database | Persistent data storage |

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | NestJS 10 |
| Language | TypeScript |
| Database | PostgreSQL + TypeORM |
| Authentication | JWT |
| API Docs | Swagger/OpenAPI |

## 📁 Project Structure
src/
├── main.ts # Application entry
├── app.module.ts # Root module
├── modules/
│ └── projects/ # Projects module
│ ├── projects.module.ts
│ ├── projects.controller.ts
│ ├── projects.service.ts
│ ├── dto/
│ │ └── create-project.dto.ts
│ └── entities/
│ └── project.entity.ts

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run start:dev
📡 API Endpoints
Method	Endpoint	Description
POST	/api/v1/projects	Create project
GET	/api/v1/projects	List projects
GET	/api/v1/projects/:id	Get project
GET	/api/v1/projects/client/:address	Get client projects
GET	/api/v1/projects/freelancer/:address	Get freelancer projects
PATCH	/api/v1/projects/:id/status	Update status
GET	/api/v1/projects/stats/:address	Get user stats
🤝 Contributing
Pull requests welcome! See CONTRIBUTING.md for guidelines.

