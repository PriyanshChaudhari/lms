import { NextResponse } from "next/server";
import { signInWithPRN } from "@/lib/auth"; // Update the import path based on your project structure
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const { prn, password } = await request.json();
        console.log("Received PRN: " + prn + ", Password: " + password + "by user");

        // Validate inputs
        if (!prn || !password) {
            return NextResponse.json(
                { message: "PRN and password are required" },
                { status: 400 }
            );
        }

        const user = await signInWithPRN(prn, password);
        const SECRET_KEY = process.env.JWT_SECRET;
        if (!SECRET_KEY) {
            throw new Error("JWT_SECRET environment variable is not defined");
        }

        if (user) {
            // Generate a session token or JWT if needed, then send it to the client
            const token = jwt.sign({ prn: user.prn }, SECRET_KEY, {
                expiresIn: "1h",
            });
            console.log(token)
            return NextResponse.json({ message: "Login successful", token });
            // return NextResponse.json({ user }, { status: 200 });
        } else {
            console.log("Sign-in failed for PRN: " + prn);
            return NextResponse.json(
                { message: "Invalid PRN or password" },
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
