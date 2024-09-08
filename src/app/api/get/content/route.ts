import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const { contentId } = await req.json();
        console.log(contentId)
        if (!contentId) {
            return NextResponse.json({ error: "contentId is required" }, { status: 400 });
        }

        const contentRef = doc(db, 'course-content', contentId)
        const contentSnap = await getDoc(contentRef)

        if (!contentSnap.exists()) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const contentData = contentSnap.data();
        // console.log(courseData)
        return NextResponse.json({ contentDetails: contentData }, { status: 200 })
    }
    catch (error) {
        console.error("Error fetching course details:", error);
        return NextResponse.json({ error: "Failed to fetch course details" }, { status: 500 });
    }
}