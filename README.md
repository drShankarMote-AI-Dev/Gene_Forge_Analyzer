# 🧬 Gene Forge Analyzer

[![Build Status](https://github.com/yourusername/gene-forge-analyzer/workflows/Build%20and%20Test/badge.svg)](https://github.com/yourusername/gene-forge-analyzer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18+-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5+-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)

> **A comprehensive, production-ready DNA sequence analysis platform** designed for biologists, researchers, and students. Analyze genetic sequences with professional-grade tools for CRISPR detection, primer design, SNP detection, amino acid translation, and much more.

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

✨ **Core Features:**
- 🧪 **Sequence Analysis** - Analyze DNA and RNA sequences with detailed statistics
- 📊 **Base Count Analysis** - Count nucleotide frequencies with visual charts
- 📈 **GC Content Analysis** - Calculate GC content and display comprehensive statistics
- 🔄 **Reading Frames** - Identify all 6 reading frames instantly
- 🧬 **Amino Acid Translation** - Convert DNA sequences to amino acids with codon tables
- 🔙 **Reverse Complement** - Generate reverse complement sequences
- ✂️ **CRISPR Finder** - Detect CRISPR/Cas9 target sites (NGG PAM)
- 🔍 **Restriction Sites** - Find restriction enzyme cut sites across sequences
- 🎯 **Primer Designer** - Design optimized primers for PCR experiments
- 🎨 **Motif Search** - Search for specific DNA motifs and patterns
- 🔬 **SNP Detection** - Identify single nucleotide polymorphisms
- 📋 **Sequence Comparator** - Compare multiple DNA sequences side-by-side
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📥 **Export Reports** - Generate analysis reports in multiple formats

---

## 📋 System Requirements

| Requirement | Version |
|------------|---------|
| **Node.js** | >= 16.0.0 |
| **npm** | >= 8.0.0 |
| **Docker** | Latest (optional) |
| **Modern Browser** | Chrome, Firefox, Safari, Edge |

## 🚀 Quick Start

### Local Development (Fastest Way)

```bash
# Step 1: Clone the repository
git clone https://github.com/yourusername/gene-forge-analyzer.git
cd gene-forge-analyzer

# Step 2: Install dependencies
npm install

# Step 3: Start development server
npm run dev

# Step 4: Open in browser
# Navigate to http://localhost:5173
```

The application will automatically hot-reload as you make changes.

### Verify Installation

```bash
# Test build
npm run build

# Check for linting issues
npm run lint
```

---

## 🐳 Docker Setup

### Build and Run with Docker

```bash
# Build Docker image
docker build -t gene-forge-analyzer -f docker/Dockerfile .

# Run container
docker run -p 5173:5173 gene-forge-analyzer

# Access at http://localhost:5173
```

### Docker Compose (Recommended)

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# View real-time logs
docker-compose logs -f

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
├── src/                         # Source code
│   ├── components/              # React components
│   ├── pages/                   # Page components
│   ├── utils/                   # Analysis utilities
│   ├── hooks/                   # Custom hooks
│   └── theme/                   # Theme configuration
├── docker/
│   └── Dockerfile               # Docker configuration
├── scripts/                     # Build and utility scripts
│   ├── build-docker.bat         # Windows build script
│   └── build-docker.sh          # Linux/macOS build script
├── docs/                        # Documentation
│   ├── CONTRIBUTING.md          # Contribution guidelines
│   ├── DOCKER.md                # Detailed Docker guide
│   └── DEPLOYMENT.md            # Deployment guide
├── tests/                       # Test suite
├── .github/                     # CI/CD workflows
├── public/                      # Static assets
├── docker-compose.yml           # Docker Compose config
├── package.json                 # Project dependencies
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project overview
```

---

## 🛠️ Technologies Used

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI based)
- **Routing**: React Router
- **Forms**: React Hook Form
- **State Management**: React Query
- **Container**: Docker

## 📦 Dependencies

Key dependencies:
- `react` - UI library
- `typescript` - Type safety
- `tailwindcss` - Utility-first CSS framework
- `shadcn/ui` - High-quality UI components
- `react-router-dom` - Client-side routing
- `react-hook-form` - Efficient form handling
- `@tanstack/react-query` - Server state management
- `zod` - TypeScript-first schema validation
- `sonner` - Toast notifications

## 🧪 Usage Examples

### Analyze a DNA Sequence

1. Upload or paste a DNA sequence
2. Select the analysis tools you need
3. View results in real-time
4. Export analysis report as PDF or JSON

### Find CRISPR Sites

1. Navigate to the Tools section
2. Select CRISPR Finder
3. Paste your sequence
4. View detected NGG PAM sites and their locations

### Design Primers

1. Use the Primer Designer tool
2. Input your target sequence
3. Set primer parameters (length, Tm, etc.)
4. Generate and export primer sequences

### Frontend Stack
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI framework | 18+ |
| **TypeScript** | Type safety | 5+ |
| **Vite** | Build tool | Latest |
| **Tailwind CSS** | Styling | 3+ |
| **Shadcn UI** | Component library | Latest |
| **React Router** | Navigation | 6+ |
| **React Hook Form** | Form management | Latest |
| **React Query** | Server state | Latest |
| **Zod** | Schema validation | Latest |
| **Sonner** | Toast notifications | Latest |

### DevOps & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **GitHub Actions** - CI/CD
- **Node.js** - Runtime

---

## 📦 Installation

We welcome contributions from the community! 

**Process:**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes and commit (`git commit -m 'Add amazing feature'`)
4. **Push** to your fork (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request with a clear description

**Guidelines:**
- Follow the existing code style
- Add tests for new features
- Update documentation
- Keep commits clean and descriptive

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

---

## 🚀 Deployment

### One-Click Deployments

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Docker Hub**
```bash
docker build -t yourusername/gene-forge-analyzer .
docker push yourusername/gene-forge-analyzer
```

For detailed deployment guides, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

### Usage Rights
✅ Commercial use  
✅ Modification  
✅ Distribution  
✅ Private use  
❌ No warranty  
❌ No liability

---

## 👨‍💻 Authors & Contributors

- **Project Lead**: Your Name - [GitHub](https://github.com/yourusername)
- **Contributors**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🙏 Acknowledgments

- Built with ❤️ using [Vite](https://vitejs.dev/)
- UI Components from [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- Inspired by modern bioinformatics tools
- Thanks to the open-source community

---

## 📞 Support & Feedback

| Channel | Purpose |
|---------|---------|
| 🐛 [Issues](https://github.com/yourusername/gene-forge-analyzer/issues) | Bug reports & feature requests |
| 💬 [Discussions](https://github.com/yourusername/gene-forge-analyzer/discussions) | Questions & ideas |
| 📧 Email | your.email@example.com |
| 📖 [Docs](./docs/DEPLOYMENT.md) | Detailed documentation |

---

## 🌟 Showcase

Check out what you can do with Gene Forge Analyzer:
- ✅ Analyze complete genomes
- ✅ Detect CRISPR targets for gene editing
- ✅ Design PCR primers
- ✅ Compare multiple sequences
- ✅ Generate research reports

---

## 🎯 Roadmap

**v1.1** (Q1 2024)
- [ ] Batch sequence processing
- [ ] Advanced sequence alignment
- [ ] Export to FASTA format

**v1.2** (Q2 2024)
- [ ] API integration for public databases
- [ ] Sequence annotation tools
- [ ] Collaborative workspace

**v2.0** (Q3 2024)
- [ ] Machine learning predictions
- [ ] Real-time collaboration
- [ ] Mobile app

---

**Happy analyzing! 🧬**

*Last updated: January 5, 2026*
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e6be6327-6923-4cdb-9afc-cc5813d3a745) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
