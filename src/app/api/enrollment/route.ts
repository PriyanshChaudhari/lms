import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { user_id, role, course_id } = await req.json();

        // Step 1: Check if the user is already enrolled in the course
        const q = query(
            collection(db, 'enrolled_at'),
            where('user_id', '==', user_id),
            where('course_id', '==', course_id)
        );

        const querySnapshot = await getDocs(q);

        // Step 2: If a matching document is found, return an error
        if (!querySnapshot.empty) {
            return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
        }

        // Step 3: If no matching document is found, proceed with enrollment
        const docRef = await addDoc(collection(db, 'enrolled_at'), {
            user_id,
            role,
            course_id,
            enrolled_at: new Date(),
        });

        return NextResponse.json({ message: 'User enrolled successfully' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to enroll user' }, { status: 500 });
    }
}
