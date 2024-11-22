import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebaseConfig'; // Your Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';

async function fetchAssignmentMarksByCourse(userId: string, courseId: string) {
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

    let assignments = [];
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

    return assignments;
}

async function fetchParticipantsByCourse(courseId: string) {
    // Example: Fetch participants based on courseId
    const participantsQuery = query(
        collection(db, 'participants'), // Adjust the collection name if needed
        where('course_id', '==', courseId)
    );

    const participantsSnapshot = await getDocs(participantsQuery);

    let participants = [];

    if (!participantsSnapshot.empty) {
        participants = participantsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }

    return participants;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');
        const courseId = searchParams.get('course_id');

        if (!userId || !courseId) {
            return NextResponse.json({ error: 'UserId and CourseId are required' }, { status: 400 });
        }

        const assignmentMarks = await fetchAssignmentMarksByCourse(userId, courseId);
        const participants = await fetchParticipantsByCourse(courseId);

        // Return the array of assignments and participants
        return NextResponse.json({ assignments: assignmentMarks, participants, status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}