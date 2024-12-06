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

### Step 1 : Setup `/app` folder

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

- Update CSS (Enable all base layer)
- Update and Add helper in `@/lib/utils.ts`
- Update all the component with Prettier
- Rework `use-mobile.tsx`
- Rework Button and Sidebar Component
- Add `Content.tsx` in `@/components/` (Disable Menu and Role)
- Add global folder : `@/components/global`, and Add these files which include some component:
  - `custom-button.tsx` - CustomButton (Disable Revalidate and Logout)
  - `icon.tsx` - ICON_SIZE, CustomLoader
  - `theme.tsx` - ThemeProvider, ThemeToggle (Enable on `layout.tsx` and `page.tsx`)

---

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
