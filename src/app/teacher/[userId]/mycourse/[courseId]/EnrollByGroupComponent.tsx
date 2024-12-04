import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { ChangeEvent, useEffect, useState } from 'react'

interface Group {
    id: string;
    group_name: string;
}

const EnrollByGroupComponent = () => {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const [groups, setGroups] = useState<Group[]>([]);
    const [enrollment, setEnrollment] = useState({
        group_id: "",
        course_id: courseId,
    });
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [errors, setErrors] = useState({
        group_id: "",
        course_id: courseId,
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ confirmText: string }>({
        confirmText: ''
    });

    const [showdeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

    const getGroups = async () => {
        try {
            const res = await axios.get('/api/groups');
            setGroups(res.data.groups);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    useEffect(() => {
        getGroups();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEnrollment({ ...enrollment, [name]: value });
    };

    const validateForm = () => {
        let valid = true;

        if (enrollment.group_id === "") {
            setErrors(prev => ({ ...prev, group_id: "Group is required" }));
            valid = false;
        } else {
            setErrors(prev => ({ ...prev, group_id: "" }));
        }

        return valid;
    };

    const handleSubmit = async (e: React.FormEvent, action: 'enroll' | 'unenroll') => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setGeneralError(null);

            if (action === 'enroll') {
                const res = await axios.post('/api/enrollment/enroll-group', enrollment);
                window.location.href = `/teacher/${userId}/mycourse/${courseId}?section=participants`;
            } else if (action === 'unenroll') {

                if (deleteConfirmation.confirmText.toLowerCase() !== 'confirm') {
                    alert('Deletion cancelled. Please type "confirm" to delete.');
                    return;
                }
                try {
                    const res = await axios.delete('/api/enrollment/enroll-group', {
                        data: enrollment // `axios.delete` requires `data` field
                    });
                    setShowDeleteConfirmation(false);
                    window.location.href = `/teacher/${userId}/mycourse/${courseId}?section=participants`;
                }
                catch (error) {
                    console.error('An error occurred while deleting the assignment.');
                }


                const res = await axios.delete('/api/enrollment/enroll-group', {
                    data: enrollment // `axios.delete` requires `data` field
                });
                console.log('Unenrollment successful:', res.data);
            }

            setEnrollment({
                group_id: "",
                course_id: courseId,
            });
        } catch (error: any) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setGeneralError(error.response.data.error);
            } else {
                setGeneralError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <>

            {generalError && (
                <div className="mb-4 text-red-600 font-bold text-center">
                    {generalError}
                </div>
            )}
            <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
                {showdeleteConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Confirm Assignment Deletion
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Are you sure you want to delete this assignment?
                                Type "confirm" below to proceed.
                            </p>
                            <input
                                type="text"
                                value={deleteConfirmation.confirmText}
                                onChange={(e) => setDeleteConfirmation({
                                    confirmText: e.target.value
                                })}
                                className="w-full px-3 py-2 border rounded-lg mb-4 dark:bg-[#151b23]"
                                placeholder="Type 'confirm' here"
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowDeleteConfirmation(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button

                                    onClick={(e) => handleSubmit(e, 'unenroll')}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <form>
                    <div className="mb-4">
                        <label htmlFor="group_id" className="block text-sm font-medium text-gray-700">
                            Group Name
                        </label>
                        <select
                            id="group_id"
                            name="group_id"
                            value={enrollment.group_id}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg dark:bg-darkBg"
                            required
                        >
                            <option value="">Select Group</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>
                                    {group.group_name}
                                </option>
                            ))}
                        </select>
                        {errors.group_id && <p className="text-red-600 text-sm">{errors.group_id}</p>}
                    </div>

                    <div className="grid grid-cols-2 grid-rows-1 max-w-lg mx-auto gap-4">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, 'enroll')}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                            Enroll Group
                        </button>
                        <button
                            type="button"
                            onClick={() =>  setShowDeleteConfirmation(true)}
                            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                        >
                            Unenroll Group
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EnrollByGroupComponent;
