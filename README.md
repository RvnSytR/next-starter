# Next.js Starter Template

Personalized Next.js 15 starter template, designed to include the core tools and configurations I frequently use in most projects. It aims to streamline the setup process, saving time and effort by providing a solid foundation-so i can focus on building features rather than configuring the basics.

## Features

- Ready-to-use styling and authentication.
- Database and S3 integration.

## Tech Stack

### Framework and Language

- [Next.js 15](https://nextjs.org)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)

### Styling

- [Tailwind CSS v4](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)

### Database and ORM

- [PostgreSQL](https://www.postgresql.org)
- [Drizzle ORM](https://orm.drizzle.team)

### Authentication

- [Better Auth](https://better-auth.com)

### Other

- [AWS SDK for S3](https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3)
- [ESLint](https://eslint.org)
- [Zod](https://zod.dev)
- [Motion](https://motion.dev)
- [Prettier](https://prettier.io)

## Getting Started

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/RvnSytR/next-starter
cd next-starter
npm install
```

### Database Setup

Push database schema to your PostgreSQL instance:

```sh
npx drizzle-kit push
```

### Development Server

Start the Next.js development server:

```sh
npm run dev
```
