import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { student_id, course_id, progress, completion_status } = await req.json();
        const docRef = await addDoc(collection(db, 'enrolled_at'), {
            student_id,
            course_id,
            enrolled_at: new Date(),
            progress,
            completion_status
        })
        return NextResponse.json({ message: 'enrolled' }, { status: 201 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to enrolled   ' }, { status: 500 });
    }
}