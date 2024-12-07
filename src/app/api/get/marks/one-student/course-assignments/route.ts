import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig'; // Your Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');
        const courseId = searchParams.get('course_id');

        if (!userId || !courseId) {
            return NextResponse.json({ error: 'UserId and CourseId are required' }, { status: 400 });
        }

        const assignmentMarks = await fetchAssignmentMarksByCourse(userId, courseId);

        // Return the array of assignment marks
        return NextResponse.json({ user_id: userId, course_id: courseId, assignment_marks: assignmentMarks }, { status: 200 });
    } catch (error) {
        console.error('Error fetching assignment marks:', error);
        return NextResponse.json({ error: 'Failed to fetch assignment marks' }, { status: 500 });
    }
}

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

    let marksData = [];
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
            // Map through the assignments snapshot and fetch obtained marks from submissions
            for (const assignmentDoc of assignmentsSnapshot.docs) {
                const assignmentData = assignmentDoc.data();
                const assignmentId = assignmentDoc.id;

                // Query to get submissions based on assignment ID and user ID
                const submissionsQuery = query(
                    collection(db, 'submissions'), // Adjust the collection name if needed
                    where('assignment_id', '==', assignmentId), // Use the assignment ID
                    where('user_id', '==', userId) // Use the user ID
                );

                // Fetch the documents from the submissions query
                const submissionsSnapshot = await getDocs(submissionsQuery);

                let obtainedMarks = null;
                if (!submissionsSnapshot.empty) {
                    // Assuming there is only one submission per assignment per user
                    console.log("submission marks: ", submissionsSnapshot.docs[0].data())
                    obtainedMarks = submissionsSnapshot.docs[0].data().marks_obtained;
                }

                marksData.push({
                    assessment_id: assignmentId,
                    obtained_marks: obtainedMarks,
                    total_marks: assignmentData.total_marks
                });
            }
        }
    }

    console.log("marksData: ", marksData)
    return marksData;
}