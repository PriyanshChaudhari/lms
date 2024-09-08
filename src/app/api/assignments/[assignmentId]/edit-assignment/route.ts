import { db } from "@/lib/firebaseConfig"; // Firestore instance
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { assignmentId: string } }) {
    try {
        const { assignmentId } = params
        const {
            course_id,
            module_id,
            title,
            assessment_type,
            description,
            total_marks,
            due_date } = await req.json();

        console.log(assignmentId)

        if (!course_id || !module_id || !title || !assessment_type || !description || !total_marks || !due_date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Reference to the content document in 'course-content' collection
        const assignmentRef = doc(db, "assessments", assignmentId);

        // Prepare the data to update
        const updatedContent = {
            course_id,
            module_id,
            title,
            assessment_type,
            description,
            total_marks,
            due_date: Timestamp.fromDate(new Date(due_date)),
            updated_at: new Date(), // Set updated timestamp
        };

        await updateDoc(assignmentRef, updatedContent);
        return NextResponse.json({ message: "Assignment updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ error: "Failed to update Assignment" }, { status: 500 });
    }
}
