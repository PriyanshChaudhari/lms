import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const coursesCollectionRef = collection(db, 'courses');
        const coursesSnapshot = await getDocs(coursesCollectionRef);
        const coursesList = coursesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Return the list of users as JSON
        return NextResponse.json(coursesList);
    } catch (error: any) {
        console.log(error)
    }
}