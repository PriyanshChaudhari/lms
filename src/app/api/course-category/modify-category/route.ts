import { db } from "@/lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const { id, category_name, parent_category_id } = await req.json();

        if (!id || !category_name) {
            return NextResponse.json({ error: "ID and category name are required." }, { status: 400 });
        }

        // Get the document reference of the category to modify
        const categoryRef = doc(db, 'course-category', id);

        // Update the category in Firestore
        await updateDoc(categoryRef, {
            category_name,
            parent_category_id: parent_category_id || null, // Set to null if no parent category
        });

        return NextResponse.json({ message: 'Course category updated successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error updating course category:", error);
        return NextResponse.json({ error: 'Failed to update course category' }, { status: 500 });
    }
}
