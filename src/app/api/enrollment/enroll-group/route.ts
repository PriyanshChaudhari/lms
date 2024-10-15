import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where, writeBatch, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { group_id, course_id } = await req.json();

        if (!group_id || !course_id) {
            return NextResponse.json({ message: 'Missing required fields', status: 400 })
        }

        // Retrieve all members from the group
        const groupMembers = await getGroupMembersFromId(group_id);

        if (!groupMembers || groupMembers.length === 0) {
            return NextResponse.json({ error: "No users found in the group." }, { status: 404 });
        }

        // Firestore batch to enroll users
        const batch = writeBatch(db);

        for (const member of groupMembers) {
            const userId = member.user_id; // Assuming `user_id` is the field in group members

            // Check if the user is already enrolled in the course
            const userAlreadyEnrolled = await checkIfUserEnrolledInCourse(userId, course_id);
            if (userAlreadyEnrolled) {
                console.log(`User ${userId} is already enrolled in course ${course_id}`);
                continue; // Skip to the next user
            }

            // Enroll user in the course
            const newEnrollmentRef = doc(collection(db, 'enrolled_at')); // Auto-generate ID
            batch.set(newEnrollmentRef, {
                course_id: course_id,
                user_id: userId,
                enrolled_at: Timestamp.now(),
            });
        }

        // Commit the batch
        await batch.commit();

        return NextResponse.json({ message: "Users enrolled successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error enrolling users:", error);
        return NextResponse.json({ error: "Failed to enroll users." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { group_id, course_id } = await req.json();

        // Check if group_id and course_id are provided
        if (!group_id || !course_id) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Retrieve all members from the group
        const groupMembers = await getGroupMembersFromId(group_id);

        if (!groupMembers || groupMembers.length === 0) {
            return NextResponse.json({ error: "No users found in the group." }, { status: 404 });
        }

        // Firestore batch to unenroll users
        const batch = writeBatch(db);

        for (const member of groupMembers) {
            const userId = member.user_id; // Assuming `user_id` is the field in group members

            // Check if the user is already enrolled in the course
            const enrollmentRef = await getEnrollmentRef(userId, course_id);
            if (enrollmentRef) {
                batch.delete(enrollmentRef); // Unenroll the user by deleting the enrollment document
            } else {
                console.log(`User ${userId} is not enrolled in course ${course_id}`);
            }
        }

        // Commit the batch
        await batch.commit();

        return NextResponse.json({ message: "Users unenrolled successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error unenrolling users:", error);
        return NextResponse.json({ error: "Failed to unenroll users." }, { status: 500 });
    }
}

// Helper function to check if a user is already enrolled in a course
async function checkIfUserEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
    const q = query(
        collection(db, 'enrolled_at'),
        where('user_id', '==', userId),
        where('course_id', '==', courseId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

// Helper function to get all group members
async function getGroupMembersFromId(groupId: string): Promise<any[]> {
    const groupRef = collection(db, 'group_members');
    const q = query(groupRef, where('group_id', '==', groupId));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log(`No members found for group ${groupId}`);
        return [];
    }

    const groupMembers: any[] = [];
    querySnapshot.forEach((doc) => {
        groupMembers.push(doc.data()); // Push each member's data
    });

    return groupMembers;
}

async function getEnrollmentRef(userId: string, courseId: string) {
    const q = query(
        collection(db, 'enrolled_at'),
        where('user_id', '==', userId),
        where('course_id', '==', courseId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].ref; // Return the reference to the first enrollment document
    }

    return null;
}
