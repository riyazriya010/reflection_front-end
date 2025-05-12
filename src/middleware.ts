import { NextRequest, NextResponse } from "next/server";
import { tokenVerify } from "./lib/security/tokenVerify";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()

    if (
        req.nextUrl.pathname.startsWith("/_next/") ||
        req.nextUrl.pathname.startsWith("/api/") ||
        /\.(.*)$/.test(req.nextUrl.pathname)
    ) {
        return NextResponse.next();
    }

    const role = await tokenVerify("refreshToken", req)
    console.log('role: ', role)


    if (role === 'employee') {
        if (
            url.pathname === '/' ||
            url.pathname === '/pages/employee/login' ||
            url.pathname === '/pages/employee/signup'
        ) {
            url.pathname = '/pages/employee/dashboard';
            return NextResponse.redirect(url);
        }
    }


    if (role === 'manager') {
        if (
            url.pathname === '/' ||
            url.pathname === '/pages/manager/login' ||
            url.pathname === '/pages/manager/signup'
        ) {
            url.pathname = '/pages/manager/dashboard';
            return NextResponse.redirect(url);
        }
    }


    if (role === 'admin') {
        if (url.pathname === '/' || url.pathname === '/pages/admin/login') {
            url.pathname = '/pages/admin/dashboard';
            return NextResponse.redirect(url);
        }
    }

    if (
        url.pathname.startsWith('/pages/employee/dashboard') ||
        url.pathname.startsWith('/pages/employee/feedback')
    ) {
        if (role !== 'employee') {
            url.pathname = '/pages/employee/login';
            return NextResponse.redirect(url);
        }
    }

    if (url.pathname.startsWith('/pages/manager/dashboard')) {
        if (role !== 'manager') {
            url.pathname = '/pages/manager/login';
            return NextResponse.redirect(url);
        }
    }

    if (url.pathname.startsWith('/pages/admin/dynamic-form')) {
        if (role !== 'admin') {
            url.pathname = '/pages/admin/login';
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    }

}


export const config = {
    matcher: ["/pages/:path*"],
};