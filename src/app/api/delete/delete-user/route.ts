// import { NextRequest, NextResponse } from 'next/server';
// import { db, storage } from '@/lib/firebaseConfig'; // Import storage from firebase config
// import { doc, deleteDoc, getDoc } from 'firebase/firestore';
// import { ref, deleteObject } from 'firebase/storage';

// export async function DELETE(req: NextRequest) {
//     const userId = req.nextUrl.searchParams.get('id');

//     if (!userId) {
//         return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
//     }

//     try {
//         const userRef = doc(db, 'users', userId);
//         const userSnap = await getDoc(userRef);

//         if (!userSnap.exists()) {
//             return NextResponse.json({ error: 'User not found' }, { status: 404 });
//         }

//         // Step 1: Delete the profile picture from Firebase Storage
//         const profilePicRef = ref(storage, `users/${userId}/profile_pic.png`);
//         try {
//             await deleteObject(profilePicRef);
//             console.log(`Profile picture for userId ${userId} deleted successfully.`);
//         } catch (imageError) {
//             console.error(`Error deleting profile picture for userId ${userId}:`, imageError);
//         }

//         // Step 2: Delete the user document from Firestore
//         await deleteDoc(userRef);
//         console.log(`User with userId ${userId} deleted successfully.`);

//         return NextResponse.json({ message: 'User and profile picture deleted successfully' }, { status: 200 });
//     } catch (error) {
//         console.error('Error deleting user:', error);
//         return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
//     }
// }
import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebaseConfig';
import {
    doc,
    deleteDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    writeBatch,
    addDoc,
    DocumentSnapshot,
    DocumentData,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

export async function DELETE(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('id');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const userRef = doc(db, 'users', userId);
        const userSnap: DocumentSnapshot<DocumentData> = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Step 1: Log audit action
        await logAuditAction(userId, userSnap);

        // Step 2: Cascade deletes for related data
        const collectionsToCascade = [
            { name: 'enrolled_at', field: 'user_id' },
            { name: 'submissions', field: 'user_id' },
            { name: 'marks', field: 'user_id' },
            { name: 'group_members', field: 'user_id' },
        ];

        for (const collectionInfo of collectionsToCascade) {
            await deleteRelatedDocuments(collectionInfo.name, collectionInfo.field, userId);
        }

        // Step 3: Delete the profile picture from Firebase Storage
        const profilePicRef = ref(storage, `users/${userId}/profile_pic.png`);
        try {
            await deleteObject(profilePicRef);
            console.log(`Profile picture for userId ${userId} deleted successfully.`);
        } catch (imageError) {
            console.error(`Error deleting profile picture for userId ${userId}:`, imageError);
        }

        // Step 4: Delete the user document from Firestore
        await deleteDoc(userRef);
        console.log(`User with userId ${userId} deleted successfully.`);

        return NextResponse.json({ message: 'User, related data, and profile picture deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

// Helper function to cascade delete related documents
async function deleteRelatedDocuments(collectionName: string, field: string, userId: string) {
    const batch = writeBatch(db);
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(field, '==', userId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
    });

    if (!querySnapshot.empty) {
        await batch.commit();
        console.log(`Deleted documents from ${collectionName} for userId ${userId}.`);
    }
}

// Helper function to log the audit action
async function logAuditAction(userId: string, userSnap: DocumentSnapshot<DocumentData>) {
    const auditLogRef = collection(db, 'auditLogs');
    await addDoc(auditLogRef, {
        action: 'DELETE',
        userId,
        timestamp: new Date().toISOString(),
        userData: userSnap.data(), // Optionally store the user's data
        reason: 'User account deletion',
    });
    console.log(`Audit log for userId ${userId} created.`);
}
