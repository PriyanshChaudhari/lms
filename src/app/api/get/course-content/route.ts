import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { moduleId } = await req.json();
    try {
        const contentQuery = query(
            collection(db, 'course-content'),
            where('module_id', '==', moduleId)
        );

        const querySnapshot = await getDocs(contentQuery);
        const content = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // console.log(content)
        return NextResponse.json({ success: true, content : content});
    } catch (error) {
        console.error('Error fetching course content:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch course content' });
    }
}
