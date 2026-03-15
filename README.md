# supabase-next-auth-proxy

A proxy utility to integrate Supabase with Next.js Middleware. It helps protect specific routes by checking Supabase session claims and handles redirects for unauthorized access.

## Installation

```bash
npm install supabase-next-auth-proxy @supabase/ssr next
# or
yarn add supabase-next-auth-proxy @supabase/ssr next
# or
pnpm add supabase-next-auth-proxy @supabase/ssr next
```

Note: `@supabase/ssr` and `next` are required as peer dependencies.

## Usage

### In Next.js Middleware

Create a `middleware.ts` file in your project root or `src` folder:

```typescript
import auth from "supabase-next-auth-proxy";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const authResponse = await auth(request, response, {
    protectedPaths: (path) => path.startsWith("/dashboard") || path.startsWith("/profile"),
    protectedPathsRedirect: "/login",
    protectedPathsNextParameterName: "next",
    clientOptions: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
  });

  // If authResponse is a redirect, return it to intercept the request
  if (authResponse) {
    return authResponse;
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

### Direct Proxy Client usage

If you need to create a Supabase client that handles cookies automatically within Next.js Middleware:

```typescript
import { createProxyClient } from "supabase-next-auth-proxy";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const client = await createProxyClient(request, response, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });
  
  // Use client...
  
  return response;
}
```

## Configuration Options

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `protectedPaths` | `(path: string) => boolean` | Function to determine if a path should be protected. | Required |
| `protectedPathsRedirect` | `string` | Path to redirect to if unauthorized. | `"/login"` |
| `protectedPathsNextParameterName` | `string` | Query parameter name for the return URL. | `"next"` |
| `clientOptions.supabaseUrl` | `string` | Your Supabase project URL. | Required |
| `clientOptions.supabaseKey` | `string` | Your Supabase anon/service_role key. | Required |
| `clientOptions.auth` | `object` | Optional `@supabase/ssr` auth configuration. | `undefined` |

## Features

- [x] Easy Supabase authentication integration in Next.js Middleware.
- [x] Automatic cookie handling between request and response.
- [x] Configurable protected paths and redirect behavior.
- [x] Built on top of `@supabase/ssr` for modern Next.js support.

## License

ISC
