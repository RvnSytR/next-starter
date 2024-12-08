## Tech Stack

List the stack i used in this kit, including:

- **Framework :** [Next.js 15](https://nextjs.org/) with [React 18](https://react.dev/)
- **Language :** [TypeScript](https://www.typescriptlang.org/)

- **Styling:**

  - [Tailwind CSS](https://tailwindcss.com/)
  - [ShadCn](https://ui.shadcn.com/)

- **Database:**
  - [MySQL](https://www.mysql.com/) database, managed with [Drizzle ORM](https://orm.drizzle.team/).

## Cleaning Up and Preparing Initial Setup

Usually i clean up the initial NextJs files and update the file structure. Adding and Updating some credential files until the project feels clean and ready for my package installation.

### Step 1 : Setup `@/app`

- Delete Local Font
- Add `@/public`, and Move `favicon.ico` to this folder
- Update `layout.tsx` and `page.tsx`
- Add `not-found.tsx`

### Step 2 : Setup CSS

- Move CSS to `@/styles/globals.css`
- Update the CSS and disable each base layer. Each base layer in this CSS includes:
  - Layer 1 : Default Themes
  - Layer 2 : HTML Styles
  - Layer 3 : Custom CSS Class

### Step 3 : Add `.env.local`

```
@/.env.local

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

### Step 4 : Update `next.config.ts`

```
@/next.config.ts

import type { NextConfig } from "next";
const bucketName = process.env.NEVA_BUCKET_NAME;

if (!bucketName) {
  throw new Error("Environment variable NEVA_BUCKET_NAME is not set");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${bucketName}.s3.nevaobjects.id`,
        port: "",
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;

```

## Manual Package Install Guide (NPM)

This guide provides step-by-step instructions how i manually installing this package using NPM. Primarily intended for personal reference, it may also be helpful for setting up the package manually.

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

import twAnimate from "tailwindcss-animate";

plugins: [twAnimated],
```

#### Add `.prettierrc`

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

---

### Step 2 : ShadCN and Next Themes

- ShadCn Installation
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
  - sidebar(custom)
  - skeleton
  - sooner
  - table
  - tabs
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

#### Next setup :

- Update CSS - Enable all base layer
- Update and Add helper in `@/lib/utils.ts`
- Update all `@/components/ui` component with Prettier
- Rework `use-mobile.tsx`
- Rework Button and Sidebar Component
- Add `Content.tsx` in `@/components` - Disable Menu and Role
- Add layout folder `@/components/layout`, and Add `section.tsx`
- Add global folder `@/components/global`, and Add these:
  - `custom-button.tsx` - Disable Logout and Refresh
  - `icon.tsx`
  - `theme.tsx` - Enable ThemeProvider and ThemeToggle on `layout.tsx` and `page.tsx`
- Update `layout.tsx`, `page.tsx` and `not-found.tsx` in `@/app` - Enable Toaster and CustomButton

---

### Step 3 : Database, Drizzle and S3

- MySql2 and Node Types
- Drizzle ORM and Drizzle Kit
- Drizzle Zod
- S3 (AWS Client SDK)

```sh
npm install --save mysql2
npm install --save-dev @types/node

npm i drizzle-orm
npm i -D drizzle-kit

npm i drizzle-zod

npm i @aws-sdk/client-s3
npm i @aws-sdk/s3-request-presigner
```

#### Next setup :

- Add db folder `@/lib/db`, and Add these:
  - `config.ts`
  - `schema.ts`
  - `starter.sql`
  - `state.ts`
- Add `zod.ts` in `@/lib`
- Add server folder `@/server`, and Add `s3.ts`
- Update `@/components/content.tsx` - Enable All

---

### Step 4 : Authentication

- Bcrypt
- AuthJs

```sh
npm i bcrypt
npm i --save-dev @types/bcrypt

npm install next-auth@beta
```

#### Next setup :

- Add `auth.ts` in `@/lib`
- Add auth api folder `@/app/api/auth/[...nextauth]`, and Add `route.ts`
- Add `action.ts` in `@/server`
- Add `auth.tsx` in `@/components/layout`
- Add login route `@/app/login`, which include `page.tsx` and `sign.ts`
- Add `@/middleware.ts`
- Update `@/component/global/custom-button.tsx` - Enable Logout and Refresh

## Coverage App (Testing)

These files are for testing purposes only in `@/app/coverage` and should not be committed.

### Page Component

```
@/app/coverage/page.tsx

export default function CoveragePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-y-4">
      <p>Coverage Page</p>
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
