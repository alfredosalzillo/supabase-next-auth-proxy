import { createServerClient } from "@supabase/ssr";
import type { SupabaseClientOptions } from "@supabase/supabase-js";
import type { NextRequest, NextResponse } from "next/server";

export type CreateProxyClientOptions = {
  supabaseUrl: string;
  supabaseKey: string;
  auth?: SupabaseClientOptions<"public">["auth"];
};

const createProxyClient = async (
  request: NextRequest,
  response: NextResponse,
  options: CreateProxyClientOptions,
) =>
  createServerClient(options.supabaseUrl, options.supabaseKey, {
    auth: options.auth,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

export default createProxyClient;
