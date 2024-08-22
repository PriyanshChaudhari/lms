import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    const SECRET_KEY = process.env.JWT_SECRET;
    if (!SECRET_KEY) {
        return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    try {
        if (token) {
            const decoded = jwt.verify(token, SECRET_KEY);
            console.log('Decoded token:', decoded);
            // Optionally, attach the user info to the request for further use
            return NextResponse.next();
        } else {
            return NextResponse.json({ message: "Authentication required" }, { status: 401 });
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }
}
