import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { doc, writeBatch, query, where, collection, getDocs, deleteDoc } from 'firebase/firestore';

// Define the type for user data
interface Enrollment {
    userId: string | number;
    course_name: string;
}

// DELETE endpoint to handle removing enrolled users
export async function POST(request: Request) {
    try {   
        const { users,idOfCourse } = await request.json();

        // Check if members is an array
        // if (!Array.isArray(users)) {
        //     throw new Error('Invalid data format: members should be an array');
        // }

        await batchEnrollmentDeletion(users,String(idOfCourse)); // Assuming this function handles batch deletion

        return new Response(JSON.stringify({ message: 'Enrolled users removed successfully' }), { status: 201 });
    } catch (error: any) {
        console.error('Error deleting enrolled users in batch:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// Function to batch process enrolled users deletion
export async function batchEnrollmentDeletion(users: Enrollment[],idOfCourse:string) {
    const batch = writeBatch(db);

    try {
        for (const user of users) {
            const { userId, course_name } = user;

            // Validate inputs
            if (!userId || !course_name) {
                throw new Error('userId and course_name are required');
            }

            // Get the course ID using the course name
            const courseId = await getCourseIdFromCourseName(course_name);
            console.log(`courseId: ${courseId}`);
            if (!courseId) {
                console.log(`Course with name ${course_name} does not exist`);
                continue;  // Skip if the course doesn't exist
            }

            if (courseId !== idOfCourse) {
                console.log(`Course ID mismatch. ${course_name} is not created by this user`);
                continue; // Skip if course doesn't match idOfCourse
            }

            // Check if the user is enrolled in the course
            const userEnrolled = await checkIfUserEnrolledInCourse(String(userId), courseId);
            if (!userEnrolled) {  // If the user is not enrolled in the course, skip deletion
                console.log(`User with userId ${userId} is not enrolled in course ${course_name}, skipping deletion`);
                continue;
            }

            const enrollmentRef = collection(db, 'enrolled_at');
            const q = query(enrollmentRef, where('course_id', '==', String(courseId)), where('user_id', '==', String(userId)));
            const querySnapshot = await getDocs(q);

            // Delete the matched document within the batch
            querySnapshot.forEach((doc) => {
                const memberRef = doc.ref; // Get a reference to the document
                batch.delete(memberRef); // Queue the deletion in the batch
            });

            console.log(`Removing userId ${userId} from course ${course_name}...`);
        }

        // Commit the batch
        await batch.commit();
        console.log("Batch enrollment deletion successful");

        return users.map(user => ({
            userId: user.userId,
            courseName: user.course_name,
        }));
    } catch (error) {
        console.error('Error deleting enrolled users in batch:', error);
        throw new Error('Error deleting enrolled users in batch');
    }
}

// Helper function to get course ID from course name
async function getCourseIdFromCourseName(course_name: string): Promise<string | null> {
    console.log("getCourseIdFromCourseName start");
    const courseQuery = query(collection(db, 'courses'), where('title', '==', course_name.toUpperCase()));
    const courseSnapshot = await getDocs(courseQuery);

    if (courseSnapshot.empty) {
        console.log("getCourseIdFromCourseName end return null");
        return null;
    }

    let courseId = '';
    courseSnapshot.forEach(doc => {
        courseId = doc.id; // Assuming courseId is the document ID
    });

    console.log("getCourseIdFromCourseName end", courseId);
    return courseId;
}

// Helper function to check if user is already enrolled in the course
async function checkIfUserEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
    console.log(`Checking if user with ID ${userId} is enrolled in course with ID ${courseId}`);

    const enrolledUsersQuery = query(
        collection(db, 'enrolled_at'),
        where('user_id', '==', String(userId)),
        where('course_id', '==', String(courseId)),
    );

    const enrolledUsersSnapshot = await getDocs(enrolledUsersQuery);

    if (enrolledUsersSnapshot.empty) {
        console.log(`No user found enrolled in course with ID ${courseId} for user ID ${userId}`);
        return false;
    }

    console.log(`User with ID ${userId} is enrolled in course with ID ${courseId}`);
    return true;
}
