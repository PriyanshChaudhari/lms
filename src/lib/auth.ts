import bcrypt from 'bcryptjs';
// import { getFirestore } from 'firebase-admin/firestore';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from "firebase/firestore";

// Assume a function to verify the PRN and password with Firestore
export async function signInWithPRN(prn: string, password: string) {
    try {
        // // Retrieve the user document by PRN
        // const userDoc = await db.collection('users').doc(prn).get();
        const userDocRef = doc(db, "users", prn);
        const userDoc = await getDoc(userDocRef);


        if (!userDoc.exists) {
            console.log('No user found with PRN:', prn);
            return null;
        }

        const userData = userDoc.data();
        if (!userData) {
            console.log('User data is missing.');
            return null;
        }

        const userEmail = userData.email;
        const userPRN = userData.prn;
        const storedPasswordHash = userData.passwordHash;

        console.log("Stored password hash: ", storedPasswordHash);

        // Validate the password
        if (storedPasswordHash && await bcrypt.compare(password, storedPasswordHash)) {
            return {
                prn: userPRN,
                email: userEmail,
            };
        } else {
            console.log("Password validation failed.");
            return null;
        }
    } catch (error) {
        console.error('Error fetching user record:', error);
        return null;
    }
}

// Create a function to handle sending the password reset email:
import { auth } from './firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

export const sendPasswordReset = async (prn: string): Promise<string> => {
    try {
        const email = await getUserEmailByPRN(prn);
        console.log('Email retrieved:', email); // Verify that email is correctly retrieved

        if (email) {
            await sendPasswordResetEmail(auth, email);
            return 'If an account with that PRN exists, a password reset link has been sent.';
        } else {
            return 'No account found with that PRN.';
        }
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return 'An error occurred while sending the password reset email.';
    }
};


// services/userService.ts
import { collection, query, where, getDocs } from 'firebase/firestore';

export const getUserEmailByPRN = async (prn: string): Promise<string | null> => {
    try {
        const usersCollection = collection(db, 'users');
        console.log('Users Collection:', usersCollection); // Check if the collection is correct
        const q = query(usersCollection, where('prn', '==', prn));
        console.log('Query:', q); // Check if the query is correctly formed
        const querySnapshot = await getDocs(q);
        console.log('Query Snapshot:', querySnapshot); // Check if the snapshot is correct

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            console.log('User Document Data:', userDoc); // Check if the email field exists

            return userDoc.email as string; // Ensure 'email' is present in your schema
        }

        return null;
    } catch (error) {
        console.error('Error fetching user email by PRN:', error);
        return null;
    }
};



