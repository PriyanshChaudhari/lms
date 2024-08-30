import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { title, description, thumbnail, teacher_id, category } = await req.json();
        const docRef = await addDoc(collection(db, 'courses'), {
            title,
            description,
            thumbnail,
            teacher_id,
            category,
        })
        return NextResponse.json({ message: 'course added' }, { status: 201 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}