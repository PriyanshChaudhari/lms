import { db } from "@/lib/firebaseConfig"; // Firestore instance
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { moduleId: string } }) {
    try {
        const { moduleId } = params
        const { title, description, course_id } = await req.json();
        console.log(moduleId)

        if (!course_id || !title || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Reference to the content document in 'course-content' collection
        const moduleRef = doc(db, "course-module", moduleId);

        // Prepare the data to update
        const updatedModule = {
            title,
            description,
            course_id,
            updated_at: Timestamp.now(), // Set updated timestamp
        };

        await updateDoc(moduleRef, updatedModule);
        return NextResponse.json({ message: "Module updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ error: "Failed to update module" }, { status: 500 });
    }
}
