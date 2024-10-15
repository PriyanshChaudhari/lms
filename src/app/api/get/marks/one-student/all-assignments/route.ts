import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Helper function to fetch obtained marks by user
async function fetchObtainedMarks(userId: string) {
    const submissionsCollection = collection(db, 'submissions');
    const submissionsQuery = query(submissionsCollection, where('user_id', '==', userId));
    const submissionsSnapshot = await getDocs(submissionsQuery);

    const out = submissionsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            assignment_id: data.assignment_id,
            obtained_marks: data.marks_obtained
        };
    });
    console.log(out);
    return out;
}

// Helper function to fetch total marks for all assignments
async function fetchTotalMarks() {
    const assignmentsCollection = collection(db, 'assessments');
    const assignmentsSnapshot = await getDocs(assignmentsCollection);

    const out= assignmentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            assignment_id: doc.id,
            total_marks: data.total_marks
        };
    });
    console.log(out);
    return out;
}

// Main function to fetch marks by user
async function fetchMarksByUser(userId: string) {
    const obtainedMarksData = await fetchObtainedMarks(userId);
    const totalMarksData = await fetchTotalMarks();

// Combine obtained marks with total marks
const marksData = obtainedMarksData.map(obtained => {
    const totalMarks = totalMarksData.find(total => total.assignment_id === obtained.assignment_id);
    return {
        assignment_id: obtained.assignment_id,
        obtained_marks: obtained.obtained_marks,
        total_marks: totalMarks ? totalMarks.total_marks : 'N/A'
    };
});

    return NextResponse.json({ user_id: userId, marks: marksData }, { status: 200 });
}

// Function to handle GET request
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
        }

        return await fetchMarksByUser(userId);
    } catch (error) {
        console.error('Error fetching marks:', error);
        return NextResponse.json({ error: 'Failed to fetch marks' }, { status: 500 });
    }
}