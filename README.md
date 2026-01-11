# 🧬 Gene Forge Analyzer

[![Build Status](https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer/workflows/Build%20and%20Test/badge.svg)](https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18+-blue)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/python-3.9+-blue)](https://python.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)

> **A comprehensive, production-ready DNA sequence analysis platform** designed for biologists, researchers, and students. Analyze genetic sequences with professional-grade tools, collaborate securely in real-time, and leverage AI-driven insights.

---

## 📑 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies-used)
- [Installation](#-installation)
- [Docker Setup](#-docker-setup)
- [Usage Examples](#-usage-examples)
- [Contributing](#-contributing)
- [Deployment](#-deployment)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Features

### 🔬 Core Analysis Tools
- 🧪 **Sequence Analysis** - Comprehensive base composition stats.
- 📊 **GC Content Analysis** - Sliding window distribution charts.
- ✂️ **CRISPR & Restriction Sites** - Detect PAM sites and enzymatic cleavage points.
- 🎯 **Primer Designer** - Optimize PCR primers with Tm calculation.
- 🧬 **Translation & Alignment** - Amino acid conversion and sequence mutation inspection.
- 🎨 **Motif Search** - High-speed pattern matching.

### 🛡️ Security & Enterprise
- 🔐 **Multi-Factor Authentication** - Secure login via Google OAuth 2.0 and Email OTP.
- 👮 **Role-Based Access Control (RBAC)** - Dedicated Admin Dashboard for system monitoring.
- 🔒 **End-to-End Encryption** - Secure data transmission and AES-256-GCM storage.
- 📜 **Audit Logging** - Complete trail of potentially sensitive user actions.
- ⚖️ **Compliance Ready** - GDPR-compliant data purging and rigorous security policies.

### 🤝 Collaboration & AI
- 💬 **Secure Chat** - Real-time, encrypted collaborative workspace for research teams.
- 🤖 **AI Assistant** - "Biological Intelligence" engine offering explanations in Student or Researcher modes.
- 📁 **Project Management** - Save analysis sessions, manage version history, and restore snapshots.
- 🖥️ **Screen Share** - Integrated collaboration tools (WebRTC ready).

---

## 📋 System Requirements

| Requirement | Version |
|------------|---------|
| **Node.js** | >= 18.0.0 |
| **Python** | >= 3.9 |
| **Docker** | Latest (optional) |
| **Modern Browser** | Chrome, Firefox, Safari, Edge |

## 🚀 Industrial Orchestration

Manage the entire laboratory environment from the root directory:

```bash
# 1. Initialize complete research stack (Install dependencies everywhere)
npm run install:all

# 2. Launch Local Analysis Engine + Dashboard (Concurrent)
npm run dev

# 3. Launch Containerized Cluster
npm run docker:up

# 4. Emergency Port Cleanup (Windows)
npm run clean:ports
```

## 🏗️ Monorepo Architecture

- **`apps/client`**: High-fidelity React + Vite Research Dashboard. (Port 8080/5173)
- **`apps/server`**: Python (Flask) Genomic Analysis Engine with AES-256-GCM. (Port 5000)
- **`docker/`**: Centralized containerization manifests.

### Verify Installation

```bash
# Test build
npm run build -w apps/client

# Check for linting issues
npm run lint -w apps/client
```

---

## 🔐 Security Configuration

### 1. Identity Verification (Google OAuth)
Create `.env` in `apps/client` and `apps/server` using the provided `.env.example` templates.
- **Client**: `VITE_GOOGLE_CLIENT_ID` (Required for login)
- **Server**: `GOOGLE_CLIENT_ID` (Required for token verification)

### 2. Email Services (Optional)
To enable production OTP delivery, configure SMTP in `apps/server/.env`:
```ini
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```
*In development mode, OTP codes are automatically printed to the Flask server console for ease of testing.*

---

## 🐳 Docker Setup

### Build and Run with Docker

```bash
# Build Docker image
docker build -t gene-forge-analyzer -f docker/Dockerfile .

# Run container
docker run -p 5173:5173 -p 5000:5000 gene-forge-analyzer

# Access at http://localhost:5173
```

### Docker Compose (Recommended)

```bash
# Start the application
npm run docker:up

# Rebuild after changes
docker-compose up -d --build
```

**Docker Compose Features:**
- ✅ Automated container health checks
- ✅ Automatic restart on failure
- ✅ Network isolation
- ✅ Easy scaling

---

## 📁 Project Structure

```
gene-forge-analyzer/
├── apps/
│   ├── client/                  # React Frontend
│   │   ├── src/
│   │   │   ├── components/      # UI & Logic Components
│   │   │   ├── pages/           # Route Pages
│   │   │   ├── hooks/           # Auth & Query Hooks
│   │   │   └── utils/           # Analysis Helpers
│   │   └── package.json
│   └── server/                  # Flask Backend
│       ├── app.py               # Main Application Entry
│       ├── ai_engine.py         # AI Logic
│       ├── encryption_utils.py  # Security Lib
│       └── requirements.txt
├── docker/                      # Docker Configs
├── docs/                        # Documentation
├── package.json                 # Monorepo Scripts
└── README.md                    # Project Overview
```

---

## 🛠️ Technologies Used

### Frontend Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **State**: React Query + Context API
- **Real-time**: Socket.io-client
- **Visualization**: Recharts

### Backend Stack
- **Framework**: Python Flask
- **Database**: SQLite (Development) / PostgreSQL Ready
- **Security**: PyCryptodome (AES-GCM), JWT
- **Real-time**: Flask-SocketIO
- **AI**: Custom NLP Heuristics (mockable for LLM integration)

---

## 📦 Usage Examples

### Analyze a DNA Sequence
1. Upload `.fasta` file or paste sequence.
2. View real-time base counts and GC content.
3. Switch tabs to "Applied Genomics" for CRISPR/Primer tools.

### Secure Collaboration
1. Log in via Google or Email OTP.
2. Open the "Secure Collaboration" floating widget.
3. Share your current analysis context with the team in real-time.

### Admin Monitoring
1. Log in as Administrator.
2. Navigate to`/admin/dashboard`.
3. Monitor system health, user activity logs, and AI usage stats.

---

## 🚀 Deployment

### One-Click Deployments

**Vercel (Frontend)**
```bash
cd apps/client
vercel
```

**Render/Railway (Backend)**
Connect your repository and point to `apps/server` directory.

**Docker Hub**
```bash
docker build -t drshankarmote-ai-dev/gene-forge-analyzer .
docker push drshankarmote-ai-dev/gene-forge-analyzer
```

For detailed deployment guides, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Authors & Contributors

- **Project Lead**: Dr. Shankar Mote - [GitHub](https://github.com/drShankarMote-AI-Dev)
- **Contributors**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📞 Support & Feedback

| Channel | Purpose |
|---------|---------|
| 🐛 [Issues](https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer/issues) | Bug reports & feature requests |
| 💬 [Discussions](https://github.com/drShankarMote-AI-Dev/Gene_Forge_Analyzer/discussions) | Questions & ideas |
| 📧 Email | Use GitHub Issues for support |

---

**Happy analyzing! 🧬**

*Last updated: January 2026*


