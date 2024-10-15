import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId, assignmentId } = await req.json();

        if (!userId || !assignmentId) {
            return NextResponse.json({ error: "Missing student_id or assignment_id" }, { status: 400 });
        }

        // Query submissions collection for the current student and assignment
        const q = query(collection(db, "submissions"), 
            where("user_id", "==", userId), 
            where("assignment_id", "==", assignmentId)
        );

        const querySnapshot = await getDocs(q);
        const submissions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        const exists = submissions.length > 0;
        return NextResponse.json({ submissions:submissions ,exists}, { status: 200 });

    } catch (error) {
        console.error("Error checking submission:", error);
        return NextResponse.json({ error: "Failed to check submission" }, { status: 500 });
    }
}
