import { db } from "@/lib/firebaseConfig"; // Firebase Firestore instance
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from '@/lib/firebaseConfig';

// Function to delete a single file from Firebase Storage
async function deleteFile(fileUrl: string) {
    const storage = getStorage(app);
    const fileRef = ref(storage, fileUrl);
    return deleteObject(fileRef).catch((error) => {
        console.error(`Error deleting file from storage: ${error}`);
        throw new Error("Failed to delete file from storage");
    });
}

// Function to delete related files from Firebase Storage using attachments
async function deleteRelatedFiles(attachments: string[]) {
    for (const fileUrl of attachments) {
        await deleteFile(fileUrl);
    }
}

// The handler for the DELETE request
export async function DELETE(req: NextRequest, { params }: { params: { contentId: string } }) {
    try {
        const { contentId } = params;
        const { data } = await req.json();
        const { courseId, moduleId } = data;

        if (!contentId || !courseId || !moduleId) {
            return NextResponse.json({ error: "Content ID, Course ID, and Module ID are required" }, { status: 400 });
        }

        // Reference to the document in Firestore
        const contentRef = doc(db, "course-content", contentId);

        // Fetch the document to get the attachments
        const docSnap = await getDoc(contentRef);
        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Content not found" }, { status: 404 });
        }

        const existingContent = docSnap.data();
        const attachments = existingContent.attachments || [];

        // Delete related files in Firebase Storage using the attachments array
        await deleteRelatedFiles(attachments);

        // Delete the document from Firestore
        await deleteDoc(contentRef);

        return NextResponse.json({ message: "Content and related files deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting content:", error);
        return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
    }
}
