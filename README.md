# 🧬 Gene Forge Analyzer

[![Build Status](https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer/workflows/Build%20and%20Test/badge.svg)](https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18+-blue)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/python-3.9+-blue)](https://python.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)

> **A comprehensive, production-ready DNA sequence analysis platform** designed for biologists, researchers, and students. Analyze genetic sequences with professional-grade tools, collaborate securely in real-time, and leverage AI-driven insights with a sleek, clinical-grade premium interface.

---

## 📑 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Administrative Command Terminal](#-administrative-command-terminal)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies-used)
- [Installation](#-installation)
- [Docker Setup](#-docker-setup)
- [Usage Examples](#-usage-examples)
- [Contributing](#-contributing)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🌟 Features

### 🔬 Core Analysis Tools
- 🧪 **Sequence Analysis** - Comprehensive base composition stats.
- 📊 **GC Content Analysis** - Sliding window distribution charts with Recharts.
- ✂️ **CRISPR & Restriction Sites** - Detect PAM sites and enzymatic cleavage points.
- 🎯 **Primer Designer** - Optimize PCR primers with Tm calculation.
- 🧬 **Translation & Alignment** - Amino acid conversion and sequence mutation inspection.
- 🎨 **Motif Search** - High-speed pattern matching.

### 🛡️ Security & Enterprise (Identity Orchestration)
- 🔐 **Multi-Factor Authentication** - Secure login via Google OAuth 2.0 and Email OTP.
- 👷 **Role-Based Access Control (RBAC)** - Clear distinction between standard Users, Researchers, and Admins.
- 🔒 **End-to-End Encryption** - Secure data transmission and AES-256-GCM storage.
- 📜 **Audit Logging** - Complete trail of forensic telemetry in a functional leaderboard view.
- ⚖️ **Compliance Ready** - GDPR-compliant data purging and rigorous security policies.

### 🤝 Collaboration & AI
- 💬 **Secure Chat** - Real-time, encrypted collaborative workspace for research teams.
- 🤖 **AI Assistant** - "Biological Intelligence" engine offering explanations in Student or Researcher modes.
- 📁 **Project Management** - Save analysis sessions, manage version history, and restore snapshots.
- 🖥️ **AI Gateway** - Dedicated monitoring of neural health and API consumption.

---

## 🚀 Quick Start

Initialize the complete research stack from the root directory:

```bash
# 1. Initialize environment
npm run install:all

# 2. Launch Local Analysis Engine + Dashboard (Concurrent)
npm run dev

# 3. Establish Admin Access (CLI)
python admin.py reset --email admin@geneforge.com --password admin
```

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

- **`apps/client`**: High-fidelity React + Vite Research Dashboard. (Port 5173 / Proxy 8080)
- **`apps/server`**: Python (Flask) Genomic Analysis Engine with AES-256-GCM. (Port 5000)
- **`admin.py`**: Unified system management CLI.

---

## 🛠️ Technologies Used

### Frontend Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Shadcn UI (Clinical Theme)
- **State**: React Query + Context API
- **Visualization**: Recharts

### Backend Stack
- **Framework**: Python Flask
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Security**: PyCryptodome (AES-GCM), JWT-Extended
- **Real-time**: Flask-SocketIO

---

## 🐳 Docker Setup

### Docker Compose (Recommended)

```bash
# Start the application
npm run docker:up

# Rebuild after changes
docker-compose up -d --build
```

---

### Production Startup
To run the backend in a production environment (using Gunicorn):
```bash
npm run start:server
```

Ensure the following environment variables are set in production:
- `VITE_API_URL`: Fully qualified URL to your backend API (e.g., `https://api.yourdomain.com/api`).
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs for CORS.
- `JWT_COOKIE_SECURE`: Set to `True` for HTTPS.

---

## 👨‍💻 Authors & Contributors

- **Project Lead**: Dr. Shankar Mote - [GitHub](https://github.com/drShankarMote-AI-Dev)

**Happy analyzing! 🧬**
*Last updated: January 2026*
