import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

interface Participant {
    userId: string;
    role: string;
}

export async function POST(req: NextRequest) {
    const { courseId } = await req.json();

    console.log(courseId);
    if (!courseId) {
        return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    try {
        const result = await fetchParticipantCount(courseId);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching participant count and roles:', error);
        return NextResponse.json({ error: 'Failed to fetch participant count and roles' }, { status: 500 });
    }
}

async function fetchParticipantCount(course_id: string) {
    const enrollmentsQuery = query(
        collection(db, 'enrolled_at'),
        where('course_id', '==', course_id)
    );
    const enrollmentsSnapshot = await getDocs(enrollmentsQuery);

    let studentCount = 0;
    let teacherCount = 0;

    const participants: Participant[] = await Promise.all(
        enrollmentsSnapshot.docs.map(async (enrollmentDoc) => {
            const userId = enrollmentDoc.data().user_id;
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            const role = userDoc.exists() ? userDoc.data().role : 'Unknown';
            if (role === 'Student') studentCount += 1;
            else if (role === 'Teacher') teacherCount += 1;

            return { userId, role };
        })
    );

    return {
        participantCount: enrollmentsSnapshot.size,
        participants,
        roleCount: { students: studentCount, teachers: teacherCount }
    };
}