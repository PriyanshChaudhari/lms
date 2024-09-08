import { db } from "@/lib/firebaseConfig"; // Firebase Firestore instance
import { doc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// The handler for the DELETE request
export async function DELETE(req: NextRequest, { params }: { params: { contentId: string } }) {
    try {
        // Extract contentId from the URL params
        const { contentId } = params;

        if (!contentId) {
            return NextResponse.json({ error: "Content ID is required" }, { status: 400 });
        }

        // Reference to the document in Firestore
        const contentRef = doc(db, "course-content", contentId);

        // Delete the document
        await deleteDoc(contentRef);

        return NextResponse.json({ message: "Content deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting content:", error);
        return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
    }
}
