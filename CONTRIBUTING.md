# Contributing to GroqTales

Thank you for your interest in contributing to GroqTales, an AI-powered Web3 storytelling platform! This guide will help you get started with contributing to our project. By participating, you agree to uphold our community's standards and follow this guide.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

In the interest of fostering an open and welcoming environment, we expect all contributors to be respectful and considerate of others. By participating in this project, you agree to:
- Be respectful of different viewpoints and experiences.
- Gracefully accept constructive criticism.
- Focus on what is best for the community.
- Show empathy towards other community members.

## How Can I Contribute?

There are many ways to contribute to GroqTales, including:
- **Reporting Bugs**: If you find a bug, please create an issue with detailed steps to reproduce it.
- **Suggesting Enhancements**: Have an idea for a new feature or improvement? Open an issue to discuss it.
- **Code Contributions**: Help us build new features, fix bugs, or improve the codebase.
- **Documentation**: Improve project documentation or add comments to the code.
- **Testing**: Write or improve tests to ensure the stability of the application.

## Development Setup

To set up the development environment for GroqTales, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/groqtales.git
   cd groqtales
   ```

2. **Install Dependencies**:
   Ensure you have Node.js and npm or yarn installed. Then run:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**:
   Copy the `.env.example` file to `.env.local` and fill in the necessary values:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` in your editor and replace the placeholder values with your own credentials or mock values for development. DO NOT commit `.env.local` to version control.

4. **Run the Development Server**:
   Start the Next.js development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Coding Guidelines

We aim to maintain a high-quality, consistent codebase:
- **JavaScript/TypeScript**: Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) for JavaScript and TypeScript code.
- **React/Next.js**: Adhere to React best practices and Next.js conventions.
- **Formatting**: Use Prettier for code formatting. Run `npm run format` or `yarn format` before committing.
- **Linting**: Use ESLint for linting. Run `npm run lint` or `yarn lint` to check for issues.
- **Commit Messages**: Write clear, concise commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) format if possible.

## Pull Request Process

1. **Create a Branch**:
   Create a branch with a descriptive name related to the issue or feature:
   ```bash
   git checkout -b feature/add-new-feature
   # or
   git checkout -b bugfix/fix-issue-description
   ```

2. **Make Your Changes**:
   Implement your changes, test them locally, and commit them with meaningful messages.

3. **Update Documentation**:
   If applicable, update any relevant documentation or comments in the code.

4. **Run Tests and Linting**:
   Ensure your code passes all tests and linting checks:
   ```bash
   npm run test
   npm run lint
   # or
   yarn test
   yarn lint
   ```

5. **Push Your Changes**:
   Push your branch to the repository:
   ```bash
   git push origin feature/add-new-feature
   ```

6. **Open a Pull Request**:
   Go to the repository on GitHub, switch to your branch, and click 'New Pull Request'. Fill out the PR template with details about your changes, referencing any related issues.

7. **Code Review**:
   Your PR will be reviewed by maintainers. Address any feedback by making changes to your branch and pushing updates.

8. **Merge**:
   Once approved, your PR will be merged into the main branch.

## Testing Guidelines

- Write tests for new features or bug fixes using Jest or other testing frameworks used in the project.
- Ensure existing tests pass before submitting a PR.
- If you're unsure how to write tests for a specific feature, ask for help in the issue or PR comments.

## Documentation

- Update or add documentation for any new features or changes in behavior.
- If you're contributing to a new area of the codebase, consider adding inline comments to explain complex logic.
- Project documentation is located in the `docs` folder or within README files. Update these as necessary.

Thank you for contributing to GroqTales! If you have any questions or need assistance, feel free to open an issue or reach out to the maintainers. 