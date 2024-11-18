import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, getDoc, setDoc, writeBatch, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// Define the type for user data
interface marksData {
    user_id: string;
    course_id: string;
    marks: string;
    event_id: string;
}

export async function POST(req: NextRequest) {
    try {
        const jsonData = await req.json();
        console.log(jsonData);

        const eventName = jsonData[0].event_name; // Assuming all rows have the same event_name
        const courseId = jsonData[0].course_id;

        const eventId = await getOrCreateEvent(eventName, courseId);

        const formattedJsonData = jsonData.map((user: any) => ({
            ...user,
            user_id: String(user.user_id),
            event_id: eventId,
            event_name: undefined // Remove event_name as it's no longer needed
        }));

        const userRecords = await batchUsersCreation(formattedJsonData);

        console.log("Batch user creation successful");
        return NextResponse.json({ message: 'Users created', users: userRecords }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create users' }, { status: 500 });
    }
}

// Helper function to get or create an event
async function getOrCreateEvent(eventName: string, courseId: string) {
    const eventsCollection = collection(db, 'events');
    const eventsQuery = query(eventsCollection, where('event_name', '==', eventName), where('course_id', '==', courseId));
    const eventsSnapshot = await getDocs(eventsQuery);

    if (!eventsSnapshot.empty) {
        // Event already exists, return the existing event ID
        return eventsSnapshot.docs[0].id;
    } else {
        // Event does not exist, create a new event
        const newEvent = {
            event_name: eventName,
            course_id: courseId
        };
        const eventDocRef = await addDoc(eventsCollection, newEvent);
        return eventDocRef.id;
    }
}

async function batchUsersCreation(jsonData: marksData[]) {
    const batch = writeBatch(db);

    try {
        for (const user of jsonData) {
            console.log(user);
            const { user_id, course_id, event_id, marks } = user;

            // Validate inputs
            if (!user_id) {
                throw new Error('User ID is required');
            }

            const userRef = doc(db, "marks", `${course_id}_${event_id}_${user_id}`);
            const userSnap = await getDoc(userRef);

            // Create a new user if they do not exist
            console.log(`Creating a new user with userId ${user_id}...`);

            batch.set(userRef, {
                user_id: user_id,
                course_id: course_id,
                marks: marks,
                event_id: event_id,
            });
        }

        await batch.commit();
        console.log("Batch marks upload successful");

        // Return success with user information
        return jsonData.map(user => ({
            user_id: Number(user.user_id), // Return userId as a number
            course_id: user.course_id,
            event_id: user.event_id
        }));

    } catch (error) {
        console.error('Error creating/updating users in batch:', error);
        throw new Error('Error creating/updating users in batch');
    }
}