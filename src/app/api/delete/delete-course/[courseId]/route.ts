import { db, storage } from "@/lib/firebaseConfig";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

// The handler for the DELETE request
export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { courseId } = params;
        if (!courseId) {
            return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }

        // Step 1: Get the course document
        const courseRef = doc(db, "courses", courseId);
        const courseDoc = await getDoc(courseRef);
        if (!courseDoc.exists()) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const courseData = courseDoc.data();
        const coursePicUrl = courseData?.coursePicUrl;

        // Step 2: Delete the course image from Firebase Storage if it exists
        if (coursePicUrl) {
            // Extract the storage path from the URL (it's after the bucket URL)
            const imageRefPath = decodeURIComponent(coursePicUrl.split("/o/")[1].split("?")[0]);

            // Get a reference to the file in Firebase Storage
            const imageRef = ref(storage, imageRefPath);

            // Delete the image from Firebase Storage
            await deleteObject(imageRef);
        }

        // Step 3: Delete the course document from Firestore
        await deleteDoc(courseRef);

        return NextResponse.json({ message: "Course and associated image deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting course or image:", error);
        return NextResponse.json({ error: "Failed to delete course and image" }, { status: 500 });
    }
}
