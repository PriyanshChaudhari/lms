import { db } from "@/lib/firebaseConfig"; // Firestore instance
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { courseId } = params
        const { title, description, thumbnail, teacher_id, category } = await req.json();
        console.log(courseId)

        if (!title || !description || !thumbnail || !teacher_id || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const courseRef = doc(db, "courses", courseId);

        const updatedCourse = {
            title,
            description,
            thumbnail,
            teacher_id,
            category,
            updated_at: new Date(), // Set updated timestamp
        };

        await updateDoc(courseRef, updatedCourse);
        return NextResponse.json({ message: "Module updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ error: "Failed to update module" }, { status: 500 });
    }
}
