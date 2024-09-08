import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { module_id, title, content_type, content_url, text_content, position } = await req.json();
        const docRef = await addDoc(collection(db, 'course-content'), {
            module_id,
            title,
            content_type,
            content_url,
            text_content,
            position
        })
        return NextResponse.json({ message: 'course-content added' }, { status: 201 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
    }
}