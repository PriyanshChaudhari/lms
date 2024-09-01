"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const ViewParticipants: React.FC = () => {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('participants');


    const [participantdata, setParticipantData] = useState([
        { name: 'Yatharth Patel', role: 'student', access: 'recent' },
        { name: 'Dhruv Dhanani', role: 'student', access: 'recent' },
        { name: 'Krish Kheni', role: 'student', access: 'recent' },
        { name: 'Priyansh Chaudhari', role: 'student', access: 'recent' },
    ]);

    const [selectedLetter, setSelectedLetter] = useState<string>('All');

    const filteredParticipants = selectedLetter === 'All'
        ? participantdata
        : participantdata.filter(
            (item) =>
                item.name.startsWith(selectedLetter)
            //   item.lastname?.startsWith(selectedLetter) 
        );

    return (
        
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">Course 1</h1>
                <p className="text-lg text-gray-700 mb-6">Description of course 1</p>

                {activeSection === 'participants' && (
                        <div className="space-y-4">
                            <div className="border border-gray-300 dark:text-white rounded-xl p-6 shadow-md cursor-pointer">
                                <h2 className="text-xl font-semibold mb-6">Course Participants</h2>
                                <div className="shadow-md items-center p-5 border border-gray-100 rounded-xl">
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full border border-gray-300">
                                            <tbody>
                                                <tr className="mt-4">
                                                    <td className="p-1.5 border border-gray-300 text-sm">Filter by Name</td>
                                                    {['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => (
                                                        <td
                                                            key={letter}
                                                            className={`p-1.5 border border-gray-300 cursor-pointer text-sm ${selectedLetter === letter ? 'bg-gray-300 dark:bg-gray-400' : ''
                                                                }`}
                                                            onClick={() => setSelectedLetter(letter)}
                                                        >
                                                            {letter}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-300">
                                            <thead>
                                                <tr>
                                                    <th className="py-2 px-4 border-b">Student Name</th>
                                                    <th className="py-2 px-4 border-b">Roles</th>
                                                    <th className="py-2 px-4 border-b">Last access to course</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredParticipants.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="py-2 px-4 border-b text-center">{item.name}</td>
                                                        <td className="py-2 px-4 border-b text-center">{item.role}</td>
                                                        <td className="py-2 px-4 border-b text-center">{item.access}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

            </div>
        </div>
    );
};

export default ViewParticipants;

