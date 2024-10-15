import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define the type for user data
interface marksData {
    userId: string;
    marks: string;
    event_name: string;
}

// New function to fetch marks of all students for a specific event
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const eventName = searchParams.get('event_name');

        if (!eventName) {
            return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
        }

        return await fetchMarksByEvent(eventName);
    } catch (error) {
        console.error('Error fetching marks:', error);
        return NextResponse.json({ error: 'Failed to fetch marks' }, { status: 500 });
    }
}

// Helper function to fetch marks by event
async function fetchMarksByEvent(eventName: string) {
    const marksCollection = collection(db, 'marks');
    const q = query(marksCollection, where('event_name', '==', eventName));
    const querySnapshot = await getDocs(q);

    const marksData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            user_id: data.user_id,
            marks: data.marks
        };
    });

    return NextResponse.json({ event_name: eventName, marks: marksData }, { status: 200 });
}