import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, Timestamp, setDoc, doc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebaseConfig";

async function uploadFile(fileBuffer: Uint8Array, fileName: string, contentType: string, assignmentId: string, userId: string, course_id: string, module_id: string) {
    const storageRef = getStorage(app);
    const fileExtension = fileName.split('.').pop();
    const newFileName = `submission_${userId}.${fileExtension}`;
    const fileRef = ref(storageRef, `courses/${course_id}/${module_id}/assignments/${assignmentId}/${newFileName}`);
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
        const course_id = formData.get("course_id") as string;
        const module_id = formData.get("module_id") as string;
        const assignmentId = formData.get("assignmentId") as string;
        const user_id = formData.get("user_id") as string;
        let file_url = "";

        const file = formData.get("file") as File | null;
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = new Uint8Array(arrayBuffer);
            file_url = await uploadFile(fileBuffer, file.name, file.type, assignmentId, user_id, course_id, module_id) as string;
        }

        const newSubmission = {
            module_id,
            assignment_id: assignmentId,
            user_id,
            submission_date: Timestamp.now(),
            file_url,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
        };

        const docRefId = `${assignmentId}_${user_id}`;
        await setDoc(doc(db, "submissions", docRefId), newSubmission);

        return NextResponse.json({ message: "Submission added successfully", id: docRefId }, { status: 201 });
    } catch (error) {
        console.error("Error submitting assignment:", error);
        return NextResponse.json({ error: "Failed to submit assignment" }, { status: 500 });
    }
}


// import { db } from "@/lib/firebaseConfig";
// import { collection, addDoc, Timestamp } from "firebase/firestore";
// import { NextRequest, NextResponse } from "next/server";
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { app } from '@/lib/firebaseConfig';

// async function uploadFile(fileBuffer: Uint8Array, fileName: string, contentType: string, studentId: string, courseId: string, assignmentId: string) {
//     const storageRef = getStorage(app);
//     const fileExtension = fileName.split('.').pop();
//     const newFileName = `submission_${studentId}_${Date.now()}.${fileExtension}`;
//     const fileRef = ref(storageRef, `courses/${courseId}/assignments/${assignmentId}/submissions/${newFileName}`);
//     const metadata = { contentType };
//     const uploadTask = uploadBytesResumable(fileRef, fileBuffer, metadata);

//     return new Promise((resolve, reject) => {
//         uploadTask.on('state_changed',
//             () => {},
//             (error) => reject(error),
//             async () => {
//                 const fileUrl = await getDownloadURL(fileRef);
//                 resolve(fileUrl);
//             }
//         );
//     });
// }

// export async function POST(req: NextRequest) {
//     try {
//         const formData = await req.formData();
//         const student_id = formData.get('student_id') as string;
//         const course_id = formData.get('course_id') as string;
//         const module_id = formData.get('module_id') as string;
//         const assignment_id = formData.get('assignment_id') as string;
//         let submission_file_urls: string[] = [];

//         const files = formData.getAll('files') as File[];
//         if (files.length > 0) {
//             for (const file of files) {
//                 const arrayBuffer = await file.arrayBuffer();
//                 const fileBuffer = new Uint8Array(arrayBuffer);
//                 const fileUrl = await uploadFile(fileBuffer, file.name, file.type, student_id, course_id, assignment_id);
//                 submission_file_urls.push(fileUrl);
//             }
//         }

//         const newSubmission = {
//             student_id,
//             assignment_id,
//             course_id,
//             module_id,
//             submission_date: Timestamp.now(),
//             submission_file_urls,
//             created_at: Timestamp.now(),
//             updated_at: Timestamp.now(),
//         };

//         const docRef = await addDoc(collection(db, "submissions"), newSubmission);

//         return NextResponse.json({ message: "Submission added successfully", id: docRef.id }, { status: 201 });
//     } catch (error) {
//         console.error("Error adding submission:", error);
//         return NextResponse.json({ error: "Failed to add submission" }, { status: 500 });
//     }
// }
