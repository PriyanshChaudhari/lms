import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { student_id, assignment_id } = await req.json();

        if (!student_id || !assignment_id) {
            return NextResponse.json({ error: "Missing student_id or assignment_id" }, { status: 400 });
        }

        // Query submissions collection for the current student and assignment
        const q = query(collection(db, "submissions"), 
            where("student_id", "==", student_id), 
            where("assignment_id", "==", assignment_id)
        );

        const querySnapshot = await getDocs(q);

        // If a document exists for the student's submission
        if (!querySnapshot.empty) {
            return NextResponse.json({ exists: true }, { status: 200 });
        } else {
            return NextResponse.json({ exists: false }, { status: 200 });
        }

    } catch (error) {
        console.error("Error checking submission:", error);
        return NextResponse.json({ error: "Failed to check submission" }, { status: 500 });
    }
}
