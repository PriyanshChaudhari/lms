import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { courseId } = await req.json();

        // Query the enrollments where course_id matches the given courseId
        const enrollmentsQuery = query(
            collection(db, 'enrolled_at'),
            where('course_id', '==', courseId)
        );
        const enrollmentSnapshots = await getDocs(enrollmentsQuery);

        if (enrollmentSnapshots.empty) {
            return NextResponse.json({ participants: [] });
        }

        const participantsPromises = enrollmentSnapshots.docs.map(async (enrollmentDoc) => {
            const enrollmentData = enrollmentDoc.data();
            const userId = enrollmentData.user_id;

            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                return {
                    user_id: userId,
                    ...userDoc.data(),
                };
            }
            return null;
        });

        const participants = (await Promise.all(participantsPromises)).filter(Boolean);
        return NextResponse.json({ participants });
    } catch (error) {
        console.error('Error fetching enrolled participants:', error);
        return NextResponse.json({ error: 'Failed to fetch enrolled participants' }, { status: 500 });
    }
}
