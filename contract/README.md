# MilestoneTrust Contract

Rust Soroban Stellar License: MIT

The MilestoneTrust Contract is a production-ready Soroban smart contract that enables milestone-based escrow payments between clients and freelancers.

## 📚 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Contract Functions](#contract-functions)
- [Errors](#errors)
- [Contributing](#contributing)

## 🎯 Overview
MilestoneTrust Contract enables:

- Clients to lock funds in escrow for projects
- Milestone-based fund release
- Dispute resolution with refund/release logic
- On-chain proof of work completion

## ✨ Features

| Feature | Description |
|---------|-------------|
| Project Escrow | Lock total funds before work begins |
| Milestone Management | Add multiple milestones per project |
| Milestone Submission | Freelancers submit completed work |
| Milestone Release | Clients approve and release funds |
| Dispute Resolution | Built-in arbitration mechanism |

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Language | Rust 1.70+ |
| Framework | Soroban SDK 25.1.0 |
| Target | WASM32 |

## 📁 Project Structure
src/
├── lib.rs # Main contract entry
├── escrow.rs # Escrow logic
├── milestone.rs # Milestone management
└── dispute.rs # Dispute resolution

## ⚡ Quick Start

```bash
# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test

# Check formatting
cargo fmt

# Run linter
cargo clippy -- -D warnings
📜 Contract Functions
Function	Description
create_project	Create project, lock funds in escrow
add_milestone	Add milestone to project
start_milestone	Mark milestone as in-progress
submit_milestone	Submit completed milestone
release_milestone_payment	Approve and release payment
raise_dispute	Raise a dispute on milestone
resolve_dispute	Resolve dispute with refund/release
withdraw_remaining	Withdraw remaining escrow balance
❌ Errors
Error	Code	Description
NotAuthorized	1	Only authorized participants
ProjectNotFound	2	Project ID doesn't exist
MilestoneNotFound	3	Milestone ID doesn't exist
InvalidAmount	4	Amount must be positive
InsufficientBalance	5	Not enough funds in escrow
ProjectNotActive	6	Project is cancelled/completed
MilestoneNotPending	7	Milestone already approved/rejected
🤝 Contributing
Pull requests welcome! See CONTRIBUTING.md for guidelines.

