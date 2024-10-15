import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// API route to get a specific submission by its ID
export async function GET(req: NextRequest, { params }: { params: { submissionId: string } }) {
    try {
        // Extract the submissionId from the request body
        const { submissionId } = params;

        // Validate if submissionId is provided
        if (!submissionId) {
            return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
        }

        // Reference to the submission document in Firestore
        const submissionRef = doc(db, "submissions", submissionId);
        const submissionSnapshot = await getDoc(submissionRef);

        // Check if the submission exists
        if (!submissionSnapshot.exists()) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        // Get the submission data
        const submissionData = submissionSnapshot.data();

        // Return the submission data in the response
        return NextResponse.json({ submission: submissionData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching submission:", error);
        return NextResponse.json({ error: "Failed to fetch submission" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { submissionId: string } }) {
    try {
        // Extract the submissionId from the request body
        const { submissionId } = params;
        // Validate if submissionId is provided
        if (!submissionId) {
            return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
        }

        const { marks_obtained, feedback } = await req.json()
        if (!marks_obtained) {
            return NextResponse.json({ error: "marks_obtained is required" }, { status: 400 });
        }

        // Reference to the submission document in Firestore
        const submissionRef = doc(db, "submissions", submissionId);
        const submissionSnapshot = await getDoc(submissionRef);

        // Check if the submission exists
        if (!submissionSnapshot.exists()) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        await updateDoc(submissionRef, {
            marks_obtained: parseInt(marks_obtained), // Ensure marks_obtained is stored as a number
            feedback: feedback || "", // Store feedback, or an empty string if not provided
            updated_at: new Date(), // Optionally update the updated_at field to track changes
        });


        // Return the submission data in the response
        return NextResponse.json({ message: "Submission updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching submission:", error);
        return NextResponse.json({ error: "Failed to fetch submission" }, { status: 500 });
    }
}