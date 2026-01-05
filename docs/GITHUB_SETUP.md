# GitHub Setup Guide

## Before Pushing to GitHub

This guide helps you prepare Gene Forge Analyzer for GitHub publication.

### 1. Update package.json

The following fields in `package.json` have been updated:
- ✅ `name`: Changed to "gene-forge-analyzer"
- ✅ `description`: Added comprehensive project description
- ✅ `version`: Updated to "1.0.0"
- ✅ `private`: Changed to false (public repository)
- ✅ `license`: Set to "MIT"
- ✅ `repository`: Add your GitHub URL
- ✅ `homepage`: Add your GitHub URL
- ✅ `bugs`: Add your issues URL
- ✅ `keywords`: Added relevant search terms
- ✅ `engines`: Specified Node.js and npm requirements

**Update these placeholders:**
```json
"author": "Your Name <your.email@example.com>",
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR_USERNAME/gene-forge-analyzer.git"
},
"homepage": "https://github.com/YOUR_USERNAME/gene-forge-analyzer",
"bugs": {
  "url": "https://github.com/YOUR_USERNAME/gene-forge-analyzer/issues"
}
```

### 2. Update README.md

The README has been created with:
- ✅ Project overview and badges
- ✅ Feature list
- ✅ Quick start instructions
- ✅ Installation guide
- ✅ Docker setup
- ✅ Contributing guidelines
- ✅ Deployment instructions
- ✅ License information

**Update these in README.md:**
- Replace `yourusername` with your GitHub username in all URLs
- Add screenshots if available
- Update live demo link if hosted

### 3. Environment Files

Ensure sensitive files are in .gitignore:
- ✅ `.env` files (already configured)
- ✅ `node_modules` (already configured)
- ✅ `dist` build output (already configured)

### 4. GitHub Setup Steps

#### Step 1: Create Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `gene-forge-analyzer`
3. Description: "A comprehensive DNA sequence analysis platform"
4. Choose: Public
5. **Don't** initialize with README, .gitignore, or license (you have them)
6. Click "Create repository"

#### Step 2: Initialize and Push

```powershell
# Navigate to your project directory
cd C:\Users\Scien\OneDrive\Desktop\GitHub\Gene_Forge_Analyzer

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit with a meaningful message
git commit -m "Initial commit: Gene Forge Analyzer v1.0.0

- Production-ready DNA sequence analysis platform
- Features: CRISPR detection, primer design, SNP detection, etc.
- Built with React, TypeScript, and Vite
- Includes Docker configuration
- MIT License"

# Add remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/gene-forge-analyzer.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

### 5. Post-Push GitHub Configuration

#### Enable Features
1. Go to your repository Settings
2. **General**:
   - ✅ Enable "Discussions" (for community Q&A)
   - ✅ Enable "Issues" (for bug reporting)
   
3. **Pages** (to host live demo):
   - Set source to `gh-pages` branch
   - Build and deployment: GitHub Actions
   
4. **Actions**:
   - Enable GitHub Actions for CI/CD

#### Add GitHub Actions Workflow

Create `.github/workflows/build.yml`:
```yaml
name: Build and Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Build application
      run: npm run build
```

### 6. Add Topics (Tags)

On your GitHub repo page, add topics:
- `dna`
- `genetics`
- `bioinformatics`
- `crispr`
- `react`
- `typescript`
- `sequence-analysis`
- `vite`

### 7. Create Release

```bash
# Create a git tag
git tag -a v1.0.0 -m "Release version 1.0.0: Initial public release"

# Push tags
git push origin --tags
```

Then on GitHub:
1. Go to Releases
2. Click "Create a release"
3. Select tag `v1.0.0`
4. Add release notes
5. Attach binary if applicable

### 8. Add Social Preview (Optional)

1. Go to Settings → Social preview
2. Upload a 1200x630px image representing the project

### 9. Add Collaborators (Optional)

Settings → Collaborators → Add people

### 10. Configure Branch Protection (Optional)

Settings → Branches → Add rule:
- Pattern: `main`
- Require pull request reviews before merging
- Require status checks to pass

## Pre-Push Checklist

- [ ] All dependencies installed: `npm install`
- [ ] No build errors: `npm run build`
- [ ] Linter passes: `npm run lint`
- [ ] .gitignore is complete
- [ ] No sensitive data in tracked files
- [ ] README.md is updated with your info
- [ ] package.json metadata is complete
- [ ] LICENSE file is present (MIT)
- [ ] CONTRIBUTING.md exists
- [ ] DEPLOYMENT.md exists
- [ ] DOCKER.md exists
- [ ] Git is initialized: `git init`

## Common Issues

### "fatal: could not read Username"
Add credentials to Windows Credential Manager:
1. Control Panel → Credential Manager → Windows Credentials
2. Add generic credential:
   - Internet or network address: `https://github.com`
   - Username: Your GitHub username
   - Password: Your GitHub personal access token

### "Permission denied (publickey)"
Generate SSH key:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Add to GitHub Settings → SSH and GPG keys
git remote set-url origin git@github.com:YOUR_USERNAME/gene-forge-analyzer.git
```

### Branches Don't Match
Rename master to main:
```bash
git branch -m main
git push -u origin main
```

## After Publishing

1. Star your own repository (helps with visibility)
2. Share on Twitter/LinkedIn
3. Add to relevant DEV communities
4. Consider submitting to:
   - GitHub Awesome lists
   - Product Hunt (if desired)
   - Hacker News (if appropriate)

## Maintenance

- Keep dependencies updated: `npm update`
- Monitor security advisories: `npm audit`
- Review and merge pull requests
- Respond to issues promptly
- Update documentation as needed

## Resources

- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Markdown Guide](https://guides.github.com/features/mastering-markdown/)
- [Open Source Guides](https://opensource.guide/)
