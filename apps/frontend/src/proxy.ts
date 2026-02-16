import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const { cookies, url } = request;

  const token = cookies.get("token")?.value;
  const isAuthPage =
    url.includes("/signin") ||
    url.includes("/signup") ||
    url.includes("/authentication");
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/overview", url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const originPath = request.nextUrl.pathname;

    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("redirectTo", originPath);

    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/signin", "/signup", "/authentication", "/overview/:path*"],
};
