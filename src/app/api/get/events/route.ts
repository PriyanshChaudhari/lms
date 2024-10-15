import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';

// Define the type for user data
interface marksData {
    userId: string;
    marks: string;
    event_name: string;
    course_id: string;
}

// Function to handle GET request to fetch events for a specific course
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('course_id');

        if (!courseId) {
            return NextResponse.json({ error: 'CourseId is required' }, { status: 400 });
        }

        const events = await fetchEventsByCourse(courseId);
        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

// Helper function to fetch event names and their IDs by course from the events collection
async function fetchEventsByCourse(courseId: string) {
    const eventsCollection = collection(db, 'events');
    const eventsQuery = query(eventsCollection, where('course_id', '==', courseId));
    const eventsSnapshot = await getDocs(eventsQuery);

    const events = eventsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            event_name: data.event_name
        };
    });

    return events;
}