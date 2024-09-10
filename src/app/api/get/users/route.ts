import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersList = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Return the list of all users as JSON
        return NextResponse.json(usersList);
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
