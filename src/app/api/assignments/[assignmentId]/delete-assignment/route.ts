import { db } from "@/lib/firebaseConfig";
import { doc, deleteDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import { app } from '@/lib/firebaseConfig';

// Function to delete a file from Firebase Storage
async function deleteFile(fileUrl: string) {
    const storage = getStorage(app);
    const fileRef = ref(storage, fileUrl);

    return deleteObject(fileRef).catch((error) => {
        console.error(`Error deleting file from storage: ${error}`);
        throw new Error("Failed to delete file from storage");
    });
}

// Function to delete related documents from a specific collection
async function deleteRelatedDocuments(assignmentId: string) {
    const relatedCollectionRef = collection(db, "related_collection_name"); // Replace with actual collection name
    const q = query(relatedCollectionRef, where("assignment_id", "==", assignmentId));
    const relatedDocs = await getDocs(q);

    const deletePromises = relatedDocs.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
}

export async function DELETE(req: NextRequest, { params }: { params: { assignmentId: string } }) {
    const { assignmentId } = params;

    try {
        // Fetch the assignment document to get the attachment URLs
        const assignmentDocRef = doc(db, "assessments", assignmentId);
        const assignmentDoc = await getDoc(assignmentDocRef);

        if (!assignmentDoc.exists()) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        const assignmentData = assignmentDoc.data();
        const attachmentUrls = assignmentData?.attachments || []; // Assuming 'attachments' is an array

        // Delete all attached files from Firebase Storage if available
        for (const fileUrl of attachmentUrls) {
            await deleteFile(fileUrl);
        }

        // Delete related documents in other collections (if applicable)
        await deleteRelatedDocuments(assignmentId);

        // Delete the assignment from the "assessments" collection
        await deleteDoc(assignmentDocRef);

        return NextResponse.json({ message: "Assignment and related data deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting assignment:", error);
        return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 });
    }
}
