import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig'; // Your Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(req: Request) {
    try {
        // Parse JSON body to get assignmentId
        const { assignmentId } = await req.json();

        if (!assignmentId) {
            return NextResponse.json({ error: "assignmentId is required" }, { status: 400 });
        }

        // Query to get submissions based on assignmentId
        const submissionsQuery = query(
            collection(db, 'submissions'), // Adjust collection name if needed
            where('assignment_id', '==', assignmentId) // Fetch submissions for the specific assignment
        );

        // Fetch the documents from the submissions query
        const submissionsSnapshot = await getDocs(submissionsQuery);

        if (submissionsSnapshot.empty) {
            return NextResponse.json({ message: 'No submissions found for this assignment' }, { status: 404 });
        }

        // Map through the submissions snapshot and return an array of submissions
        const submissions = submissionsSnapshot.docs.map(doc => ({
            submission_id: doc.id,
            ...doc.data(),
        }));

        // Return the array of submissions
        return NextResponse.json({ submissions: submissions, status: 200 });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}
