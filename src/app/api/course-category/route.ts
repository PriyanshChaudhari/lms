import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { category_name, parent_category_id } = await req.json();
        const docRef = await addDoc(collection(db, 'course-category'), {
            category_name,
            parent_category_id: parent_category_id || null, // Set to null if parent_id is not provided for top-level categories
        });
        return NextResponse.json({ message: 'Course category added' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create course category' }, { status: 500 });
    }
}

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

export async function DELETE(req: NextRequest) {
    try {
        // Extract the categoryId from the query parameters
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");

        if (!categoryId) {
            return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
        }

        // Reference the document in Firestore
        const categoryRef = doc(db, "course-category", categoryId);

        // Delete the category document from Firestore
        await deleteDoc(categoryRef);

        return NextResponse.json({ message: "Course category deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting course category:", error);
        return NextResponse.json({ error: "Failed to delete course category." }, { status: 500 });
    }
}
