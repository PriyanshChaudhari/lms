import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const groupsCollection = collection(db, "groups");
        const querySnapshot = await getDocs(groupsCollection);
        const groups = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json({ groups: groups, success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
    }
}