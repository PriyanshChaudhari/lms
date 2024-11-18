import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebaseConfig'; // Import storage from firebase config
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

// Define the type for user data
interface UserData {
    userId: string;
}

export async function POST(req: NextRequest) {
    try {
        const jsonData = await req.json();
        console.log('Received data:', jsonData);

        // Access the userIds array from the request
        const userIds = jsonData.userId;
        if (!Array.isArray(userIds)) {
            throw new Error("Invalid userIds format. Expected an array.");
        }
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

async function batchUsersDeletion(userIds: UserData[]) {
    const batch = writeBatch(db);

    try {
        const deletedUsers = [];

        for (const user of userIds) {
            const userId = user.userId.toString(); // Ensure userId is a string
            console.log(`Processing userId: ${userId}`);

            if (!userId) {
                throw new Error('User ID is required');
            }

            // Step 1: Reference to the user document in Firestore
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                // Step 2: Delete the profile picture from Firebase Storage
                const profilePicRef = ref(storage, `users/${userId}/profile_pic.png`);
                try {
                    console.log(`Deleting profile picture for userId ${userId}...`);
                    await deleteObject(profilePicRef);
                    console.log(`Profile picture for userId ${userId} deleted`);
                } catch (imageError) {
                    console.error(`Error deleting profile picture for userId ${userId}:`, imageError);
                }

                // Step 3: Add user document deletion to the batch
                console.log(`Deleting user with userId ${userId}...`);
                batch.delete(userRef);
                deletedUsers.push({ userId });
            } else {
                console.log(`User with userId ${userId} does not exist, skipping deletion`);
            }
        }

        // Step 4: Commit the batch deletion
        await batch.commit();
        console.log("Batch user deletion successful");

        return deletedUsers;
    } catch (error: any) {
        console.error('Error deleting users in batch:', error);
        throw new Error(`Error deleting users in batch: ${error.message}`);
    }
}
