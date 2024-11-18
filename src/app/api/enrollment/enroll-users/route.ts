import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { Timestamp, doc, getDoc, writeBatch, query, where, collection, getDocs, deleteDoc } from 'firebase/firestore';

// Define the type for user data
interface Enrollment {
    userId: string | number;
    course_name: string;
}

// POST endpoint to handle adding users to a course
export async function POST(req: NextRequest) {
    try {
        const { users, idOfCourse } = await req.json(); // Destructure users and idOfCourse from request
        console.log(users, idOfCourse);

        console.log("Enrollment process starting");
        const enrollmentRecords = await batchEnrollment(users, String(idOfCourse));
        console.log("Enrollment process complete");

        return NextResponse.json({ message: 'Users enrolled successfully', enrollment: enrollmentRecords }, { status: 201 });
    } catch (error) {
        console.error("Error in enrollment:", error);
        return NextResponse.json({ error: 'Failed to enroll users.' }, { status: 500 });
    }
}

// DELETE endpoint to handle removing enrolled users
export async function DELETE(request: NextRequest) {
    try {
        const { users, idOfCourse } = await request.json();

        await batchEnrollmentDeletion(users, String(idOfCourse)); // Assuming this function handles batch deletion

        return new Response(JSON.stringify({ message: 'Enrolled users removed successfully' }), { status: 201 });
    } catch (error: any) {
        console.error('Error deleting enrolled users in batch:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// Function to batch enroll users
async function batchEnrollment(users: Enrollment[], idOfCourse: string) {
    const batch = writeBatch(db);

    try {
        for (const user of users) {
            const { userId, course_name } = user;

            // Validate user input
            if (!userId || !course_name) {
                throw new Error('userId and course_name are required');
            }

            const userExists = await checkIfUserExists(String(userId));
            console.log(`User existence check for ${userId}: ${userExists}`);
            if (!userExists) {
                console.log(`User with userId ${userId} does not exist`);
                continue; // Skip to the next user
            }

            console.log("Fetching course ID from course name");
            const courseId = await getCourseIdFromCourseName(course_name);
            if (!courseId) {
                console.log(`Course with name ${course_name} does not exist`);
                continue; // Skip to the next user
            }

            if (courseId !== idOfCourse) {
                console.log(`Course ID mismatch. ${course_name} is not created by this user`);
                continue; // Skip if course doesn't match idOfCourse
            }

            // Check if user is already enrolled in the course
            const userAlreadyEnrolled = await checkIfUserEnrolledInCourse(String(userId), courseId);
            if (userAlreadyEnrolled) {
                console.log(`User ${userId} is already enrolled in course ${course_name}`);
                continue; // Skip to the next user
            }

            // Enroll user in the course
            const newEnrollmentRef = doc(collection(db, 'enrolled_at')); // Auto-generate ID
            batch.set(newEnrollmentRef, {
                course_id: courseId,
                user_id: String(userId),
                enrolled_at: Timestamp.now(),
            });
        }

        // Commit the batch
        await batch.commit();
        console.log("Batch enrollment completed successfully");

        return users.map(user => ({
            userId: user.userId,
            courseName: user.course_name,
        }));
    } catch (error) {
        console.error('Error during batch enrollment:', error);
        throw new Error('Error during batch enrollment');
    }
}

// Function to batch process enrolled users deletion
async function batchEnrollmentDeletion(users: Enrollment[], idOfCourse: string) {
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

// Helper function to check if user exists
async function checkIfUserExists(userId: string): Promise<boolean> {
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    return userSnapshot.exists();
}

// Helper function to get course ID from course name
async function getCourseIdFromCourseName(course_name: string): Promise<string | null> {
    const courseQuery = query(collection(db, 'courses'), where('title', '==', course_name.toUpperCase()));
    const courseSnapshot = await getDocs(courseQuery);

    if (courseSnapshot.empty) {
        return null;
    }

    let courseId = '';
    courseSnapshot.forEach(doc => {
        courseId = doc.id; // Assume the course ID is the document ID
    });

    return courseId;
}

// Helper function to check if user is already enrolled in the course
async function checkIfUserEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
    const enrollmentQuery = query(
        collection(db, 'enrolled_at'),
        where('user_id', '==', userId),
        where('course_id', '==', courseId)
    );
    const enrollmentSnapshot = await getDocs(enrollmentQuery);

    return !enrollmentSnapshot.empty;
}

// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/firebaseConfig';
// import { Timestamp, doc, getDoc, writeBatch, query, where, collection, getDocs } from 'firebase/firestore';

// // Define the type for user data
// interface Enrollment {
//     userId: string | number;
//     course_name: string;
// }

// // POST endpoint to handle adding users to a course
// export async function POST(req: NextRequest) {
//     try {
//         const { users, idOfCourse } = await req.json(); // Destructure users and idOfCourse from request
//         console.log(users, idOfCourse);

//         console.log("Enrollment process starting");
//         const enrollmentRecords = await batchEnrollment(users, String(idOfCourse));
//         console.log("Enrollment process complete");

//         return NextResponse.json({ message: 'Users enrolled successfully', enrollment: enrollmentRecords }, { status: 201 });
//     } catch (error) {
//         console.error("Error in enrollment:", error);
//         return NextResponse.json({ error: 'Failed to enroll users.' }, { status: 500 });
//     }
// }

// // Function to batch enroll users
// async function batchEnrollment(users: Enrollment[], idOfCourse: string) {
//     const batch = writeBatch(db);

//     try {
//         for (const user of users) {
//             const { userId, course_name } = user;

//             // Validate user input
//             if (!userId || !course_name) {
//                 throw new Error('userId and course_name are required');
//             }

//             const userExists = await checkIfUserExists(String(userId));
//             console.log(`User existence check for ${userId}: ${userExists}`);
//             if (!userExists) {
//                 console.log(`User with userId ${userId} does not exist`);
//                 continue; // Skip to the next user
//             }

//             console.log("Fetching course ID from course name");
//             const courseId = await getCourseIdFromCourseName(course_name);
//             if (!courseId) {
//                 console.log(`Course with name ${course_name} does not exist`);
//                 continue; // Skip to the next user
//             }

//             if (courseId !== idOfCourse) {
//                 console.log(`Course ID mismatch. ${course_name} is not created by this user`);
//                 continue; // Skip if course doesn't match idOfCourse
//             }

//             // Check if user is already enrolled in the course
//             const userAlreadyEnrolled = await checkIfUserEnrolledInCourse(String(userId), courseId);
//             if (userAlreadyEnrolled) {
//                 console.log(`User ${userId} is already enrolled in course ${course_name}`);
//                 continue; // Skip to the next user
//             }

//             // Enroll user in the course
//             const newEnrollmentRef = doc(collection(db, 'enrolled_at')); // Auto-generate ID
//             batch.set(newEnrollmentRef, {
//                 course_id: courseId,
//                 user_id: String(userId),
//                 enrolled_at: Timestamp.now(),
//             });
//         }

//         // Commit the batch
//         await batch.commit();
//         console.log("Batch enrollment completed successfully");

//         return users.map(user => ({
//             userId: user.userId,
//             courseName: user.course_name,
//         }));
//     } catch (error) {
//         console.error('Error during batch enrollment:', error);
//         throw new Error('Error during batch enrollment');
//     }
// }

// // Helper function to check if user exists
// async function checkIfUserExists(userId: string): Promise<boolean> {
//     const userDoc = doc(db, 'users', userId);
//     const userSnapshot = await getDoc(userDoc);
//     return userSnapshot.exists();
// }

// // Helper function to get course ID from course name
// async function getCourseIdFromCourseName(course_name: string): Promise<string | null> {
//     const courseQuery = query(collection(db, 'courses'), where('title', '==', course_name.toUpperCase()));
//     const courseSnapshot = await getDocs(courseQuery);

//     if (courseSnapshot.empty) {
//         return null;
//     }

//     let courseId = '';
//     courseSnapshot.forEach(doc => {
//         courseId = doc.id; // Assume the course ID is the document ID
//     });

//     return courseId;
// }

// // Helper function to check if user is already enrolled in the course
// async function checkIfUserEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
//     const enrollmentQuery = query(
//         collection(db, 'enrolled_at'),
//         where('user_id', '==', userId),
//         where('course_id', '==', courseId)
//     );
//     const enrollmentSnapshot = await getDocs(enrollmentQuery);

//     return !enrollmentSnapshot.empty;
// }
