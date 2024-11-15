import { db, storage } from "@/lib/firebaseConfig";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import { deleteRelatedModules, logAuditAction} from "@/lib/cascadeHelper";

// The handler for the DELETE request
export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { courseId } = params;
        if (!courseId) {
            return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }

        await logAuditAction('DELETE_COURSE', courseId, 'Deleting course and related data');

        await deleteRelatedModules(courseId);

        const courseRef = doc(db, "courses", courseId);
        const courseDoc = await getDoc(courseRef);
        if (!courseDoc.exists()) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const courseData = courseDoc.data();
        const coursePicUrl = courseData?.coursePicUrl;

        // Step 2: Delete the course image from Firebase Storage if it exists
        if (coursePicUrl) {
            const imageRefPath = decodeURIComponent(coursePicUrl.split("/o/")[1].split("?")[0]);

            // If the image is not the default course image, delete it
            if (imageRefPath !== "default-course-pic.png") {
                const imageRef = ref(storage, imageRefPath);
                await deleteObject(imageRef); // Delete the custom image from storage
            }
        }

        // Delete the course document from Firestore
        await deleteDoc(courseRef);


        return NextResponse.json({ message: "Course and related data deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting course or image:", error);
        return NextResponse.json({ error: "Failed to delete course and image" }, { status: 500 });
    }
}
