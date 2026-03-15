import { type NextRequest, NextResponse } from "next/server";
import createProxyClient, {
  type CreateProxyClientOptions,
} from "./createProxyClient";

export type AuthProxyOptions = {
  protectedPaths: (path: string) => boolean;
  protectedPathsRedirect?: string;
  protectedPathsNextParameterName?: string;
  clientOptions: CreateProxyClientOptions;
};

const auth = async (
  request: NextRequest,
  response: NextResponse,
  options: AuthProxyOptions,
) => {
  const path = request.nextUrl.pathname;
  const isProtectedPath = options.protectedPaths(path);
  if (!isProtectedPath) {
    return null;
  }
  const client = await createProxyClient(request, response, {
    supabaseUrl: options.clientOptions.supabaseUrl,
    supabaseKey: options.clientOptions.supabaseKey,
    auth: options.clientOptions.auth,
  });

  const { data } = await client.auth.getClaims();
  const user = data?.claims;
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = options.protectedPathsRedirect ?? "/login";
    url.searchParams.set(
      options.protectedPathsNextParameterName ?? "next",
      encodeURIComponent(
        `${request.nextUrl.pathname}?${request.nextUrl.searchParams.toString()}`,
      ),
    );
    return NextResponse.redirect(url);
  }
  return null;
};

export default auth;
