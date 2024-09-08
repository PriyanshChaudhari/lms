import { db } from "@/lib/firebaseConfig"; // Firestore instance
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { contentId: string } }) {
    try {
        const { contentId } = params
        const { module_id, title, content_type, content_url, text_content, position } = await req.json();
        console.log(contentId)

        if (!contentId || !module_id || !title || !content_type || (!content_url && !text_content) || !position) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Reference to the content document in 'course-content' collection
        const contentRef = doc(db, "course-content", contentId);

        // Prepare the data to update
        const updatedContent = {
            module_id,
            title,
            content_type,
            content_url: content_url || "", // Handle optional content_url
            text_content: text_content || "", // Handle optional text_content
            position: position, // Ensure position is a number
            updated_at: new Date(), // Set updated timestamp
        };

        await updateDoc(contentRef, updatedContent);
        return NextResponse.json({ message: "Content updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
    }
}
