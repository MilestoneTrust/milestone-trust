# MilestoneTrust Frontend

Next.js TypeScript TailwindCSS Stellar License: MIT

The MilestoneTrust Frontend is a Next.js dashboard that allows clients and freelancers to manage projects, track milestones, and connect their Freighter wallet.

## 📚 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Wallet Integration](#wallet-integration)
- [Contributing](#contributing)

## 🎯 Overview
MilestoneTrust Frontend enables:

- Wallet connection via Freighter
- Project creation with milestones
- Project dashboard and status tracking
- Milestone submission and approval

## ✨ Features

| Feature | Description |
|---------|-------------|
| Wallet Connection | Connect Freighter wallet |
| Create Project | Create projects with multiple milestones |
| Project Dashboard | View all projects and status |
| Milestone Tracking | Track milestone completion |

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Wallet | Freighter API |

## 📁 Project Structure

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
🔗 Environment Variables
Variable	Description
NEXT_PUBLIC_API_URL	Backend API URL
NEXT_PUBLIC_STELLAR_NETWORK	Stellar network (testnet/mainnet)
👛 Wallet Integration
This project uses Freighter wallet for Stellar:

Install Freighter extension

Click "Connect Wallet" button

Approve connection in Freighter

Your wallet address will appear

🤝 Contributing
Pull requests welcome! See CONTRIBUTING.md for guidelines.