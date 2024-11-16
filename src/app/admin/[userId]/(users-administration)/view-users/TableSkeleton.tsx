import React from "react";
import styles from "./Skeleton.module.css";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    isEditMode?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 6, isEditMode }) => {
    return (
        <div>
            <div className="mb-4 flex gap-4 justify-end">
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                    {isEditMode ? 'Edit Mode Enabled' : 'Edit Mode Disabled'}
                </span>
                <button
                    className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors ${isEditMode ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                    <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isEditMode ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </button>
            </div>
            <input
                type="text"
                placeholder="Search participants..."
                className="w-full mb-6 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23]"
            />
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">User ID</th>
                        <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">First Name</th>
                        <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Last Name</th>
                        <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Email</th>
                        <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Role</th>
                        <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Profile Picture</th>
                        {isEditMode && (
                            <>
                                <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Edit User</th>
                                <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Delete User</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="border px-4 py-2 text-center"
                                >
                                    <div className={`${styles.skeleton}`} style={{ width: "80%", height: "20px", margin: "auto" }}></div>
                                </td>
                            ))}
                            {isEditMode && (
                                <>
                                    <td className="border px-4 py-2">
                                        <div className={`${styles.skeleton}`} style={{ width: "60px", height: "20px", margin: "auto" }}></div>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <div className={`${styles.skeleton}`} style={{ width: "60px", height: "20px", margin: "auto" }}></div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableSkeleton;
