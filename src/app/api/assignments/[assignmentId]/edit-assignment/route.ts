import { db } from "@/lib/firebaseConfig";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { app } from '@/lib/firebaseConfig';

async function deletePreviousSubmission(storageRef: any, course_id: string, module_id: string, assignmentId: string) {
    const folderRef = ref(storageRef, `courses/${course_id}/${module_id}/assignments`);

    // List all files in the assignment's folder
    const fileList = await listAll(folderRef);
    // Iterate over the files and find any that match `submission_${userId}`
    const regex = new RegExp(`^Assignment_${assignmentId}\\..+$`);
    const matchingFile = fileList.items.find(item => regex.test(item.name));
    console.log(matchingFile)

    if (matchingFile) {
        // Delete the existing file with matching name
        await deleteObject(matchingFile);
    }
}

async function uploadFile(
    fileBuffer: Uint8Array,
    fileName: string,
    contentType: string,
    assignmentId: string,
    courseId: string,
    moduleId: string
) {
    const storageRef = getStorage(app);
    await deletePreviousSubmission(storageRef, courseId, moduleId, assignmentId);
    const fileExtension = fileName.split('.').pop();
    // Use assignmentId to ensure file name consistency
    const newFileName = `Assignment_${assignmentId}.${fileExtension}`;
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

        const docRef = doc(db, "assessments", assignmentId);
        let attachment_url = '';

        // Step 1: Upload the file, if provided
        const file = formData.get('file') as File | null;
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = new Uint8Array(arrayBuffer);
            attachment_url = await uploadFile(fileBuffer, file.name, file.type, docRef.id, course_id, module_id) as string;
        }

        // Step 2: Update the document with new data
        const updatedAssessment = {
            title,
            assessment_type,
            description,
            total_marks: parseInt(total_marks),
            due_date: Timestamp.fromDate(new Date(due_date)),
            ...(attachment_url && { attachment_url }), // Update the attachment_url if a new file was uploaded
            updated_at: Timestamp.now(),
        };

        await updateDoc(docRef, updatedAssessment);

        return NextResponse.json({ message: "Assessment updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating assessment:", error);
        return NextResponse.json({ error: "Failed to update assessment" }, { status: 500 });
    }
}
