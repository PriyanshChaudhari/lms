import { db } from "@/lib/firebaseConfig";
import { collection, doc, updateDoc, deleteDoc, getDocs, query, where, Timestamp, addDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { app } from "@/lib/firebaseConfig";


async function deletePreviousSubmission(storageRef: any, course_id: string, module_id: string, assignmentId: string, userId: string) {
    const folderRef = ref(storageRef, `courses/${course_id}/${module_id}/assignments/${assignmentId}/`);

    // List all files in the assignment's folder
    const fileList = await listAll(folderRef);
    // Iterate over the files and find any that match `submission_${userId}`
    const regex = new RegExp(`^submission_${userId}\\..+$`);
    const matchingFile = fileList.items.find(item => regex.test(item.name));
    console.log(matchingFile)

    if (matchingFile) {
        // Delete the existing file with matching name
        await deleteObject(matchingFile);
    }
}


// Upload a new file to Firebase Storage
async function uploadFile(fileBuffer: Uint8Array, fileName: string, contentType: string, assignmentId: string, userId: string, course_id: string, module_id: string) {
    const storageRef = getStorage(app);
    await deletePreviousSubmission(storageRef, course_id, module_id, assignmentId, userId);
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

// Update or create a submission
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const course_id = formData.get("course_id") as string;
        const module_id = formData.get("module_id") as string;
        const assignmentId = formData.get("assignmentId") as string;
        const user_id = formData.get("user_id") as string;

        const file = formData.get("file") as File | null; // Expecting a single file
        const existingSubmissionQuery = query(collection(db, "submissions"), where("user_id", "==", user_id), where("assignment_id", "==", assignmentId));
        const existingSubmissions = await getDocs(existingSubmissionQuery);

        let file_url: string | null = null;

        // Upload the new file
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
            file_url, // Store the file URL
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
        };

        // Check if a submission exists and update or create
        if (existingSubmissions.empty) {
            // Create a new submission if none exists
            const docRef = await addDoc(collection(db, "submissions"), newSubmission);
            return NextResponse.json({ message: "Submission added successfully", id: docRef.id }, { status: 201 });
        } else {
            // Update the existing submission
            const submissionDoc = existingSubmissions.docs[0].ref;
            // Only update file_url if a new file was uploaded
            if (file_url) {
                newSubmission.file_url = file_url;
            }
            await updateDoc(submissionDoc, newSubmission);
            return NextResponse.json({ message: "Submission updated successfully" }, { status: 200 });
        }

    } catch (error) {
        console.error("Error submitting assignment:", error);
        return NextResponse.json({ error: "Failed to submit assignment" }, { status: 500 });
    }
}

// Delete a submission
export async function DELETE(req: NextRequest) {
    try {
        const data = await req.json();
        const { userId, assignmentId } = data;

        const existingSubmissionQuery = query(collection(db, "submissions"), where("user_id", "==", userId), where("assignment_id", "==", assignmentId));
        const existingSubmissions = await getDocs(existingSubmissionQuery);

        if (!existingSubmissions.empty) {
            const submissionDoc = existingSubmissions.docs[0];
            const fileUrl = submissionDoc.data().file_url;

            // Delete the file from Firebase Storage
            if (fileUrl) {
                const storage = getStorage(app);
                const fileRef = ref(storage, fileUrl);
                await deleteObject(fileRef);
            }

            // Delete the submission document from Firestore
            await deleteDoc(submissionDoc.ref);

            return NextResponse.json({ message: "Submission deleted successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

    } catch (error) {
        console.error("Error deleting submission:", error);
        return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
    }
}
