import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicPaths = [
  "/",
  "/anmelden",
  "/registrieren",
  "/preise",
  "/so-funktionierts",
  "/kategorien",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/handwerker",
];

function isPublicPath(pathname: string) {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow API routes, static files, and public paths
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    isPublicPath(pathname)
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Redirect unauthenticated users to login
  if (!token) {
    const loginUrl = new URL("/anmelden", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route protection
  const role = token.role as string;

  if (pathname.startsWith("/dashboard") && role !== "CLIENT" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/anbieter/dashboard", req.url));
  }

  if (pathname.startsWith("/anbieter") && role !== "PROVIDER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
