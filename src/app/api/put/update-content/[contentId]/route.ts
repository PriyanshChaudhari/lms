import { db } from "@/lib/firebaseConfig"; // Firestore instance
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '@/lib/firebaseConfig';

// Function to handle file uploads to Firebase Storage
async function uploadFile(fileBuffer: Uint8Array, fileName: string, contentType: string, contentId: string, courseId: string, moduleId: string) {
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

export async function PUT(req: NextRequest, { params }: { params: { contentId: string } }) {
    try {
        const { contentId } = params;
        const formData = await req.formData();
        const course_id = formData.get('course_id') as string;
        const module_id = formData.get('module_id') as string;
        const title = formData.get('title') as string;
        const content_type = formData.get('content_type') as string;
        const description = formData.get('description') as string;
        const deleteFilesJson = formData.get('deleteFiles') as string;
        const deleteFiles = JSON.parse(deleteFilesJson) as string[];
        const newFiles = formData.getAll('newFiles') as File[];
        const urlAttachment = formData.get('attachments') as string;
        let attachments: string[] = [];

        if (!contentId || !module_id || !title || !content_type || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Reference to the content document
        const contentRef = doc(db, "course-content", contentId);

        // Fetch the existing document to get current attachments
        const docSnap = await getDoc(contentRef);
        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Content not found" }, { status: 404 });
        }

        const existingContent = docSnap.data();
        let updatedAttachments = existingContent.attachments || [];

        // Handle file deletions
        if (deleteFiles && deleteFiles.length > 0) {
            for (const fileUrl of deleteFiles) {
                await deleteFile(fileUrl);
                updatedAttachments = updatedAttachments.filter((url: string) => url !== fileUrl);
            }
        }

        // Handle new file uploads
        if (content_type === "file") {
            if (newFiles && newFiles.length > 0) {
                for (const file of newFiles) {
                    const arrayBuffer = await file.arrayBuffer();
                    const fileBuffer = new Uint8Array(arrayBuffer);
                    const fileUrl = await uploadFile(fileBuffer, file.name, file.type, contentId, course_id, module_id);
                    updatedAttachments.push(fileUrl); // Add new file to attachments
                }
            }
        } else if (content_type === "url" && urlAttachment) {
            updatedAttachments = [urlAttachment]; // Replace attachments with the URL
        }

        // Prepare the data to update
        const updatedContent = {
            module_id,
            title,
            description,
            content_type,
            attachments: updatedAttachments,
            updated_at: Timestamp.now(),
        };

        await updateDoc(contentRef, updatedContent);

        return NextResponse.json({ message: "Content updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
    }
}

