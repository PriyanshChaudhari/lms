import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, Timestamp, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebaseConfig';

async function uploadFile(fileBuffer: Uint8Array, fileName: string, contentType: string, contentId: string, courseId: string, moduleId: string) {
    console.log("upload file called")
    const storageRef = getStorage(app);
    const fileExtension = fileName.split('.').pop();
    const newFileName = `course_content_${contentId}_${fileName}`; // Append original file name to make it unique
    const fileRef = ref(storageRef, `courses/${courseId}/${moduleId}/course-content/${newFileName}`);
    const metadata = { contentType };
    const uploadTask = uploadBytesResumable(fileRef, fileBuffer, metadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            () => { },
            (error) => reject(error),
            async () => {
                const fileUrl = await getDownloadURL(fileRef);
                console.log(`file url : ${fileUrl}`)
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
        const description = formData.get('description') as string;
        let attachments: string[] = [];
        console.log(`content-type : ${content_type}`)
        // Prepare initial content data to save in Firestore
        const contentRef = {
            module_id,
            title,
            content_type,
            description,
            attachments, // This will be updated later for file uploads
            created_at: Timestamp.now(),
        };

        // Create the Firestore document reference
        const docRef = await addDoc(collection(db, 'course-content'), contentRef);

        // Handle file uploads
        if (content_type === "file") {
            console.log(`is file true::::`)
            const files = formData.getAll('files') as File[]; // Multiple file inputs
            console.log(`files == ${files}`)
            // Iterate through each file and upload it
            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const fileBuffer = new Uint8Array(arrayBuffer);
                const fileUrl = await uploadFile(fileBuffer, file.name, file.type, docRef.id, course_id, module_id) as string;
                attachments.push(fileUrl);
                console.log(`attachments :: ${attachments}`) // Add the uploaded file URL to the attachments array
            }

            // Update the Firestore document with the attachments array
            await updateDoc(docRef, { attachments });
        }

        // If content_type is "url", store the URL as an attachment
        if (content_type === "url") {
            const contentUrl = formData.get('attachments') as string; // Assuming the URL is provided under 'text_content'
            attachments.push(contentUrl); // Add the URL to attachments array
            await updateDoc(docRef, { attachments });
        }

        return NextResponse.json({ message: 'course-content added' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
    }
}
