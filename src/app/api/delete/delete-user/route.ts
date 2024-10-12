import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebaseConfig'; // Import storage from firebase config
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

export async function DELETE(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('id');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Step 1: Delete the profile picture from Firebase Storage
        const profilePicRef = ref(storage, `users/${userId}/profile_pic.png`);
        try {
            await deleteObject(profilePicRef);
            console.log(`Profile picture for userId ${userId} deleted successfully.`);
        } catch (imageError) {
            console.error(`Error deleting profile picture for userId ${userId}:`, imageError);
        }

        // Step 2: Delete the user document from Firestore
        await deleteDoc(userRef);
        console.log(`User with userId ${userId} deleted successfully.`);

        return NextResponse.json({ message: 'User and profile picture deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
