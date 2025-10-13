<!-- markdownlint-enable MD033 -->

# Contributing to GroqTales

[![GSSOC'25](https://img.shields.io/badge/GSSOC'25-Read%20More-orange?style=flat-square)](docs/GSSOC'25.md)

Thank you for your interest in contributing to **GroqTales**, an AI-powered Web3 storytelling
platform! We welcome developers, writers, designers, and blockchain enthusiasts to help us build a
creative, open, and secure platform. Please read this guide before getting started.

---

## Table of Contents

- [GSSOC'25](docs/GSSOC'25.md)
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Using Issue Templates](#using-issue-templates)
- [Development Setup](#development-setup)
- [Repository Structure & Architecture](#repository-structure--architecture)
- [Coding Guidelines](#coding-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Labeling & Tagging](#labeling--tagging)
- [Documentation](#documentation)
- [Community & Support](#community--support)

---

## GSSOC'25

Are you contributing as part of **GirlScript Summer of Code 2025**? Please see our
[GSSOC'25.md](.docs/GSSOC'25.md) for program-specific guidelines, communication channels, and task
lists.

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for everyone. By participating,
you agree to:

- Be respectful of different viewpoints and experiences.
- Gracefully accept constructive criticism.
- Focus on what is best for the community and project.
- Show empathy toward other community members.

For more, see [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

---

## How Can I Contribute?

You can contribute in several ways:

- **Reporting Bugs:** Use the `bug_report.md` template and provide detailed steps to reproduce.
- **Suggesting Features/Enhancements:** Use the `feature.md` template to propose new ideas.
- **Code Contributions:** Pick up issues labeled `good first issue`, `easy`, `medium`, or `hard`
  based on your experience.
- **Web3/Blockchain Issues:** Use the `web3_issue.md` template for blockchain/NFT-related
  contributions.
- **Security Reports:** Use the `security.md` template for vulnerabilities.
- **Documentation:** Help improve this README, the Wiki, or code comments.
- **Testing:** Write or improve tests for higher code quality.

---

## Using Issue Templates

**Before opening any issue or pull request, you must use the relevant template provided in
`.github/ISSUE_TEMPLATE/`.** Templates include:

- `bug_report.md` – For bugs or unexpected behavior
- `feature.md` – For new features or enhancements
- `web3_issue.md` – For blockchain/NFT/Web3-specific issues
- `security.md` – For vulnerabilities or security concerns
- `basic.md` – For small tasks, typos, or minor requests
- `other.md` – For anything not covered above

**Please fill out all required sections in the template to help us triage and resolve your issue
quickly.**

---

## Development Setup

To get started with development:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Drago-03/GroqTales.git
   cd GroqTales
   ```

2. **Install Dependencies:** Ensure you have Node.js (v16+) and npm or yarn.

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables:** Copy `.env.example` to `.env.local` and fill in required
   values.

   ```bash
   cp .env.example .env.local
   ```

   - `GROQ_API_KEY` – Groq AI key (required)
   - `UNSPLASH_API_KEY` – (Optional) for placeholder visuals
   - `MONAD_RPC_URL` – Monad blockchain endpoint

4. **Run the Development Server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Repository Structure & Architecture

GroqTales is organized for scalability and modularity. Here’s a high-level overview:

```
GroqTales/
│
├── .github/              # Issue templates, workflows, configs
├── app/                  # Next.js app (pages, routing, layouts)
├── components/           # Reusable React UI components
├── contracts/            # Solidity smart contracts for NFT minting
├── lib/                  # Utilities, API integrations, helpers
├── public/               # Static assets (images, icons, etc.)
├── scripts/              # Deployment and automation scripts
├── test/                 # Contract tests (e.g., Hardhat/Foundry)
├── tests/                # Frontend/backend test cases
├── types/                # Shared TypeScript types/interfaces
├── wiki/                 # Project Wiki and guides
├── .env.example          # Example environment variables
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # TailwindCSS config
├── README.md             # Main project overview
├── CONTRIBUTING.md       # Contribution guidelines
├── CONTRIBUTORS.md       # List of contributors
├── SECURITY.md           # Security policy
└── ...                   # Other config and support files
```

**Architecture Notes:**

- **Frontend:** Built with Next.js, React, TailwindCSS, and shadcn/ui for a modern, responsive UI.
- **Backend:** Node.js API routes handle authentication, story generation, and blockchain
  interactions.
- **Blockchain:** Monad SDK and Solidity smart contracts manage NFT minting and ownership.
- **AI:** Groq API powers story and comic generation.
- **Database:** MongoDB stores user data, stories, and metadata.
- **Testing:** Jest/React Testing Library for frontend; Hardhat/Foundry for smart contracts.

---

## Coding Guidelines

- **JavaScript/TypeScript:** Follow the Airbnb Style Guide.
- **React/Next.js:** Use functional components and hooks. Follow Next.js routing and data-fetching
  conventions.
- **Formatting:** Use Prettier (`npm run format`).
- **Linting:** Use ESLint (`npm run lint`).
- **Commits:** Use descriptive commit messages (Conventional Commits format preferred).
- **Docs:** Update docs and inline comments for all major changes.

---

## Pull Request Process

1. **Fork the repository (do not branch from upstream directly).**
2. **Clone your fork locally:**

   ```bash
   git clone https://github.com/<your-username>/GroqTales.git
   cd GroqTales
   git remote add upstream https://github.com/Drago-03/GroqTales.git
   ```

3. **Synchronize before starting work:**

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

4. **Create a feature branch (use descriptive, kebab or slash style):**

   ```bash
   git checkout -b feature/improve-story-generator
   ```

5. **Implement changes (small, atomic commits – use Conventional Commit style if possible).**
6. **Run quality gates locally:**

   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

7. **Rebase onto upstream/main before opening PR:**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

8. **Push to your fork:**

   ```bash
   git push -u origin feature/improve-story-generator
   ```

9. **Open a Pull Request:**
   - Base: `Drago-03/GroqTales` `main`
   - Head: `your-username:feature/improve-story-generator`
   - Fill out PR template completely
   - Link issue with `Fixes #<number>` where applicable
10. **Address review feedback and keep branch rebased (avoid merge commits).**
11. **PR Merge Policy:** squash or rebase merges preferred; maintainers handle final merge.
12. **After merge:** sync your fork:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

---

## Testing Guidelines

- Write or update tests for new features and bug fixes.
- Frontend: Use Jest and React Testing Library.
- Smart Contracts: Use Hardhat or Foundry for Solidity tests.
- Ensure all tests pass before submitting a PR.
- If unsure how to test a feature, ask in your PR or on Discord.

---

## Labeling & Tagging

To help maintainers and the community, **always tag your issues and PRs** with relevant labels:

- **Difficulty:** `easy`, `medium`, `hard`, `good first issue`
- **Type:** `bug`, `feature`, `enhancement`, `documentation`, `security`, `web3`, `NFT`, `UI/UX`,
  etc.
- **Area:** `frontend`, `backend`, `blockchain`, `devops`, `database`, etc.
- **Programs:** `GSSOC'25`, `LGM-SOC`, `MLH`, `HackinCodes`, `cWoc`, `FOSS Hack`, `Indie Hub`, etc.
- **Status:** `in progress`, `blocked`, `needs review`, `help wanted`

**If you are participating in a specific open source program (like GSSOC'25), make sure to add that
label to your issues/PRs.**

---

## Documentation

- Update or add documentation for any new features or changes.
- Add inline comments for complex logic.
- Keep the [Wiki](https://github.com/Drago-03/GroqTales/wiki) up to date for setup, usage, and
  architecture.

---

## Community & Support

- **Discord:** [Join our Discord server](https://discord.gg/JK29FZRm) for real-time help and
  collaboration.
- **Discussions:** Use [GitHub Discussions](https://github.com/Drago-03/GroqTales/discussions) for
  ideas and Q&A.
- **Security:** For vulnerabilities, see [SECURITY.md](./SECURITY.md).

---

Thank you for contributing to GroqTales! If you have any questions, open an issue, ask in Discord,
or contact the maintainers directly.

<!-- markdownlint-enable MD033 -->
