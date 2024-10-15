import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define the type for user data
interface marksData {
    userId: string;
    marks: string;
}

// New function to fetch marks of all students for a specific assignment
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const assignmentId = searchParams.get('assignment_id');

        if (!assignmentId) {
            return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
        }

        return await fetchMarksByAssignment(assignmentId);
    } catch (error) {
        console.error('Error fetching marks:', error);
        return NextResponse.json({ error: 'Failed to fetch marks' }, { status: 500 });
    }
}

// Helper function to fetch marks by assignment
async function fetchMarksByAssignment(assignmentId: string) {
    const submissionsCollection = collection(db, 'submissions');
    const q = query(submissionsCollection, where('assignment_id', '==', assignmentId));
    const querySnapshot = await getDocs(q);

    const marksData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            user_id: data.user_id,
            obtained_marks: data.marks_obtained
        };
    });

    return NextResponse.json({ assignment_id: assignmentId, marks: marksData }, { status: 200 });
}