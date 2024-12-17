import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig'; // Your Firebase config
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

// Define types for submission and user data
interface Submission {
    submission_id: string;
    assignment_id: string;
    user_id: string;
    [key: string]: any; // Additional fields in submission document
    user?: User | null; // Optional user data
}

interface User {
    id: string;
    [key: string]: any; // Additional fields in user document
}

export async function POST(req: Request): Promise<NextResponse> {
    try {
        // Parse JSON body to get assignmentId
        const { assignmentId }: { assignmentId: string } = await req.json();

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
        const submissions: Submission[] = await Promise.all(
            submissionsSnapshot.docs.map(async (docSnapshot) => {
                const submissionData: Submission = {
                    submission_id: docSnapshot.id,
                    assignment_id: docSnapshot.data().assignment_id,
                    user_id: docSnapshot.data().user_id,
                    ...docSnapshot.data(),
                };

                // Assuming each submission has a user_id field
                const userDocRef = doc(db, 'users', submissionData.user_id); // Use submission's user_id
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData: User = {
                        id: userDoc.id,
                        ...userDoc.data(),
                    };
                    submissionData.user = userData; // Add user data to the submission
                } else {
                    submissionData.user = null; // Handle case where user doesn't exist
                }

                return submissionData;
            })
        );

        // Return the array of submissions with user data
        return NextResponse.json({ submissions, status: 200 });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}
