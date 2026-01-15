# 🧬 Gene Forge Analyzer

[![Build Status](https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer/workflows/Build%20and%20Test/badge.svg)](https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18+-blue)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/python-3.9+-blue)](https://python.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)

> **A comprehensive, production-ready DNA sequence analysis platform** designed for biologists, researchers, and students. Analyze genetic sequences with professional-grade tools, collaborate securely in real-time, and leverage AI-driven insights within a sleek, clinical-grade interface.

---

## 📑 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Administrative Command Terminal](#-administrative-command-terminal)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies-used)
- [Installation](#-installation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Features

### 🔬 Core Analysis Tools
- 🧪 **Sequence Analysis**: Comprehensive base composition statistics and molecular weight calculations.
- 📊 **GC Content Visualization**: Dynamic sliding window distribution charts powered by Recharts.
- ✂️ **CRISPR & Restriction Mapping**: Automated detection of PAM sites and enzymatic cleavage points.
- 🎯 **Primer Designer**: Advanced PCR primer optimization with real-time Tm calculation.
- 🧬 **Mutation & Alignment**: Amino acid conversion, ORF finding, and sequence mutation inspection.
- 🎨 **Motif Discovery**: High-speed pattern matching and regulatory element search.

### 🛡️ Security & Enterprise (Identity Orchestration)
- 🔐 **Multi-Factor Authentication**: Secure login via Google OAuth 2.0 and Email OTP.
- 👷 **Role-Based Access Control (RBAC)**: Hierarchical permissions (User, Researcher, Admin) with strict boundary enforcement.
- 🔒 **End-to-End Encryption**: AES-256-GCM encryption for sensitive research data at rest and in transit.
- 📜 **Audit Logging**: Immutable forensic telemetry for all system actions.
- ⚖️ **Compliance Ready**: Foundations for GDPR-compliant data handling and security policies.

### 🤝 Collaboration & AI
- 💬 **Secure Research Chat**: Real-time, encrypted collaborative workspace for teams.
- 🤖 **Bio-AI Assistant**: "Biological Intelligence" engine capable of explaining complex genomic data in Student or Researcher modes.
- 📁 **Project Management**: Version-controlled analysis sessions with snapshot restoration.
- 🖥️ **AI Gateway**: Integrated monitoring of API consumption and neural model health.

---

## 🚀 Quick Start

Initialize the complete research stack from the root directory:

```bash
# 1. Initialize environment (Install Node & Python dependencies)
npm run install:all

# 2. Launch Local Analysis Engine + Dashboard (Concurrent)
# CLIENT: http://localhost:8080 | SERVER: http://localhost:5000
npm run dev

# 3. Establish Admin Access (CLI)
# Open a new terminal to run admin commands
python admin.py reset --email admin@geneforge.com --password admin
```

> **Note:** The `dev` command automatically handles port cleaning and concurrent execution of both client and server.

---

## 🖥️ Administrative Command Terminal

The `admin.py` utility provides a unified interface for managing the laboratory cluster.

| Command | Description |
|---------|-------------|
| `python admin.py status` | Monitor real-time telemetry, node counts, and neural health. |
| `python admin.py list`   | Inventory all accounts with administrative permissions. |
| `python admin.py reset`  | Securely reset credentials or create a new Admin node. |
| `python admin.py fix`    | Synchronize and force role permissions for a node. |

---

## 🏗️ Monorepo Architecture

This project follows a strict monorepo structure using modern tooling:

- **`apps/client`**: High-fidelity React + Vite Research Dashboard.
  - *Tech:* React 18, TailwindCSS, Shadcn UI, Recharts, Socket.IO Client.
- **`apps/server`**: Python (Flask) Genomic Analysis Engine.
  - *Tech:* Flask, Eventlet, PyCryptodome, SQLite/PostgreSQL, OpenAI/Gemini integration.
- **`admin.py`**: Unified system management CLI.

### 🔌 Centralized Orchestration
- **`src/utils/api.ts`**: Intelligent fetch wrapper that auto-resolves endpoints (Local vs. Cloud).
- **`src/utils/socket.ts`**: Unified Socket.IO instance for low-latency P2P collaboration.

---

## 🌐 Deployment

### Vercel (Frontend) & Render (Backend)
The platform is optimized for modern cloud ecosystems with pre-configured headers and networking triggers.

1.  **Backend (Render/Docker)**:
    -   Uses `gunicorn` with `eventlet` workers for WebSocket support.
    -   Environment variables control CORS (`ALLOWED_ORIGINS`) and Security (`JWT_COOKIE_SECURE`).

2.  **Frontend (Vercel)**:
    -   Connects to backend via `VITE_API_URL`.
    -   Supports SPA routing via `vercel.json` rewrites.

### Production Environment Variables
Ensure these are configured in your deployment settings:
- `VITE_API_URL`: Path to your backend (e.g., `https://api.yourdomain.com`).
- `FRONTEND_URL`: URL of your frontend for session integrity.
- `ALLOWED_ORIGINS`: Comma-separated list of permitted origin domains.
- `JWT_COOKIE_SECURE`: `True` (Mandatory for HTTPS).

---

## 🛠️ Technologies Used

### Frontend Stack
- **Framework**: React 18 + Vite (SWC)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS + Shadcn UI (Clinical Theme)
- **State**: React Query + Context API
- **Real-time**: Socket.IO Client 4

### Backend Stack
- **Framework**: Python Flask + Eventlet
- **Server**: Gunicorn
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Security**: PyCryptodome (AES-GCM), JWT-Extended
- **AI**: OpenAI & Gemini API Integration

---

## 🐳 Docker Setup

For containerized deployment, use the included Docker Compose configuration:

```bash
# Build and Start the application stack
npm run docker:up

# Rebuild containers after changes
npm run docker:build
```

---

## 👨‍💻 Authors & Contributors

- **Project Lead**: Dr. Shankar Mote - [GitHub](https://github.com/drShankarMote-AI-Dev)

---
**Happy Analyzing! 🧬**
