import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
    try {
        const { userId, password } = await req.json();

        if (!userId || !password) {
            return NextResponse.json(
                { message: "userId and password are required" },
                { status: 400 }
            );
        }

        const user = await validateUserCredentials(userId, password);

        const SECRET_KEY = process.env.JWT_SECRET;
        if (!SECRET_KEY) {
            throw new Error("JWT_SECRET environment variable is not defined");
        }

        if (user) {
            console.log("Sign-in successful for userId: " + user.userId);
            // Generate a session token or JWT if needed, then send it to the client
            const token = jwt.sign({ userId: user.userId }, SECRET_KEY, {
                expiresIn: "1h",
            });
            console.log(token)
            return NextResponse.json({ message: "Login successful", token });
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

async function validateUserCredentials(userId: string, password: string) {
    try {
        const userDocRef = doc(db, 'users', userId)
        const userDoc = await getDoc(userDocRef)

        if (!userDoc.exists) {
            console.log("No user with this Username!!")
            return null
        }
        const userData = userDoc.data();
        if (!userData) {
            console.log('User data is missing.');
            return null;
        }

        const userEmail = userData.email;
        const userIdFromDB = userDoc.id;
        const storedPasswordHash = userData.password;

        if (storedPasswordHash && await bcrypt.compare(password, storedPasswordHash)) {
            return {
                email: userEmail,
                userId: userIdFromDB
            };
        } else {
            console.log("Password validation failed.");
            return null;
        }
    }
    catch (error) {
        console.error('Error fetching user record:', error);
        return null;
    }
}