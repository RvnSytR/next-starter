## Tech Stack

List the stack i used in this kit, including:

- **Framework :** [Next.js 15](https://nextjs.org/) with [React 18](https://react.dev/)
- **Language :** [TypeScript](https://www.typescriptlang.org/)

- **Styling:**

  - [Tailwind CSS](https://tailwindcss.com/)
  - [ShadCn](https://ui.shadcn.com/)

- **Database:**
  - [MySQL](https://www.mysql.com/) database, managed with [Drizzle ORM](https://orm.drizzle.team/).

## Manual Package Install Guide (NPM)

This guide provides step-by-step instructions how i manually installing this package using NPM. Primarily intended for personal reference, it may also be helpful for others setting up the package manually.

### Step 1 : Credential Setup

- Downgrade to React 18
- Tailwind Animated
- Sharp, Prettier and Prettier Plugin Tailwind CSS

```sh
npm i react@18 react-dom@18

npm install -D tailwindcss-animated

npm i sharp prettier prettier-plugin-tailwindcss
```

#### Update `tailwind.config.ts`

```
@/tailwind.config.ts

plugins: [require("tailwindcss-animated")],
```

```
@/.prettierrc

{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Format and Check All Files with Prettier (Run on Order, write first)

```sh
npx prettier . --write
npx prettier . --check
```

### Step 2 : ShadCN

- Installation
- Adding Component
  - alert-dialog
  - badge
  - breadcrumb
  - button (custom)
  - calendar
  - card
  - checkbox
  - dialog
  - dropdown-menu
  - form
  - input
  - label
  - pagination
  - radio-group
  - scroll-area
  - select
  - separator
  - sheet
  - skeleton
  - sooner
  - table
  - textarea
  - tooltip
- Next Themes

```sh
npx shadcn@latest init

npx shadcn@latest add

npm install next-themes
```

#### Update `tailwind.config.ts`

```
@/tailwind.config.ts

theme: {
  extend: {
    keyframes: {
      pulse: {
        "0%, 100%": { boxShadow: "0 0 0 0 var(--pulse-color)" },
        "50%": { boxShadow: "0 0 0 8px var(--pulse-color)" },
      },
    },
  },
},
```

### Step 3 : Database, Drizzle and S3

- Intallation (Mysql2, Drizzle ORM, Drizzle Zod)
- Drizzle Kit
- S3 (AWS Client SDK)

```sh
npm i mysql2 drizzle-orm drizzle-zod

npm i -D drizzle-kit tsx

npm i @aws-sdk/client-s3
npm i @aws-sdk/s3-request-presigner
```

### Step 4 : Auth

- Bcrypt
- AuthJs

```sh
npm i bcrypt
npm i --save-dev @types/bcrypt

npm install next-auth@beta
```

## Environment

```
@/.env

MYSQL_HOST=host
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=db_starter

AUTH_SECRET=secretkey

NEVA_ACCESS_KEY=nevaaccesskey
NEVA_SECRET_KEY=necasecretkey
NEVA_BUCKET_NAME=nevabucketname
NEVA_S3_ENDPOINT=nevas3endpoint
```

## Coverage App (Testing)

### Page Component

```
@/app/coverage/page.tsx

export default function CoveragePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-y-4">
      <p>CoveragePage</p>
    </div>
  );
}
```

### Route

```
@/app/coverage/route/route.ts

/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { state } from "@/lib/db/state";

export async function GET() {
  const email = "user@gmail.com";
  const email2 = "admin@gmail.com";

  try {
    const res = new Promise((resolve) =>
      setTimeout(() => {
        resolve("Hello From Promises Response");
      }, 1000),
    );

    return NextResponse.json(await res);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
```
