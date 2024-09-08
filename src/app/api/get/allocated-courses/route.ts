import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();
        const enrollmentsQuery = query(
            collection(db, 'enrolled_at'),
            where('student_id', '==', userId)
        );
        const enrollmentSnapshots = await getDocs(enrollmentsQuery);

        const courses = [];
        for (const enrollmentDoc of enrollmentSnapshots.docs) {
            const enrollmentData = enrollmentDoc.data();
            const courseId = enrollmentData.course_id;

            const courseDocRef = doc(db, 'courses', courseId);
            const courseDoc = await getDoc(courseDocRef);

            if (courseDoc.exists()) {
                courses.push({
                    course_id: courseId,
                    ...courseDoc.data()
                });
            }
        }
        // console.log(courses)
        return NextResponse.json({ courses });
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        return NextResponse.json({ error: 'Failed to fetch enrolled courses' }, { status: 500 });
    }
}
