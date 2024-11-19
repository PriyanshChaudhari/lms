import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, Timestamp, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebaseConfig';

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
    const newFileName = `Assignment_${assignmentId}_${fileName}.${fileExtension}`; // Use assignmentId for file name consistency
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

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const course_id = formData.get('course_id') as string;
        const module_id = formData.get('module_id') as string;
        const title = formData.get('title')?.toString()?.toUpperCase() as string;
        const assessment_type = formData.get('assessment_type') as string;
        const description = formData.get('description') as string;
        const total_marks = formData.get('total_marks') as string;
        const due_date = formData.get('due_date') as string;

        // Step 1: Create a document without attachment_url
        const newAssessment = {
            module_id,
            title,
            assessment_type,
            description,
            total_marks: parseInt(total_marks),
            due_date: Timestamp.fromDate(new Date(due_date)),
            attachment_url: [], // Change to an array for multiple URLs
            created_at: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, "assessments"), newAssessment);
        const attachment_urls: string[] = []; // Array to hold all file URLs

        // Step 2: Upload files, if provided
        const files = formData.getAll('files') as File[]; // Change to 'files' to get all uploaded files
        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = new Uint8Array(arrayBuffer);
            const fileUrl = await uploadFile(fileBuffer, file.name, file.type, docRef.id, course_id, module_id) as string;
            attachment_urls.push(fileUrl); // Collect URLs
        }

        // Step 3: Update the document with the attachment_url array
        await updateDoc(docRef, { attachment_url: attachment_urls });

        return NextResponse.json({ message: "Assessment added successfully", id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error("Error adding assessment:", error);
        return NextResponse.json({ error: "Failed to add assessment" }, { status: 500 });
    }
}
