import { db } from "@/lib/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// The handler for the DELETE request
export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { courseId } = params;
        if (!courseId) {
            return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }
        const courseRef = doc(db, "courses", courseId);
        await deleteDoc(courseRef);

        return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting content:", error);
        return NextResponse.json({ error: "Failed to delete Course" }, { status: 500 });
    }
}
