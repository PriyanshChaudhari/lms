import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const { contentId } = await req.json();
        if (!contentId) {
            return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
        }

        const contentRef = doc(db, 'course-content', contentId)
        const contentSnap = await getDoc(contentRef)

        if (!contentSnap.exists()) {
            return NextResponse.json({ error: "module not found" }, { status: 404 });
        }

        const contentData = contentSnap.data();
        return NextResponse.json({ content: contentData }, { status: 200 })
    }
    catch (error) {
        console.error("Error fetching content details:", error);
        return NextResponse.json({ error: "Failed to fetch content details" }, { status: 500 });
    }
}