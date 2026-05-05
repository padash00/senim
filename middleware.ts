import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/lib/i18n/routing";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin is NOT localized — handle it on its own and gate it on auth.
  if (pathname.startsWith("/admin")) {
    const response = NextResponse.next({ request });
    const { user } = await updateSupabaseSession(request, response);

    const isLoginPage = pathname === "/admin/login";
    if (!user && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (user && isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Public site — let next-intl handle locale prefix + negotiation.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Run on everything except: static assets, _next internals, api, files with extensions.
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
