import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, writeBatch } from 'firebase/firestore';

// Define the type for user data (for deletion, you just need the userId)
interface UserData {
    userId: string;
}

export async function POST(req: NextRequest) {
    try {
        const jsonData = await req.json();
        console.log('Received data:', jsonData);

        // Ensure we access the userIds array correctly
        const userIds = jsonData.userIds;
        console.log('Processing userIds:', userIds);

        // Call the batch deletion function
        const deletedUserRecords = await batchUsersDeletion(userIds);
        console.log("Batch user deletion successful");
        return NextResponse.json({ message: 'Users deleted', users: deletedUserRecords }, { status: 200 });
    } catch (error) {
        console.error('Error in POST method:', error);
        return NextResponse.json({ error: 'Failed to delete users' }, { status: 500 });
    }
}

export async function batchUsersDeletion(userIds: UserData[]) {
    const batch = writeBatch(db);

    try {
        const deletedUsers = [];

        for (const user of userIds) {
            const userId = user.userId.toString(); // Ensure userId is a string
            console.log(`Processing userId: ${userId}`);

            if (!userId) {
                throw new Error('User ID is required');
            }

            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                console.log(`Deleting user with userId ${userId}...`);
                batch.delete(userRef);
                deletedUsers.push({ userId });
            } else {
                console.log(`User with userId ${userId} does not exist, skipping deletion`);
            }
        }

        // Commit the batch deletion
        await batch.commit();
        console.log("Batch user deletion successful");

        return deletedUsers;
    } catch (error: any) {
        console.error('Error deleting users in batch:', error);
        throw new Error(`Error deleting users in batch: ${error.message}`);
    }
}
