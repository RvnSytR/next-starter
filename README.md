# Next.js Starter Template

A lightweight, opinionated starter template for **Next.js 15 (App Router)** with just the tools and configurations I use in most projects. Designed to speed up the setup process so I can get straight to building features—rather than configuring the basics.

## Features

- Authentication with user dashboard and RBAC
- Database and S3 integration
- Ready-to-use components, and styling
- Centralized project structure (write once, use anywhere)
- Handy utility functions, actions and S3 helpers

## Tech Stack

- Framework and Language
  - [Next.js 15](https://nextjs.org)
  - [React 19](https://react.dev)
  - [TypeScript](https://www.typescriptlang.org)

- Styling
  - [Tailwind CSS v4](https://tailwindcss.com)
  - [Shadcn/ui](https://ui.shadcn.com)

- Database and ORM
  - [PostgreSQL](https://www.postgresql.org)
  - [Drizzle ORM](https://orm.drizzle.team)

- Authentication
  - [Better Auth](https://better-auth.com)

- Other
  - [AWS SDK for S3](https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3)
  - [Zod v4](https://zod.dev)
  - [Motion](https://motion.dev)
  - [Prettier](https://prettier.io)

## Getting Started

### Installation

Create a new repository using this template or clone the repository directly:

```sh
git clone https://github.com/RvnSytR/next-starter
cd next-starter
```

Install the dependencies:

```sh
npm install
# or
bun install
```

### Database Setup

Push database schema to your PostgreSQL instance:

```sh
npx drizzle-kit push
# or
bunx drizzle-kit push
```

### Development Server

Start the Next.js development server:

```sh
npm run dev
# or
bun run dev
```

## Tips

To avoid default imports for `next/router` and Radix UI components, you can adjust your TypeScript settings by adding the following configuration to your `.vscode/settings.json` file:

```json
{
  "typescript.preferences.autoImportFileExcludePatterns": [
    "next/router",
    "radix-ui"
  ]
}
```
