import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { category_name, parent_category_id } = await req.json();
        const docRef = await addDoc(collection(db, 'course-category'), {
            category_name,
            parent_category_id: parent_category_id || null, // Set to null if parent_id is not provided for top-level categories
        });
        return NextResponse.json({ message: 'Course category added' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create course category' }, { status: 500 });
    }
}