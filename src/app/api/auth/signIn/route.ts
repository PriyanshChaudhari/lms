import { NextResponse } from "next/server";
import { signInWithPRN } from "@/lib/auth"; // Update the import path based on your project structure
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const { userId, password } = await request.json();
        console.log("Received userId: " + userId + ", Password: " + password + "by user");

        // Validate inputs
        if (!userId || !password) {
            return NextResponse.json(
                { message: "userId and password are required" },
                { status: 400 }
            );
        }

        const user = await signInWithPRN(userId, password);
        const SECRET_KEY = process.env.JWT_SECRET;
        if (!SECRET_KEY) {
            throw new Error("JWT_SECRET environment variable is not defined");
        }

        if (user && user?.userId == userId) {
            console.log("Sign-in successful for userId: " + user.userId);
            // Generate a session token or JWT if needed, then send it to the client
            const token = jwt.sign({ userId: user.userId }, SECRET_KEY, {
                expiresIn: "1h",
            });
            console.log(token)
            return NextResponse.json({ message: "Login successful", token });
            // return NextResponse.json({ user }, { status: 200 });
        } else {
            console.log("Sign-in failed for userId: " + userId);
            return NextResponse.json(
                { message: "Invalid userId or password" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
