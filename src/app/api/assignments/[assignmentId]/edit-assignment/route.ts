import { db } from "@/lib/firebaseConfig"; // Firestore instance
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '@/lib/firebaseConfig';

// Function to handle file uploads to Firebase Storage
async function uploadFile(
    fileBuffer: Uint8Array,
    fileName: string,
    contentType: string,
    assignmentId: string,
    courseId: string,
    moduleId: string
) {
    const storageRef = getStorage(app);
    const fileExtension = fileName.split('.').pop();
    const newFileName = `Assignment_${assignmentId}_${fileName}.${fileExtension}`; // Ensure unique file name
    const fileRef = ref(storageRef, `courses/${courseId}/${moduleId}/assignments/${newFileName}`);
    const metadata = { contentType };
    const uploadTask = uploadBytesResumable(fileRef, fileBuffer, metadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            () => { }, // Handle progress (if needed)
            (error) => reject(error),
            async () => {
                const fileUrl = await getDownloadURL(fileRef);
                resolve(fileUrl);
            }
        );
    });
}

async function deleteFile(fileUrl: string) {
    const storage = getStorage(app);
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    console.log(`Deleted file: ${fileUrl}`);
}

export async function PUT(req: NextRequest, { params }: { params: { assignmentId: string } }) {
    try {
        const { assignmentId } = params;
        const formData = await req.formData();
        const course_id = formData.get('course_id') as string;
        const module_id = formData.get('module_id') as string;
        const title = formData.get('title') as string;
        const assessment_type = formData.get('assessment_type') as string;
        const description = formData.get('description') as string;
        const total_marks = formData.get('total_marks') as string;
        const due_date = formData.get('due_date') as string;
        const deleteFilesJson = formData.get('deleteFiles') as string;
        const deleteFiles = JSON.parse(deleteFilesJson) as string[];
        const newFiles = formData.getAll('newFiles') as File[];

        if (!assignmentId || !module_id || !title || !assessment_type || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const docRef = doc(db, "assessments", assignmentId);

        // Fetch the existing document to get current attachments
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        const existingAssessment = docSnap.data();
        let updatedAttachments = existingAssessment.attachments || [];

        // Handle file deletions
        if (deleteFiles && deleteFiles.length > 0) {
            for (const fileUrl of deleteFiles) {
                await deleteFile(fileUrl);
                updatedAttachments = updatedAttachments.filter((url: string) => url !== fileUrl);
            }
        }

        // Handle new file uploads
        if (newFiles && newFiles.length > 0) {
            for (const file of newFiles) {
                const arrayBuffer = await file.arrayBuffer();
                const fileBuffer = new Uint8Array(arrayBuffer);
                const fileUrl = await uploadFile(fileBuffer, file.name, file.type, assignmentId, course_id, module_id);
                updatedAttachments.push(fileUrl); // Add new file to attachments
            }
        }

        // Prepare the data to update
        const updatedAssessment = {
            title,
            assessment_type,
            description,
            total_marks: parseInt(total_marks),
            due_date: Timestamp.fromDate(new Date(due_date)),
            attachment_url: updatedAttachments, // Update attachments with new ones
            updated_at: Timestamp.now(),
        };

        await updateDoc(docRef, updatedAssessment);

        return NextResponse.json({ message: "Assessment updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating assessment:", error);
        return NextResponse.json({ error: "Failed to update assessment" }, { status: 500 });
    }
}
