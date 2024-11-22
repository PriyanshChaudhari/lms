import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './GradesComponent.css'; // Make sure to create and import this CSS file
import StudentGrades from '@/app/student/[userId]/mycourse/[courseId]/GradesComponent';

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
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudentsEventsAssignments = async () => {
            try {
                const studentsResponse = await axios.post('/api/get/participants', { courseId });
                const filteredStudents = studentsResponse.data.participants.filter((p: { role: string }) => p.role === 'Student');
                setStudents(filteredStudents);

                const eventsResponse = await axios.get(`/api/get/events?course_id=${courseId}`);
                console.log('Events Response:', eventsResponse.data.events); // Debugging log
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
                console.log(`Event Marks for ${student.user_id}:`, eventMarksResponse.data.event_marks); // Debugging log
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

    const calculateTotalMarks = (studentId: string) => {
        const studentGrades = grades[studentId];
        if (!studentGrades) return { eventTotal: 0, assignmentTotal: 0, overallTotal: 0, totalAssignmentMarks: 0, totalEventMarks: 0 };

        const eventTotal = studentGrades.event_marks.reduce((sum, grade) => sum + parseFloat(grade.marks), 0);
        const assignmentTotal = studentGrades.assignment_marks.reduce((sum, grade) => sum + grade.obtained_marks, 0);
        const totalAssignmentMarks = studentGrades.assignment_marks.reduce((sum, grade) => sum + grade.total_marks, 0);
        const totalEventMarks = studentGrades.event_marks.reduce((sum, grade) => sum + parseFloat(grade.total_marks), 0);
        const overallTotal = eventTotal + assignmentTotal;

        return { eventTotal, assignmentTotal, overallTotal, totalAssignmentMarks, totalEventMarks };
    };

    const downloadReport = () => {
        const data = students.map(student => {
            const { eventTotal, assignmentTotal, overallTotal } = calculateTotalMarks(student.user_id);
            const studentGrades = grades[student.user_id];

            const eventMarks = events.map(event => studentGrades?.event_marks.find(g => g.event_name === event.event_name)?.marks || '-');
            const assignmentMarks = assignments.map(assignment => studentGrades?.assignment_marks.find(g => g.assessment_id === assignment.id)?.obtained_marks || '-');

            return {
                'Student ID': student.user_id,
                'Student Name': `${student.first_name} ${student.last_name}`,
                ...Object.fromEntries(assignments.map((assignment, index) => [assignment.title, assignmentMarks[index]])),
                'Total Assignment Marks': assignmentTotal,
                ...Object.fromEntries(events.map((event, index) => [event.event_name, eventMarks[index]])),
                'Total Event Marks': eventTotal,
                'Overall Total Marks': overallTotal
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(data);

        // Define the order of the columns
        const columnOrder = [
            'Student ID',
            'Student Name',
            ...assignments.map(assignment => assignment.title),
            'Total Assignment Marks',
            ...events.map(event => event.event_name),
            'Total Event Marks',
            'Overall Total Marks'
        ];

        // Reorder the columns in the worksheet
        worksheet['!cols'] = columnOrder.map(col => ({ wch: col.length }));
        const orderedData = data.map(row => {
            const orderedRow: any = {};
            columnOrder.forEach(col => {
                orderedRow[col] = row[col];
            });
            return orderedRow;
        });

        const orderedWorksheet = XLSX.utils.json_to_sheet(orderedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, orderedWorksheet, 'Grades Report');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(dataBlob, 'Grades_Report.xlsx');
    };

    return (
        <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm ">
            <div className="p-6 grid gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Participants' Grades
                </h2>
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full ">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700 text-center">
                                <th className="p-4 text-gray-700 dark:text-gray-300">Student Name</th>
                                <th className="p-4 text-gray-700 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.user_id} className="border-t border-gray-100 dark:border-gray-700 text-center">
                                    <td className="p-4 text-gray-700 dark:text-gray-300">
                                        {`${student.first_name} ${student.last_name}`}
                                    </td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">
                                        <button
                                            onClick={() => setSelectedStudent(student.user_id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            View Grades Report
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={downloadReport}
                    className="w-1/5 mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Download Report
                </button>
                {selectedStudent && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Grades Report for {students.find(student => student.user_id === selectedStudent)?.first_name} {students.find(student => student.user_id === selectedStudent)?.last_name}
                        </h3>
                        <div className="overflow-x-auto mt-4">
                            <StudentGrades courseId={courseId} studentId={selectedStudent}/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GradesTable;