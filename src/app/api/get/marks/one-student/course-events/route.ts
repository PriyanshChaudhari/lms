import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define the type for user data
interface marksData {
    userId: string;
    marks: string;
    event_name: string;
    course_id: string;
}

// Function to handle GET request to fetch event marks for a specific course
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');
        const courseId = searchParams.get('course_id');

        if (!userId || !courseId) {
            return NextResponse.json({ error: 'UserId and CourseId are required' }, { status: 400 });
        }

        const eventMarks = await fetchEventMarksByCourse(userId, courseId);

        return NextResponse.json({ user_id: userId, course_id: courseId, event_marks: eventMarks }, { status: 200 });
    } catch (error) {
        console.error('Error fetching marks:', error);
        return NextResponse.json({ error: 'Failed to fetch marks' }, { status: 500 });
    }
}

// Helper function to fetch event marks by course
async function fetchEventMarksByCourse(userId: string, courseId: string) {
    // Fetch marks for the given user_id and course_id
    const marksCollection = collection(db, 'marks');
    const marksQuery = query(marksCollection, where('user_id', '==', userId), where('course_id', '==', courseId));
    const marksSnapshot = await getDocs(marksQuery);

    const marksData = marksSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            event_id: data.event_id,
            event_name: data.event_name,
            marks: data.marks
        };
    });

    return marksData;
}