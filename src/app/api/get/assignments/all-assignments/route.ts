import { NextResponse } from 'next/server';

interface Assignment {
    id: string;
    [key: string]: any; // Adjust the properties as needed
}
import { db } from '@/lib/firebaseConfig'; // Your Firebase config

interface Participant {
    id: string;
    [key: string]: any; // Adjust the properties as needed
}
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

        let moduleIds: string[] = [];

        if (!modulesSnapshot.empty) {
            // Extract module IDs
            moduleIds = modulesSnapshot.docs.map(doc => doc.id);
        }

        let assignments: Assignment[] = [];
        if (moduleIds.length > 0) {
            // Step 2: Query to get assignments based on module IDs
            const assignmentsQuery = query(
                collection(db, 'assessments'), // Adjust the collection name if needed
                where('module_id', 'in', moduleIds), // Use the module IDs
                where('assessment_type', '==', 'assignment') // Fetch only assignments
            );

            // Fetch the documents from the assignments query
            const assignmentsSnapshot = await getDocs(assignmentsQuery);

            if (!assignmentsSnapshot.empty) {
                // Map through the assignments snapshot and return an array of assignments
                assignments = assignmentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            }
        }

        // Continue with other API calls or logic even if no assignments are found
        // For example, you can call another API or perform other operations here

        // Example: Fetch participants based on courseId
        const participantsQuery = query(
            collection(db, 'participants'), // Adjust the collection name if needed
            where('course_id', '==', courseId)
        );

        const participantsSnapshot = await getDocs(participantsQuery);

        let participants: Participant[] = [];

        if (!participantsSnapshot.empty) {
            participants = participantsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        }

        // Return the array of assignments and participants
        return NextResponse.json({ assignments, participants, status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}