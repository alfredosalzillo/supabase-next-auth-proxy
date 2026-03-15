# supabase-next-auth-proxy

`supabase-next-auth-proxy` is a TypeScript library for integrating Supabase authentication in Next.js middleware/proxy flows.

It provides:

- A default middleware helper to protect routes and handle redirect to sign-in.

## Features

- Middleware-first API for route protection.
- Automatic request/response cookie synchronization.
- Configurable protected paths, redirect destination, and `next` query parameter.
- Built on `@supabase/ssr` and compatible with modern Next.js middleware runtime.
- Fully typed exports for TypeScript projects.

## Installation

```bash
npm install supabase-next-auth-proxy @supabase/ssr next
# or
yarn add supabase-next-auth-proxy @supabase/ssr next
# or
pnpm add supabase-next-auth-proxy @supabase/ssr next
```

## Requirements

- `next >= 15.0.0` (peer dependency)
- `@supabase/ssr >= 0.9.0` (peer dependency)

## Environment variables

The examples assume these variables are available:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Exports

This package exports:

- `default` (`auth`) — middleware helper for protecting paths.
- `AuthProxyOptions` type.

## Usage

### Route protection with default export

Create a `middleware.ts` (or `proxy.ts`) file in your project root or `src` folder:

```typescript
import auth from "supabase-next-auth-proxy";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const authResponse = await auth(request, response, {
    protectedPaths: (path) =>
      path.startsWith("/dashboard") || path.startsWith("/profile"),
    protectedPathsRedirect: "/login",
    protectedPathsNextParameterName: "next",
    clientOptions: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
  });

  // If authResponse is set, user is unauthenticated on a protected route.
  if (authResponse) {
    return authResponse;
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

## API reference

### `auth(request, response, options)`

Default export.

- **Parameters**
  - `request: NextRequest`
  - `response: NextResponse`
  - `options: AuthProxyOptions`
- **Returns**: `Promise<NextResponse | null>`
  - `null` when request can continue.
  - `NextResponse.redirect(...)` when user is unauthenticated on a protected path.

#### `AuthProxyOptions`

| Option | Type | Required | Description | Default |
| --- | --- | --- | --- | --- |
| `protectedPaths` | `(path: string) => boolean` | Yes | Function to decide whether the current pathname requires auth. | - |
| `protectedPathsRedirect` | `string` | No | Redirect pathname for unauthenticated users. | `"/login"` |
| `protectedPathsNextParameterName` | `string` | No | Query parameter used to store return URL. | `"next"` |
| `clientOptions` | `{ supabaseUrl: string; supabaseKey: string; auth?: SupabaseClientOptions<"public">["auth"] }` | Yes | Supabase client configuration. | - |

## Notes

- `protectedPaths` receives `request.nextUrl.pathname`.
- The generated `next` query parameter value is URL-encoded by the library.
- Keep your middleware `config.matcher` aligned with the paths you intend to protect.

## License

MIT
