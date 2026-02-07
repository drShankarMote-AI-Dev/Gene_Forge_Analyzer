# 🏗️ System Architecture

This document describes the high-level architecture of Gene Forge Analyzer.

## 📁 Monorepo Structure

```text
Gene_Forge_Analyzer/
├── apps/
│   ├── frontend/         # React SPA (Vite, TS)
│   └── backend/          # Flask API (Python, SQLA)
├── docs/                 # Technical documentation
├── scripts/              # Devops & Automation scripts
└── .github/              # CI/CD Workflows
```

## 🔄 Data Flow

1. **Analysis Request**: The user enters a DNA sequence in the React frontend.
2. **Local Processing**: Basic stats (length, composition) are calculated in the browser.
3. **API Submission**: The sequence is sent to the Flask backend via JWT-secured POST request.
4. **Bio-Engine processing**:
   - `Bio-Python` logic handles translation and restriction mapping.
   - `AI Engine` routes the request to OpenAI gpt-4o or Gemini 2.0 based on availability.
5. **Persistence**: The results and sequence are encrypted using **AES-256-GCM** and saved to the database.
6. **Streaming Response**: The AI explanation is streamed back to the frontend for real-time reporting.

## 🔐 Security Model

### Persistence Layer
- DNA sequences are NEVER stored in plaintext.
- We use a derivation of the user's password + unique salt to generate an encryption key.
- Results are stored as encrypted blobs.

### Authentication
- JWT stored in `HTTPOnly` SameSite biscuits (cookies).
- Token rotation enabled.
- Session-based logging for all admin actions.

## 🤖 AI Interpretation Engine

The AI integration layer supports multi-provider failover:
1. **Primary**: OpenAI (gpt-4o)
2. **Fallback**: Google Gemini (gemini-2.0-flash-exp)
3. **Gateway**: Custom AI analysis gateway (if configured)

The prompts are specialized for biologists, providing technical research summaries with CRISPR feasibility scores.

## 🚀 Deployment Strategy

- **Production**: Root Docker-build (Unified) generates a single artifact.
- **CI/CD**: GitHub Actions runs linting and builds the docker image.
- **Hosting**: Backend compatible with Render/Railway, Frontend with Vercel/Netlify.
