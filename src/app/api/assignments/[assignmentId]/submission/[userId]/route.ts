// /api/assignments/[assignmentId]/submission/[userId].ts
import { db } from "@/lib/firebaseConfig";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { assignmentId: string, userId: string } }) {
    const { assignmentId, userId } = params;
    const submissionRef = doc(db, "submissions", `${assignmentId}_${userId}`);
    const submissionDoc = await getDoc(submissionRef);

    console.log(submissionDoc)
    if (!submissionDoc.exists()) {
        return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({ submissions: submissionDoc.data(), status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: { assignmentId: string, userId: string } }) {
    const { assignmentId, userId } = params;

    const submissionRef = doc(db, "submissions", `${assignmentId}_${userId}`);
    const submissionDoc = await getDoc(submissionRef);

    if (!submissionDoc.exists()) {
        return NextResponse.json({ error: "Submission not found", status: 404 });
    }

    const storage = getStorage();
    const fileRef = ref(storage, submissionDoc.data().file_url);

    // Delete file from storage
    await deleteObject(fileRef);

    // Delete submission from Firestore
    await deleteDoc(submissionRef);

    return NextResponse.json({ message: "Submission deleted successfully" , status: 200 });
}
