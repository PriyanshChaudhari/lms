import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export async function GET(req: NextRequest, { params }) {
    const { userId } = params;  // Get user ID (teacher or student)
    console.log(`User ID: ${userId}`);

    try {
        // Step 1: Query 'enrolled_at' table to get course_ids associated with the user
        const enrolledAtCollectionRef = collection(db, 'enrolled_at');
        const enrollmentQuery = query(enrolledAtCollectionRef, where('user_id', '==', userId));
        const enrollmentSnapshot = await getDocs(enrollmentQuery);

        if (enrollmentSnapshot.empty) {
            return NextResponse.json({ success: true, data: [], message: 'No courses found for this user.' });
        }

        // Step 2: Fetch all course_ids from the enrollment data
        const courseIds = enrollmentSnapshot.docs.map(doc => doc.data().course_id);

        // Step 3: Query 'courses' table to get detailed information for each course_id
        const coursesPromises = courseIds.map(async (courseId) => {
            const courseDocRef = doc(db, 'courses', courseId);
            const courseDoc = await getDoc(courseDocRef);

            if (courseDoc.exists()) {
                return {
                    course_id: courseId,
                    ...courseDoc.data(),  // Add course data
                };
            } else {
                console.log(`Course with ID ${courseId} not found`);
                return null;
            }
        });

        // Step 4: Wait for all course details to be fetched
        const coursesList = (await Promise.all(coursesPromises)).filter(Boolean);  // Filter out null values

        return NextResponse.json({ success: true, data: coursesList });
    } catch (error: any) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch course data' }, { status: 500 });
    }
}
