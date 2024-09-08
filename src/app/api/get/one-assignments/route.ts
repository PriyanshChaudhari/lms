import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { assignmentId } = await req.json();
        if (!assignmentId) {
            return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
        }

        const assignmentRef = doc(db, 'assessments', assignmentId);
        const assignmentSnap = await getDoc(assignmentRef);

        if (!assignmentSnap.exists()) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        const assignmentData = assignmentSnap.data();
        return NextResponse.json(assignmentData, { status: 200 });
    } catch (error) {
        console.error("Error fetching assignment details:", error);
        return NextResponse.json({ error: "Failed to fetch assignment details" }, { status: 500 });
    }
}
