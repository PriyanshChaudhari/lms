import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId');

        if (!categoryId) {
            return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
        }

        const coursesCollectionRef = collection(db, 'courses');
        const q = query(coursesCollectionRef, where("category", "==", categoryId));
        const coursesSnapshot = await getDocs(q);
        const coursesList = coursesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Return the list of courses as JSON
        return NextResponse.json(coursesList);
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}