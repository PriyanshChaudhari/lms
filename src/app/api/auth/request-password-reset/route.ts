// src/app/api/auth/request-password-reset/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from '@/lib/sendEmail';

// Handler for POST requests
export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();
        if (!userId) {
            return NextResponse.json({ message: 'userId is required' }, { status: 400 });
        }

        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const userData = userDoc.data();
        const email = userData?.email;

        if (!email) {
            return NextResponse.json({ message: 'Email not found for the user' }, { status: 404 });
        }

        const resetToken = uuidv4();
        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

        await updateDoc(userDocRef, {
            resetToken,
            resetTokenExpires: Date.now() + 3600000,
        });

        console.log(email)
        await sendPasswordResetEmail(email, resetLink);

        return NextResponse.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error processing password reset request:', error);
        return NextResponse.json({ message: 'An error occurred while processing the request' }, { status: 500 });
    }
}