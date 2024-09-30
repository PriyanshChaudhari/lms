import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebaseConfig';

async function uploadFile(fileBuffer: Uint8Array, fileName: string, contentType: string, courseId: string, moduleId: string) {
    const storageRef = getStorage(app);
    const fileExtension = fileName.split('.').pop();
    const newFileName = `course_content_${Date.now()}.${fileExtension}`;
    // Include course_id and module_id in the path
    const fileRef = ref(storageRef, `courses/content/${courseId}/${moduleId}/${newFileName}`);
    const metadata = { contentType };
    const uploadTask = uploadBytesResumable(fileRef, fileBuffer, metadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            () => {},
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
        const content_type = formData.get('content_type') as string;
        const text_content = formData.get('text_content') as string;
        const position = formData.get('position') as string;
        let content_url = '';

        const file = formData.get('file') as File | null;
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = new Uint8Array(arrayBuffer);
            // Pass course_id and module_id to uploadFile to include them in the file path
            content_url = await uploadFile(fileBuffer, file.name, file.type, course_id, module_id) as string;
        }

        await addDoc(collection(db, 'course-content'), {
            course_id,
            module_id,
            title,
            content_type,
            content_url,
            text_content,
            position,
            created_at: new Date(),
        });

        return NextResponse.json({ message: 'course-content added' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
    }
}