import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, doc, updateDoc, deleteDoc, getDoc, query, where, getDocs, writeBatch } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { category_name, parent_category_id } = await req.json();
        const category_upperName = category_name.toString().toUpperCase();
        const docRef = await addDoc(collection(db, 'course-category'), {
            category_name: category_upperName,
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
        const category_upperName = category_name.toString().toUpperCase();
        // Get the document reference of the category to modify
        const categoryRef = doc(db, 'course-category', id);

        // Update the category in Firestore
        await updateDoc(categoryRef, {
            category_name: category_upperName,
            parent_category_id: parent_category_id || null, // Set to null if no parent category
        });

        return NextResponse.json({ message: 'Course category updated successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error updating course category:", error);
        return NextResponse.json({ error: 'Failed to update course category' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const categoryId = req.nextUrl.searchParams.get('categoryId');

    if (!categoryId) {
        return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    try {
        const categoryRef = doc(db, 'course-category', categoryId);
        const categorySnap = await getDoc(categoryRef);

        if (!categorySnap.exists()) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        // Step 1: Get the parent_category_id of the category to delete
        const parentCategoryId = categorySnap.data().parent_category_id || null;

        // Step 2: Update related courses' category_id to the parent category if available, else set to null
        await updateRelatedCourses(categoryId, parentCategoryId);

        // Step 3: Delete the category itself
        await deleteDoc(categoryRef);
        console.log(`Category with categoryId ${categoryId} deleted successfully.`);

        return NextResponse.json({ message: 'Category deleted successfully and related courses updated' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}

// Helper function to update related courses
async function updateRelatedCourses(categoryId: string, parentCategoryId: string | null) {
    const batch = writeBatch(db);
    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, where('category', '==', categoryId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docSnap) => {
        batch.update(docSnap.ref, { category: parentCategoryId }); // Set to parent category ID, or null if no parent exists
    });

    if (!querySnapshot.empty) {
        await batch.commit();
        console.log(`Updated category_id for all courses with categoryId ${categoryId} to ${parentCategoryId || 'null'}.`);
    }
}