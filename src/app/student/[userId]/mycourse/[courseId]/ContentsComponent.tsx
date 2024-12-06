import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Download, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

interface content {
    id: string;
    title: string;
    description: string;
    content_type: string;
    attachments: string[];
}

interface ContentsComponentProps {
    moduleId: string;
    contentId: string;
    content: content;
    courseId: string;
    userId: string;
}

const ContentsComponent = ({ contentId, content, moduleId, courseId, userId }: ContentsComponentProps) => {

    const handleViewContent = () => {
        if (content.attachments && content.attachments[0]) {
            const newTabUrl = content.attachments[0];
            window.open(newTabUrl, '_blank'); // Open in a new tab
        } else {
            console.error("No attachment URL available");
        }
    };

    const fileUrl = content.attachments?.[0] || '';
    const downloadUrl = fileUrl ? `/api/download?url=${encodeURIComponent(fileUrl)}` : '';

    return (
        <div className="flex w-full dark:bg-transparent">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                        <div className="flex items-center gap-4 w-full">
                            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                                <span className="text-xl font-semibold">{"C"}</span>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{content.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{content.description}</p>
                                {content.content_type === "url" && content.attachments[0] && (
                                    <Link
                                        href={content.attachments[0]}
                                        className="text-sm hover:underline text-gray-600 dark:text-gray-300"
                                    >
                                        {content.attachments[0]}
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {content.content_type === "file" && (
                                <div
                                    data-tooltip-id="view-content-tooltip"
                                    data-tooltip-content="View Content"
                                    className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-md shadow hover:shadow-lg transition-shadow"
                                    onClick={handleViewContent}
                                >
                                    <Eye className="text-blue-600" />
                                </div>
                            )}

                            {content.content_type === "file" && downloadUrl && (
                                <div
                                    data-tooltip-id="download-content-tooltip"
                                    data-tooltip-content="Download Content"
                                    className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-md shadow hover:shadow-lg transition-shadow"
                                >
                                    <a href={downloadUrl} download>
                                        <Download className="text-green-500" />
                                    </a>
                                </div>
                            )}


                        </div>
                        <Tooltip id="download-content-tooltip" place="top" />
                        <Tooltip id="view-content-tooltip" place="top" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentsComponent;
