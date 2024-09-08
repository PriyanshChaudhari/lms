import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';  // Your Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(req: Request) {
    try {
        // Parse JSON body to get courseId
        const { moduleId } = await req.json();

        if (!moduleId) {
            return NextResponse.json({ error: "courseId is required" }, { status: 400 });
        }

        // Query to get the assignments based on courseId
        const assignmentsQuery = query(
            collection(db, 'assessments'),
            where('module_id', '==', moduleId),
            where('assessment_type', '==', 'assignment')
        );

        // Fetch the documents from the query
        const snapshot = await getDocs(assignmentsQuery);

        // If no documents are found
        if (snapshot.empty) {
            return NextResponse.json({ message: 'No assignments found' }, { status: 404 });
        }

        // Map through the snapshot and return an array of assignments
        const assignments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Return the array of assignments
        return NextResponse.json(assignments, { status: 200 });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
    }
}

