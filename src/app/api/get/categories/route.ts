import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categoriesCollection = collection(db, 'course-category');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categories = categoriesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
