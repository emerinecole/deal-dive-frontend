Master README found on backend respository: [https://github.com/CMunjed/deal-dive-backend](https://github.com/CMunjed/deal-dive-backend/blob/main/README.md)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Our application is currently deployed on Vercel frontend at https://deal-dive-frontend.vercel.app/ but there is an error in our signup/signin page on our deployed version. So if you go to the deployed version and signup/signin, you will get stuck in a loop of returning to the signup page. In order to bypass this, signin and then remove the "/auth/signup"
from the website and you should be redirected into the application. Or you can continue to deploy locally where this navigation bug does not exist. We believe that the bug lies within our supabase/vercel redirection but we haven't been able to figure it out yet. Deploymnet locally for frontend as stated above works perfectly well.

## Technical Specifications

More information about the technical specifications can be found in the README of our backend repository found here: [https://github.com/CMunjed/deal-dive-backend](https://github.com/CMunjed/deal-dive-backend/blob/main/README.md)

## Project Structure

Within the frontend, the project's main code is structure in the /app folder. Within here is the layout for the overall screen in layout.tsx but also each aspect of each screen. Within (Dashboard), each screen has its own folder for the frontend code. All signup/signin information is found in the auth folder. Outside of the /app folder: Schemas, services, and types can be found in the lib folder and that is essentially the important files/folders for understanding the frontend code.

deal-dive/
├── app/
│   ├── (dashboard)/       # Main app pages (home, deals, account, create)
│   ├── auth/              # Authentication pages (login, signup, verification)
│   ├── components/        # App-scoped components
│   ├── providers/         # React context providers
│   └── [layout & styles]  # Root layout and global CSS
├── components/
│   └── ui/                # Reusable UI components (shadcn/ui)
├── constants/             # API endpoints, routes, query keys
├── hooks/                 # Global custom hooks
├── lib/                   # Core library code
│   ├── services/         # API service layer
│   ├── supabase/         # Supabase client configuration
│   ├── schemas/          # Validation schemas
│   ├── types/            # TypeScript type definitions
│   └── utils.ts          # Utility functions
├── public/                # Static assets and images
└── [config files]         # Next.js, TypeScript, ESLint, Tailwind configs

