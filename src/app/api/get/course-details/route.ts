import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const { courseId } = await req.json();
        if (!courseId) {
            return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }

        const courseRef = doc(db, 'courses', courseId)
        const courseSnap = await getDoc(courseRef)

        if (!courseSnap.exists()) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const courseData = courseSnap.data();
        // console.log(courseData)
        return NextResponse.json({ courseDetails: courseData }, { status: 200 })
    }
    catch (error) {
        console.error("Error fetching course details:", error);
        return NextResponse.json({ error: "Failed to fetch course details" }, { status: 500 });
    }
}