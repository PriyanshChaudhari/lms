import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const { moduleId } = await req.json();
        if (!moduleId) {
            return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
        }

        const moduleRef = doc(db, 'course-module', moduleId)
        const moduleSnap = await getDoc(moduleRef)

        if (!moduleSnap.exists()) {
            return NextResponse.json({ error: "module not found" }, { status: 404 });
        }

        const moduleData = moduleSnap.data();
        return NextResponse.json({ content: moduleData }, { status: 200 })
    }
    catch (error) {
        console.error("Error fetching module details:", error);
        return NextResponse.json({ error: "Failed to fetch module details" }, { status: 500 });
    }
}