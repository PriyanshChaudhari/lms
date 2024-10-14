import { app, db } from "@/lib/firebaseConfig"; // Firestore instance
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

async function deletePreviousImages(storageRef: any, course_id: string) {
    const folderRef = ref(storageRef, `courses-images`);

    // List all files in the assignment's folder
    const fileList = await listAll(folderRef);
    // Iterate over the files and find any that match `submission_${userId}`
    const regex = new RegExp(`^CourseImg_${course_id}\\..+$`);
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
    courseId: string,
) {
    const storageRef = getStorage(app);
    await deletePreviousImages(storageRef, courseId);
    const fileExtension = fileName.split('.').pop();
    const newFileName = `CourseImg_${courseId}.${fileExtension}`;
    const fileRef = ref(storageRef, `courses-images/${newFileName}`);
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


export async function PUT(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { courseId } = params
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const teacher_id = formData.get('teacher_id') as string;
        const category = formData.get('category') as string;

        if (!title || !description || !teacher_id || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        console.log(courseId)

        const courseRef = doc(db, "courses", courseId);

        const firebaseStorageId = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        const defaultCoursePicUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageId}/o/default-course-pic.png?alt=media`;
        let coursePicUrl = '';

        const file = formData.get('file') as File | null;
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = new Uint8Array(arrayBuffer);
            coursePicUrl = await uploadFile(fileBuffer, file.name, file.type, courseId) as string;
        }

        const updatedCourse = {
            title,
            description,
            teacher_id,
            category,
            ...(coursePicUrl && { coursePicUrl }),
            updated_at: Timestamp.now(), // Set updated timestamp
        };

        await updateDoc(courseRef, updatedCourse);
        return NextResponse.json({ message: "course updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ error: "Failed to update module" }, { status: 500 });
    }
}
