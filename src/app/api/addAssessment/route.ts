import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { course_id, title, assessment_type, description, total_marks, due_date } = await req.json();

        // Validate input fields (optional but recommended)
        // if (!course_id || !title || !assessment_type || !description || !total_marks || !due_date) {
        //     return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        // }

        // Create assessment data
        const newAssessment = {
            course_id,
            title,
            assessment_type,
            description,
            total_marks: parseInt(total_marks),
            due_date: Timestamp.fromDate(new Date(due_date)),
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
        };

        // Add document to assessments collection
        const docRef = await addDoc(collection(db, "assessments"), newAssessment);

        // Return success response
        return NextResponse.json({ message: "Assessment added successfully", id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error("Error adding assessment:", error);
        return NextResponse.json({ error: "Failed to add assessment" }, { status: 500 });
    }
}
