import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig'; // Import your database connection
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(req: NextRequest, { params }) {
    const { userId } = params;
    console.log(`Teacher ID : ${userId}`)

    try {
        const coursesCollectionRef = collection(db, 'courses');
        const q = query(coursesCollectionRef, where('teacher_id', '==', userId));
        const coursesSnapshot = await getDocs(q);
        const coursesList = coursesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(`Teacher CourseData ${coursesList}`)
        return NextResponse.json({ success: true, data: coursesList });
    } catch (error: any) {
        console.log(error)
    }
}