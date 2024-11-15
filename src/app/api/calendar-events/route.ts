import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        // Destructure the event data from the request
        const { eventTitle, description, date, createdByUserId, notifiedUserIds } = await req.json();

        // Validate input fields
        if (!eventTitle || !description || !date || !createdByUserId || !notifiedUserIds || !Array.isArray(notifiedUserIds)) {
            return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
        }

        // Add the event to the database
        const eventsCollectionRef = collection(db, 'calendar_events');
        await addDoc(eventsCollectionRef, {
            event_title: eventTitle,
            description: description,
            date: new Date(date), // Ensure the date is stored as a Date object
            created_by_user_id: createdByUserId,
            notified_user_ids: notifiedUserIds,
        });

        return NextResponse.json({ message: 'Event created' }, { status: 201 });

    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}

// PUT method to update an event
export async function PUT(req: NextRequest) {
    try {
        const { eventId, eventTitle, description, date, notifiedUserIds } = await req.json();

        // Reference to the specific event document
        const eventRef = doc(db, 'calendar_events', eventId);

        // Check if event exists
        const eventDoc = await getDoc(eventRef);
        if (!eventDoc.exists()) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Update the event
        await updateDoc(eventRef, {
            event_title: eventTitle,
            description: description,
            date: new Date(date),
            notified_user_ids: notifiedUserIds,
            updated_at: new Date()
        });

        return NextResponse.json({ message: 'Event updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}

// DELETE method to remove an event
export async function DELETE(req: NextRequest) {
    try {
        // Get eventId from the URL search params
        const eventId = req.nextUrl.searchParams.get('eventId');

        if (!eventId) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        // Reference to the specific event document
        const eventRef = doc(db, 'calendar_events', eventId);

        // Check if event exists
        const eventDoc = await getDoc(eventRef);
        if (!eventDoc.exists()) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Delete the event
        await deleteDoc(eventRef);

        return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
