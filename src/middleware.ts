import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
    const SECRET_KEY = process.env.JWT_SECRET;
    if (!SECRET_KEY) {
        return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/forgot-password' || path === '/reset-password';
    const token = request.cookies.get('token')?.value || '';

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    try {
        if (token) {
            const decodedToken = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
            const { userId, email, role } = decodedToken.payload as { userId: string, email: string, role: string };

            // Access data from the token
            console.log("Data from token:")
            console.log("User ID:", userId);
            console.log("Email:", email);
            console.log("Role:", role);

            // Retrieve the user's role from the database
            // const userRef = doc(db, "users", userId);
            // const userDoc = await getDoc(userRef);

            // if (!userDoc.exists()) {
            //     return NextResponse.redirect(new URL('/login', request.nextUrl));
            // }

            // const user = userDoc.data();

            // Redirect based on role
            if (path.startsWith('/student') && role !== 'Student') {
                console.log('student');
                return NextResponse.redirect(new URL('/unauthorized', request.nextUrl));
            }

            if (path.startsWith('/teacher') && role !== 'Teacher') {
                return NextResponse.redirect(new URL('/unauthorized', request.nextUrl));
            }

            if (path.startsWith('/admin') && role !== 'Admin') {
                return NextResponse.redirect(new URL('/unauthorized', request.nextUrl));
            }
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/student/:path*',
        '/teacher/:path*',
        '/admin/:path*',
        '/login',
        '/forgot-password',
        '/reset-password',
    ]
}
