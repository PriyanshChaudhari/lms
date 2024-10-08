import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebaseConfig';

async function uploadFile(fileBuffer: Uint8Array, fileName: string, contentType: string, title: string, courseId: string, moduleId: string) {
    const storageRef = getStorage(app);
    const fileExtension = fileName.split('.').pop();
    const newFileName = `assignment_${title}.${fileExtension}`;
    const fileRef = ref(storageRef, `courses/${courseId}/${moduleId}/assignments/${newFileName}`);
    const metadata = { contentType };
    const uploadTask = uploadBytesResumable(fileRef, fileBuffer, metadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            () => { },
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
        const title = formData.get('title') as string;
        const assessment_type = formData.get('assessment_type') as string;
        const description = formData.get('description') as string;
        const total_marks = formData.get('total_marks') as string;
        const due_date = formData.get('due_date') as string;
        let attachment_url = '';

        const file = formData.get('file') as File | null;
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = new Uint8Array(arrayBuffer);
            attachment_url = await uploadFile(fileBuffer, file.name, file.type, title, course_id, module_id) as string;
        }

        const newAssessment = {
            module_id,
            title,
            assessment_type,
            description,
            total_marks: parseInt(total_marks),
            due_date: Timestamp.fromDate(new Date(due_date)),
            attachment_url,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, "assessments"), newAssessment);

        return NextResponse.json({ message: "Assessment added successfully", id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error("Error adding assessment:", error);
        return NextResponse.json({ error: "Failed to add assessment" }, { status: 500 });
    }
}
