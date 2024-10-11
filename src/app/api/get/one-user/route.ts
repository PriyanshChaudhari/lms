import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "userId query parameter is required" }, { status: 400 });
        }

        const userDocRef = doc(collection(db, 'users'), userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userData = {
            userId : userDoc.id,
            ...userDoc.data()};

        // Return the user data as JSON
        return NextResponse.json({ userData:userData , message:"user data fetch succesfully." });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}