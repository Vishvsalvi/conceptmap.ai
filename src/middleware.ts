import { NextResponse } from 'next/server';
import { auth } from './auth';

export async function middleware(request: Request) {
    const session = await auth();

    if (session) {
        if (request.nextUrl.pathname === '/auth/login') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    if (!session) {
        if (request.nextUrl.pathname === '/map' || request.nextUrl.pathname === '/library') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }
    return NextResponse.next(); 
}

export const config = {
    matcher: ['/auth/login', '/map', '/library'], 
};