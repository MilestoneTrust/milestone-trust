# MilestoneTrust

A robust, full-stack platform for **milestone-based escrow payments** on Stellar. Clients lock funds in a Soroban smart contract, and freelancers get paid automatically as each milestone is completed.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Smart Contract](#smart-contract)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Docker](#docker)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## 🎯 Overview

**MilestoneTrust** is a decentralized platform that solves the trust problem between clients and freelancers.

The platform provides:

- **Project Escrow** - Clients lock total funds in a Soroban smart contract before work begins
- **Milestone Management** - Create multiple milestones with individual amounts
- **Milestone Submission** - Freelancers submit completed work for each milestone
- **Milestone Release** - Clients approve and release funds per milestone
- **Dispute Resolution** - Built-in arbitration with refund/release logic
- **API Documentation** - Auto-generated Swagger documentation

---

## 🛠 Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Smart Contract | Rust (Soroban SDK) | 25.1.0 |
| Backend Framework | NestJS | 10.x |
| Backend Language | TypeScript | 5.x |
| Frontend Framework | Next.js | 14.2 |
| Frontend Language | TypeScript | 5.x |
| Mobile Framework | React Native | 0.72 |
| Database | PostgreSQL | 15.x |
| ORM | TypeORM | 0.3.x |
| Wallet | Freighter API | 1.7.1 |
| Testing | Jest | 29.x |
| API Docs | Swagger/OpenAPI | 7.x |
| Linting | ESLint | 8.x |
| Formatting | Prettier | 3.x |

---

## 📁 Project Structure

```
milestone-trust/
├── backend/                        # NestJS Backend API
│   ├── src/
│   │   ├── main.ts                 # Application entry point
│   │   ├── app.module.ts           # Root module
│   │   ├── app.controller.ts       # Root controller
│   │   ├── app.service.ts          # Root service
│   │   │
│   │   ├── common/                 # Shared utilities and components
│   │   │   ├── decorators/         # Custom decorators (auth, roles, etc.)
│   │   │   ├── filters/            # Exception filters
│   │   │   ├── guards/             # Authentication & authorization guards
│   │   │   ├── interceptors/       # Request/response interceptors
│   │   │   ├── pipes/              # Validation and transformation pipes
│   │   │   ├── dtos/               # Common DTOs (pagination, responses)
│   │   │   └── utils/              # Utility functions and helpers
│   │   │
│   │   ├── config/                 # Configuration management
│   │   │   ├── database.config.ts
│   │   │   ├── app.config.ts
│   │   │   └── validation.schema.ts
│   │   │
│   │   ├── database/               # Database setup and migrations
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   └── entities/           # Database entities
│   │   │
│   │   ├── modules/                # Feature modules
│   │   │   └── projects/           # Projects module
│   │   │       ├── projects.module.ts
│   │   │       ├── projects.controller.ts
│   │   │       ├── projects.service.ts
│   │   │       ├── dto/
│   │   │       │   └── create-project.dto.ts
│   │   │       └── entities/
│   │   │           └── project.entity.ts
│   │   │
│   │   └── shared/                 # Shared services (mail, notifications, etc.)
│   │       ├── mail/
│   │       ├── notifications/
│   │       └── logger/
│   │
│   ├── test/                       # End-to-end tests
│   │   └── app.e2e.spec.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── jest.config.js
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── .gitignore
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── contract/                       # Rust Soroban Smart Contract
│   ├── src/
│   │   ├── lib.rs                  # Main contract entry
│   │   ├── escrow.rs               # Escrow logic
│   │   ├── milestone.rs            # Milestone management
│   │   └── dispute.rs              # Dispute resolution
│   ├── Cargo.toml
│   └── README.md
│
├── frontend/                       # Next.js Dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout
│   │   │   └── page.tsx            # Home page
│   │   ├── components/
│   │   │   └── wallet/
│   │   │       └── WalletConnect.tsx
│   │   ├── lib/
│   │   │   └── stellar/
│   │   │       └── freighter.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── README.md
│
├── mobile/                         # React Native App (Coming Soon)
│   └── src/
│
├── .github/
│   └── workflows/                  # CI/CD pipelines
│
├── .gitignore
├── LICENSE
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Installation |
|-------------|---------|--------------|
| Node.js | 18.x+ | [nodejs.org](https://nodejs.org/) |
| npm | 9.x+ | Included with Node.js |
| Rust | 1.70+ | [rustup.rs](https://rustup.rs/) |
| PostgreSQL | 15.x+ | [postgresql.org](https://www.postgresql.org/) |
| Freighter Wallet | Latest | [freighter.app](https://www.freighter.app/) |

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/MilestoneTrust/milestone-trust.git
cd milestone-trust/backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials

# Run database migrations
npm run typeorm migration:run

# Start the development server
npm run start:dev
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

### Contract Setup

```bash
cd ../contract

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/milestone_trust_contract.wasm \
  --network testnet
```

---

## 💻 Development

### Available Scripts - Backend

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start:prod` | Run production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run test:e2e` | Run end-to-end tests |

### Available Scripts - Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |

### Code Style

This project uses **ESLint** and **Prettier** for code consistency:

```bash
# Format all files
npm run format

# Check and fix linting issues
npm run lint
```

### Environment Variables

See `.env.example` for all available environment variables:

```env
# App
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=milestone_trust

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d

# Stellar
STELLAR_NETWORK=testnet
HORIZON_URL=https://horizon-testnet.stellar.org
CONTRACT_ID=your_contract_id_here

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## 📜 Smart Contract

### Contract Functions

| Function | Description | Auth |
|----------|-------------|------|
| `create_project` | Create project, lock funds in escrow | Client |
| `add_milestone` | Add milestone to project | Client |
| `start_milestone` | Mark milestone as in-progress | Freelancer |
| `submit_milestone` | Submit completed milestone | Freelancer |
| `release_milestone_payment` | Approve and release payment | Client |
| `raise_dispute` | Raise a dispute on milestone | Either party |
| `resolve_dispute` | Resolve dispute with refund/release | Arbitrator |
| `withdraw_remaining` | Withdraw remaining escrow balance | Client |

### Contract Errors

| Error | Code | Description |
|-------|------|-------------|
| `NotAuthorized` | 1 | Only authorized participants can call |
| `ProjectNotFound` | 2 | Project ID does not exist |
| `MilestoneNotFound` | 3 | Milestone ID does not exist |
| `InvalidAmount` | 4 | Amount must be positive |
| `InsufficientBalance` | 5 | Not enough funds in escrow |
| `ProjectNotActive` | 6 | Project is cancelled or completed |
| `MilestoneNotPending` | 7 | Milestone already approved/rejected |

---

## 📚 API Documentation

API documentation is available via Swagger at:

```
http://localhost:3001/api/docs
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/projects` | Create a new project |
| GET | `/api/v1/projects` | List all projects |
| GET | `/api/v1/projects/:id` | Get project by ID |
| GET | `/api/v1/projects/projectId/:projectId` | Get project by projectId |
| GET | `/api/v1/projects/client/:address` | Get projects by client address |
| GET | `/api/v1/projects/freelancer/:address` | Get projects by freelancer address |
| PATCH | `/api/v1/projects/:id/status` | Update project status |
| GET | `/api/v1/projects/stats/:address` | Get user statistics |

---

## 🧪 Testing

### Running Tests - Backend

```bash
# Run all unit tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e
```

### Writing Tests - Backend

Create test files next to the modules with `.spec.ts` suffix:

```typescript
// Example: projects.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### Running Tests - Contract

```bash
cd contract
cargo test
cargo test -- --nocapture  # With output
```

---

## 🐳 Docker

### Build Backend Image

```bash
cd backend
docker build -t milestone-trust-backend .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Docker Compose Configuration

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: milestone_trust
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      DB_DATABASE: milestone_trust

volumes:
  postgres_data:
```

---

## 🤝 Contributing

We welcome contributions! Please read our `CONTRIBUTING.md` for detailed guidelines on:

- Setting up your development environment
- Making code changes
- Creating pull requests
- Code review process
- Commit message conventions

### Commit Convention

We follow **conventional commits**:

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation update |
| `style` | Code style changes |
| `refactor` | Code refactor |
| `test` | Add or update tests |
| `chore` | Maintenance tasks |

---

## 🔒 Security

- **Never** commit `.env` files with sensitive data
- **Always** use environment variables for secrets
- **Validate** all user inputs
- **Follow** OWASP security guidelines
- **Report** security issues to `security@milestonetrust.com`

---

## 🏆 Drips Wave

This project participates in the **Stellar Drips Wave Program**.

| Difficulty | Points | Example Issues |
|------------|--------|----------------|
| Easy | 100 | UI improvements, documentation |
| Medium | 150 | API endpoints, milestone tracking |
| Hard | 200 | Dispute resolution, contract optimization |

---

## 🆘 Support

For issues, questions, or suggestions:

- Check existing [GitHub Issues](https://github.com/MilestoneTrust/milestone-trust/issues)
- Create a new issue with a clear description
- Contact the maintainers

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Built on Stellar Soroban | Decentralized Freelance Payments**