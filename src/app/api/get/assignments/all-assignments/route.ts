import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig'; // Your Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(req: Request) {
    try {
        // Parse JSON body to get courseId
        const { courseId } = await req.json();

        if (!courseId) {
            return NextResponse.json({ error: "courseId is required" }, { status: 400 });
        }

        // Step 1: Query to get modules based on courseId
        const modulesQuery = query(
            collection(db, 'course-module'), // Adjust the collection name if it's different
            where('course_id', '==', courseId)
        );

        // Fetch the documents from the modules query
        const modulesSnapshot = await getDocs(modulesQuery);

        if (modulesSnapshot.empty) {
            return NextResponse.json({ message: 'No modules found for this course' }, { status: 404 });
        }

        // Extract module IDs
        const moduleIds = modulesSnapshot.docs.map(doc => doc.id);

        // Step 2: Query to get assignments based on module IDs
        const assignmentsQuery = query(
            collection(db, 'assessments'), // Adjust the collection name if needed
            where('module_id', 'in', moduleIds), // Firestore allows querying on array of values with `in`
            where('assessment_type', '==', 'assignment') // Fetch only assignments
        );

        // Fetch the documents from the assignments query
        const assignmentsSnapshot = await getDocs(assignmentsQuery);

        if (assignmentsSnapshot.empty) {
            return NextResponse.json({ message: 'No assignments found for these modules' }, { status: 404 });
        }

        // Map through the assignments snapshot and return an array of assignments
        const assignments = assignmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Return the array of assignments
        return NextResponse.json({ assignments: assignments, status: 200 });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
    }
}
