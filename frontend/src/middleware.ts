import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); 
  //const token = localStorage.getItem("token");
  const isAuthPage = req.nextUrl.pathname === "/login";

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*"], // Protección para todas las rutas adentro de /dashboard
};
