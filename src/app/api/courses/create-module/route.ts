import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { title, description, course_id } = await req.json();
        if(!title || !description || !course_id){
            return NextResponse.json({message:'missing required fields',status:'400'})
        }
        const docRef = await addDoc(collection(db, 'course-module'), {
            title,
            description,
            course_id,
            created_at: Timestamp.now()
        })
        return NextResponse.json({ message: 'module added' }, { status: 201 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
    }
}