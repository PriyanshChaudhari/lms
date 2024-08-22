// lib/auth.ts

import bcrypt from 'bcrypt';
// import { getFirestore } from 'firebase-admin/firestore';
import { db } from '@/firebase/firebaseConfig';
import { doc, getDoc } from "firebase/firestore";

// Initialize Firestore
// const db = getFirestore();

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
