import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersList = usersSnapshot.docs.map(doc => {
            const data = doc.data() as { id: string, role: string };
            return {
                ...data,
                id: doc.id
            };
        }).filter(user => user.role === "Student");

        // Return the list of users as JSON
        return NextResponse.json(usersList);
    } catch (error: any) {
        console.log(error)
    }
}