import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Student {
    user_id: string;
    first_name: string;
    last_name: string;
}

interface Event {
    id: string;
    event_name: string;
}

interface Assignment {
    id: string;
    title: string;
}

interface EventGrade {
    event_id: string;
    event_name: string;
    marks: string;
}

interface AssignmentGrade {
    assessment_id: string;
    obtained_marks: number;
    total_marks: number;
}

interface GradesResponse {
    user_id: string;
    course_id: string;
    event_marks: EventGrade[];
    assignment_marks: AssignmentGrade[];
}

interface GradesTableProps {
    courseId: string;
    teacherId: string;
}

const GradesTable: React.FC<GradesTableProps> = ({ courseId, teacherId }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [grades, setGrades] = useState<Record<string, GradesResponse>>({});

    useEffect(() => {
        const fetchStudentsEventsAssignments = async () => {
            try {
                const studentsResponse = await axios.post('/api/get/participants', { courseId });
                const filteredStudents = studentsResponse.data.participants.filter((p: { role: string }) => p.role === 'Student');
                setStudents(filteredStudents);

                const eventsResponse = await axios.get(`/api/get/events?course_id=${courseId}`);
                setEvents(eventsResponse.data.events);

                const assignmentsResponse = await axios.post('/api/get/assignments/all-assignments', { courseId });
                setAssignments(assignmentsResponse.data.assignments);

                await fetchGrades(filteredStudents, courseId);
            } catch (error) {
                console.error('Error fetching students, events, or assignments:', error);
            }
        };

        fetchStudentsEventsAssignments();
    }, [courseId]);

    const fetchGrades = async (students: Student[], courseId: string) => {
        try {
            const gradesData: Record<string, GradesResponse> = {};

            for (const student of students) {
                const eventMarksResponse = await axios.get<GradesResponse>(`/api/get/marks/one-student/course-events?user_id=${student.user_id}&course_id=${courseId}`);
                const assignmentMarksResponse = await axios.get<GradesResponse>(`/api/get/marks/one-student/course-assignments?user_id=${student.user_id}&course_id=${courseId}`);

                gradesData[student.user_id] = {
                    ...eventMarksResponse.data,
                    assignment_marks: assignmentMarksResponse.data.assignment_marks
                };
            }

            setGrades(gradesData);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    return (
        <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm ">
          <div className="p-6 grid gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Participants' Grades
            </h2>
            <div className="overflow-x-auto">
            <table className="min-w-full ">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                        <th className="p-4 text-gray-700 dark:text-gray-300">Student Name</th>
                        {events.map(event => (
                            <th key={event.id} className="p-4 text-gray-700 dark:text-gray-300">{event.event_name}</th>
                        ))}
                        {assignments.map(assignment => (
                            <th key={assignment.id} className="p-4 text-gray-700 dark:text-gray-300">{assignment.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.user_id} className="border-t border-gray-100 dark:border-gray-700">
                            <td className="p-4 text-gray-700 dark:text-gray-300">{`${student.first_name} ${student.last_name}`}</td>
                            {events.map(event => (
                                <td key={event.id} className="p-4 text-gray-700 dark:text-gray-300">
                                    {grades[student.user_id]?.event_marks.find(g => g.event_name === event.event_name)?.marks || '-'}
                                </td>
                            ))}
                            {assignments.map(assignment => (
                                <td key={assignment.id} className="p-4 text-gray-700 dark:text-gray-300">
                                    {grades[student.user_id]?.assignment_marks.find(g => g.assessment_id === assignment.id)?.obtained_marks || '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
          </div>
        </div>
    );
};

export default GradesTable;