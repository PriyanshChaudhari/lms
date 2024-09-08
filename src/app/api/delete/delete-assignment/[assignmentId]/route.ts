import { db } from "@/lib/firebaseConfig"; // Firebase Firestore instance
import { doc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// The handler for the DELETE request
export async function DELETE(req: NextRequest, { params }: { params: { assignmentId: string } }) {
    try {
        // Extract contentId from the URL params
        const { assignmentId } = params;

        if (!assignmentId) {
            return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
        }

        // Reference to the document in Firestore
        const contentRef = doc(db, "assessments", assignmentId);

        // Delete the document
        await deleteDoc(contentRef);

        return NextResponse.json({ message: "Assignment deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting content:", error);
        return NextResponse.json({ error: "Failed to delete AssignmentId" }, { status: 500 });
    }
}
