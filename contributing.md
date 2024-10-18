# Contributing to File Structure Generator

We're glad you're interested in contributing to the File Structure Generator project! This document will guide you through the process of setting up your development environment and making contributions.

## Table of Contents

1. [Setting Up Your Development Environment](#setting-up-your-development-environment)
2. [Project Structure](#project-structure)
3. [Building the Project](#building-the-project)
4. [Running the Project Locally](#running-the-project-locally)
5. [Making Changes](#making-changes)
6. [Submitting a Pull Request](#submitting-a-pull-request)
7. [Code Style Guidelines](#code-style-guidelines)
8. [Reporting Issues](#reporting-issues)

## Setting Up Your Development Environment

1. Fork the repository on GitHub.
2. Clone your forked repository locally:
   ```
   git clone https://github.com/your-username/file-structure-generator.git
   cd file-structure-generator
   ```
3. Install Node.js if you haven't already (we recommend using the LTS version).
4. Install project dependencies:
   ```
   npm install
   ```

## Project Structure

Ensure your project structure looks like this:

```
file-structure-generator/
├── src/
│   └── file-structure-generator.ts
├── dist/
│   └── file-structure-generator.js
├── .husky/
│   └── pre-commit
├── package.json
├── tsconfig.json
├── run-file-structure-generator.sh
├── README.md
└── CONTRIBUTING.md
```

Note: We commit the `dist` directory to version control to facilitate running the script directly from GitHub without requiring a build step.

## Building the Project

To build the project, run:

```
npm run build
```

This command compiles the TypeScript code into JavaScript in the `dist/` directory.

## Running the Project Locally

After building the project, you can run it locally using:

```
npm start -- [options]
```

For example:

```
npm start -- --root /path/to/directory --output json
```

## Making Changes

1. Create a new branch for your feature or bugfix:
   ```
   git checkout -b feature/your-feature-name
   ```
2. Make your changes in the `src/file-structure-generator.ts` file.
3. If you've added new functionality, consider adding tests (if applicable).
4. Stage your changes:
   ```
   git add .
   ```
5. Commit your changes:
   ```
   git commit -m "Your descriptive commit message"
   ```

   Note: The pre-commit hook will automatically build the project and stage the updated `dist` directory before creating the commit.

6. Push your changes to your fork:
   ```
   git push origin feature/your-feature-name
   ```

## Git Hooks

This project uses Husky and lint-staged to maintain code quality and ensure the `dist` directory is always up-to-date. The following hooks are in place:

- Pre-commit: Automatically builds the project and stages the updated `dist` directory before each commit.

These hooks help ensure that the compiled JavaScript in the `dist` directory always matches the TypeScript source code.

## Submitting a Pull Request

1. Push your changes to your forked repository:
   ```
   git push origin feature/your-feature-name
   ```
2. Go to the original repository on GitHub and create a new pull request.
3. Provide a clear description of your changes in the pull request.
4. Wait for the maintainers to review your pull request. They may ask for changes or clarifications.

## Code Style Guidelines

- We use TypeScript for this project. Please ensure your code is typed correctly.
- Follow the existing code style in the project.
- Use meaningful variable and function names.
- Comment your code where necessary, especially for complex logic.

## Reporting Issues

If you find a bug or have a suggestion for improvement:

1. Check the GitHub Issues to see if it has already been reported.
2. If not, create a new issue, providing as much detail as possible, including:
   - Steps to reproduce the issue
   - Expected behavior
   - Actual behavior
   - Your operating system and Node.js version

Thank you for contributing to the File Structure Generator project!
