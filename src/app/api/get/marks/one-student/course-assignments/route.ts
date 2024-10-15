import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define the type for user data
interface marksData {
    userId: string;
    marks: string;
    event_name: string;
    course_id: string;
}

// Function to handle GET request to fetch assignment marks for a specific course
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');
        const courseId = searchParams.get('course_id');

        if (!userId || !courseId) {
            return NextResponse.json({ error: 'UserId and CourseId are required' }, { status: 400 });
        }

        const assignmentMarks = await fetchAssignmentMarksByCourse(userId, courseId);

        return NextResponse.json({ user_id: userId, course_id: courseId, assignment_marks: assignmentMarks }, { status: 200 });
    } catch (error) {
        console.error('Error fetching marks:', error);
        return NextResponse.json({ error: 'Failed to fetch marks' }, { status: 500 });
    }
}

// Helper function to fetch assignment marks by course
async function fetchAssignmentMarksByCourse(userId: string, courseId: string) {
    // Step 1: Fetch module_id for the given course_id
    const courseModulesCollection = collection(db, 'course-module');
    const courseModulesQuery = query(courseModulesCollection, where('course_id', '==', String(courseId)));
    const courseModulesSnapshot = await getDocs(courseModulesQuery);

    const moduleIds = courseModulesSnapshot.docs.map(doc => doc.id);
    console.log("moduleIds: ", moduleIds);

    // Step 2: Fetch assessment_id for the given module_id
    const assessmentsCollection = collection(db, 'assessments');
    const assessmentsQuery = query(assessmentsCollection, where('module_id', 'in', moduleIds));
    const assessmentsSnapshot = await getDocs(assessmentsQuery);

    const assessmentIds = assessmentsSnapshot.docs.map(doc => doc.id);
    console.log("asassessmentIds: ",assessmentIds);

    // Step 3: Fetch marks for the given assessment_id
    const submissionsCollection = collection(db, 'submissions');
    const submissionsQuery = query(submissionsCollection, where('user_id', '==', userId), where('assignment_id', 'in', assessmentIds));
    const submissionsSnapshot = await getDocs(submissionsQuery);

    const obtainedMarksData = submissionsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            assignment_id: data.assignment_id,
            obtained_marks: data.marks_obtained
        };
    });

    const totalMarksData = await fetchTotalMarks();

    // Combine obtained marks with total marks
    return obtainedMarksData.map(obtained => {
        console.log(obtained.assignment_id);
        console.log(totalMarksData[0].assignment_id);
        const totalMarks = totalMarksData.find(total => total.assignment_id === obtained.assignment_id);
        return {
            assessment_id: obtained.assignment_id,
            obtained_marks: obtained.obtained_marks,
            total_marks: totalMarks ? totalMarks.total_marks : 'N/A'
        };
    });
}

// Helper function to fetch total marks for all assignments
async function fetchTotalMarks() {
    const assignmentsCollection = collection(db, 'assessments');
    const assignmentsSnapshot = await getDocs(assignmentsCollection);

    const out = assignmentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            assignment_id: doc.id,
            total_marks: data.total_marks
        };
    });
    return out;
}