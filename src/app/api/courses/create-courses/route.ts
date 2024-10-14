import { app, db } from "@/lib/firebaseConfig";
import { addDoc, collection, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

// async function deletePreviousImages(storageRef: any, course_id: string) {
//     const folderRef = ref(storageRef, `courses-images`);

//     // List all files in the assignment's folder
//     const fileList = await listAll(folderRef);
//     // Iterate over the files and find any that match `submission_${userId}`
//     const regex = new RegExp(`^CourseImg_${course_id}\\..+$`);
//     const matchingFile = fileList.items.find(item => regex.test(item.name));
//     console.log(matchingFile)

//     if (matchingFile) {
//         // Delete the existing file with matching name
//         await deleteObject(matchingFile);
//     }
// }

async function uploadFile(
    fileBuffer: Uint8Array,
    fileName: string,
    contentType: string,
    courseId: string,
) {
    const storageRef = getStorage(app);
    // await deletePreviousImages(storageRef, courseId);
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

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const teacher_id = formData.get('teacher_id') as string;
        const category = formData.get('category') as string;

        if (!title || !description || !teacher_id || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const courseRef = {
            title,
            description,
            teacher_id,
            category,
            created_at: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, "courses"), courseRef);
        let coursePicUrl = '';

        const firebaseStorageId = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        const defaultCoursePicUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageId}/o/default-course-pic.png?alt=media`;



        const file = formData.get('file') as File | null;
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = new Uint8Array(arrayBuffer);
            coursePicUrl = await uploadFile(fileBuffer, file.name, file.type, docRef.id) as string;
        }
        else {
            coursePicUrl = defaultCoursePicUrl
        }

        await updateDoc(docRef, { coursePicUrl });

        // Use the created course's ID to add the teacher to the enrolled_at table
        await addDoc(collection(db, 'enrolled_at'), {
            user_id: teacher_id,
            course_id: docRef.id,
            enrolled_at: new Date(),
        });

        return NextResponse.json({ message: 'Course added successfully' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}
