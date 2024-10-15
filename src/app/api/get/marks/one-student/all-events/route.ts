import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define the type for user data
interface marksData {
    userId: string;
    marks: string;
    event_name: string;
}

// Function to fetch marks of all students for a specific event
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const eventName = searchParams.get('event_name');
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

// Helper function to fetch marks by user
async function fetchMarksByUser(userId: string) {
    const marksCollection = collection(db, 'marks');
    const q = query(marksCollection, where('user_id', '==', userId));
    const querySnapshot = await getDocs(q);

    const marksData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            event_name: data.event_name,
            marks: data.marks
        };
    });

    return NextResponse.json({ user_id: userId, marks: marksData }, { status: 200 });
}