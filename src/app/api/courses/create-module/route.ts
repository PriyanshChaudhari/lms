import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { title, description, position, course_id, created_at } = await req.json();
        const docRef = await addDoc(collection(db, 'course-module'), {
            title,
            description,
            position,
            course_id,
            created_at: new Date()
        })
        return NextResponse.json({ message: 'module added' }, { status: 201 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
    }
}