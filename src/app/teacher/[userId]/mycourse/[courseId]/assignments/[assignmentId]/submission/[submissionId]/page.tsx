"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ViewSubmission() {
    const params = useParams();
    const [submissionData, setSubmissionData] = useState({
        studentName: '',
        submissionDate: '',
        fileUrls: [] as string[] // Changed to an array of strings
    });

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const submissionDataFromQuery = query.get('submissionData');
        
        if (submissionDataFromQuery) {
            const parsedData = JSON.parse(submissionDataFromQuery);
            setSubmissionData(parsedData);
        }
    }, []);

    return (
        <div className="border border-gray-300 m-5 flex justify-center items-center h-screen">
            <div className="max-w-4xl mx-auto p-5 w-full">
                <h1 className="text-3xl font-bold mb-4">Submission Details</h1>
                <div>
                    <p><strong>Student Name:</strong> {submissionData.studentName || 'N/A'}</p>
                    <p><strong>Submission Date:</strong> {submissionData.submissionDate || 'N/A'}</p>
                    
                    {submissionData.fileUrls.length > 0 ? (
                        submissionData.fileUrls.map((fileUrl, index) => (
                            <iframe
                                key={index}
                                src={fileUrl}
                                className="w-full h-96 mb-4"
                                frameBorder="0"
                                title={`Submission File ${index + 1}`}
                            ></iframe>
                        ))
                    ) : (
                        <p>No files available for this submission.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
