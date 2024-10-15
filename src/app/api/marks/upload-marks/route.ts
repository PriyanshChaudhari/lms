import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, getDoc, setDoc, writeBatch, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// Define the type for user data
interface marksData {
    user_id: string;
    course_id: string;
    marks: string;
    event_name: string;
}

export async function POST(req: NextRequest) {
    try {
        const jsonData = await req.json();
        console.log(jsonData);

        const formattedJsonData = jsonData.map((user: any) => ({
            ...user,
            user_id: String(user.user_id),
        }));

        const userRecords = await batchUsersCreation(formattedJsonData);

        console.log("Batch user creation successful");
        return NextResponse.json({ message: 'Users created', users: userRecords }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create users' }, { status: 500 });
    }
}

export async function batchUsersCreation(jsonData: marksData[]) {
    const batch = writeBatch(db);

    try {
        for (const user of jsonData) {
            console.log(user);
            const { user_id, course_id, event_name, marks } = user;

            // Validate inputs
            if (!user_id) {
                throw new Error('User ID is required');
            }

            // Check if the event exists in the events collection
            const eventsCollection = collection(db, 'events');
            const eventsQuery = query(eventsCollection, where('course_id', '==', course_id), where('event_name', '==', event_name));
            const eventsSnapshot = await getDocs(eventsQuery);

            if (eventsSnapshot.empty) {
                // Create a new event if it does not exist
                console.log(`Creating a new event with courseId ${course_id} and eventName ${event_name}...`);
                await addDoc(eventsCollection, {
                    course_id: course_id,
                    event_name: event_name,
                });
            }

            const userRef = doc(db, "marks", `${course_id}_${event_name}_${user_id}`);
            const userSnap = await getDoc(userRef);

            // Create a new user if they do not exist
            console.log(`Creating a new user with userId ${user_id}...`);

            batch.set(userRef, {
                user_id: user_id,
                course_id: course_id,
                marks: marks,
                event_name: event_name,
            });
        }

        await batch.commit();
        console.log("Batch marks upload successful");

        // Return success with user information
        return jsonData.map(user => ({
            user_id: Number(user.user_id), // Return userId as a number
            course_id: user.course_id,
            event_name: user.event_name
        }));

    } catch (error) {
        console.error('Error creating/updating users in batch:', error);
        throw new Error('Error creating/updating users in batch');
    }
}