import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}
import './GradesComponent.css'; // Make sure to create and import this CSS file

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
    total_marks: string;
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

interface StudentGradesProps {
    courseId: string;
    studentId: string;
}

const StudentGrades: React.FC<StudentGradesProps> = ({ courseId, studentId }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [grades, setGrades] = useState<GradesResponse | null>(null);

    useEffect(() => {
        const fetchEventsAssignmentsGrades = async () => {
            try {
                const eventsResponse = await axios.get(`/api/get/events?course_id=${courseId}`);
                console.log('Events Response:', eventsResponse.data.events); // Debugging log
                setEvents(eventsResponse.data.events);

                const assignmentsResponse = await axios.post('/api/get/assignments/all-assignments', { courseId });
                setAssignments(assignmentsResponse.data.assignments);

                const eventMarksResponse = await axios.get<GradesResponse>(`/api/get/marks/one-student/course-events?user_id=${studentId}&course_id=${courseId}`);
                // console.log("emarks: ", eventMarksResponse.data.event_marks[0].marks);
                const assignmentMarksResponse = await axios.get<GradesResponse>(`/api/get/marks/course-assignments?user_id=${studentId}&course_id=${courseId}`);

                setGrades({
                    ...eventMarksResponse.data,
                    assignment_marks: assignmentMarksResponse.data.assignment_marks
                });
            } catch (error) {
                console.error('Error fetching events, assignments, or grades:', error);
            }
        };

        fetchEventsAssignmentsGrades();
    }, [courseId, studentId]);

    const calculateTotalMarks = () => {
        if (!grades) return { eventTotal: 0, assignmentTotal: 0, overallTotal: 0, totalAssignmentMarks: 0, totalEventMarks: 0 };

        const eventTotal = grades.event_marks.reduce((sum, grade) => sum + parseFloat(grade.marks), 0);
        const assignmentTotal = grades.assignment_marks.reduce((sum, grade) => sum + grade.obtained_marks, 0);
        const totalAssignmentMarks = grades.assignment_marks.reduce((sum, grade) => sum + grade.total_marks, 0);
        const totalEventMarks = grades.event_marks.reduce((sum, grade) => sum + parseFloat(grade.total_marks), 0);
        const overallTotal = eventTotal + assignmentTotal;

        return { eventTotal, assignmentTotal, totalAssignmentMarks, totalEventMarks, overallTotal };
    };

    const { eventTotal, assignmentTotal, totalAssignmentMarks, totalEventMarks, overallTotal } = calculateTotalMarks();

    const downloadReport = () => {
        const doc = new jsPDF('p', 'pt', 'a4');

        var logoImg = new Image();
        logoImg.crossOrigin = "";
        logoImg.src = process.env.NEXT_PUBLIC_LOGO_URL || '';;
        logoImg.onload = function () {
            doc.addImage(logoImg, 'PNG', 10, 10, 50, 20);
        }

        doc.text('My Grades Report', 14, 40);
        doc.setFontSize(12);

        const tableColumn = [
            'Assignment Title',
            ...assignments.map(assignment => assignment.title),
            'Total Assignment Marks',
            ...events.map(event => event.event_name),
            'Total Event Marks',
            'Overall Total Marks'
        ];

        const tableRows: any[] = [];

        const assignmentMarks = assignments.map(assignment => grades?.assignment_marks.find(g => g.assessment_id === assignment.id)?.obtained_marks || '-');
        const eventMarks = events.map(event => grades?.event_marks.find(g => g.event_id === event.id)?.marks || '-');

        const rowData = [
            'Marks',
            ...assignmentMarks,
            assignmentTotal,
            ...eventMarks,
            eventTotal,
            overallTotal
        ];

        tableRows.push(rowData);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            styles: {
                fillColor: [255, 255, 255], // White background
                textColor: [0, 0, 0], // Black text
                lineColor: [0, 0, 0], // Black borders
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: [255, 255, 255], // White background for header
                textColor: [0, 0, 0], // Black text for header
                lineColor: [0, 0, 0], // Black borders for header
                lineWidth: 0.1,
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255], // White background for alternate rows
            },
        });

        doc.save('Grades_Report.pdf');
    };

    return (
        <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm ">
            <div className="p-6 grid gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    My Grades
                </h2>
                <div className="overflow-x-auto mt-4">
                    <div className="font-bold">Assignment Grades</div>
                    {assignments.length > 0 ? (
                        <table className="min-w-full ">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700 text-center">
                                    <th className="p-4 text-gray-700 dark:text-gray-300">Assignments</th>
                                    <th className="p-4 text-gray-700 dark:text-gray-300">Obtained Marks</th>
                                    <th className="p-4 text-gray-700 dark:text-gray-300">Total Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map(assignment => (
                                    <tr key={assignment.id} className="border-t border-gray-100 dark:border-gray-700 text-center">
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{assignment.title}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300">
                                            {grades?.assignment_marks.find(g => g.assessment_id === assignment.id)?.obtained_marks || '-'}
                                        </td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{grades?.assignment_marks.find(g => g.assessment_id === assignment.id)?.total_marks || '-'}</td>
                                    </tr>
                                ))}
                                <tr className="border-t border-gray-100 dark:border-gray-700 text-center">
                                    <td className="p-4 text-gray-700 dark:text-gray-300">Total Assignment Marks</td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">{assignmentTotal}</td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">{totalAssignmentMarks}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-700 dark:text-gray-300">No assignments found for this course.</p>
                    )}
                </div>
                <div className="overflow-x-auto mt-4">
                    <div className="font-bold">Event Grades</div>
                    {events.length > 0 ? (
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700 text-center">
                                    <th className="p-4 text-gray-700 dark:text-gray-300">Events</th>
                                    <th className="p-4 text-gray-700 dark:text-gray-300">Obtained Marks</th>
                                    <th className="p-4 text-gray-700 dark:text-gray-300">Total Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event.id} className="border-t border-gray-100 dark:border-gray-700 text-center">
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{event.event_name}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300">
                                            {grades?.event_marks.find(g => g.event_id === event.id)?.marks || '-'}
                                        </td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{grades?.event_marks.find(g => g.event_id === event.id)?.total_marks || '-'}</td>
                                    </tr>
                                ))}
                                <tr className="border-t border-gray-100 dark:border-gray-700 text-center">
                                    <td className="p-4 text-gray-700 dark:text-gray-300">Total Event Marks</td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">{eventTotal}</td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">{totalEventMarks}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-700 dark:text-gray-300">No events found for this course.</p>
                    )}
                </div>
                <button
                    onClick={downloadReport}
                    className="max-w-fit mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Download Report
                </button>
            </div>
        </div>
    );
};

export default StudentGrades;