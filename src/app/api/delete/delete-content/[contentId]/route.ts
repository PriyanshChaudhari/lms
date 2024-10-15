import { db } from "@/lib/firebaseConfig"; // Firebase Firestore instance
import { doc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import { app } from '@/lib/firebaseConfig';

async function deleteRelatedFiles(contentId: string, courseId: string, moduleId: string) {
    const storage = getStorage(app);
    const storageRef = ref(storage, `courses/${courseId}/${moduleId}/course-content/`);

    // List all files in the folder
    const listResult = await listAll(storageRef);

    const fileDeletionPromises = listResult.items
        .filter((itemRef) => itemRef.name.startsWith(`course_content_${contentId}_`))
        .map((itemRef) => deleteObject(itemRef));

    // Wait for all files to be deleted
    await Promise.all(fileDeletionPromises);
}

// The handler for the DELETE request
export async function DELETE(req: NextRequest, { params }: { params: { contentId: string } }) {
    try {
        const { contentId } = params;
        const { data } = await req.json();
        const {courseId,moduleId} = data;
        if (!contentId || !courseId || !moduleId) {
            return NextResponse.json({ error: "Content ID, Course ID, and Module ID are required" }, { status: 400 });
        }

        // Delete related files in Firebase Storage
        await deleteRelatedFiles(contentId, courseId, moduleId);

        // Reference to the document in Firestore
        const contentRef = doc(db, "course-content", contentId);

        // Delete the document
        await deleteDoc(contentRef);

        return NextResponse.json({ message: "Content and related files deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting content:", error);
        return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
    }
}
