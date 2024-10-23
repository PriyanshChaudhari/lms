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
                console.log('Enrollment successful:', res.data);
            } else if (action === 'unenroll') {
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
            <div>EnrollByGroupComponent</div>
            {generalError && (
                <div className="mb-4 text-red-600 font-bold text-center">
                    {generalError}
                </div>
            )}
            <div>
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
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                            required
                        >
                            <option value="">Select Group</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>
                                    {group.id} {group.group_name}
                                </option>
                            ))}
                        </select>
                        {errors.group_id && <p className="text-red-600 text-sm">{errors.group_id}</p>}
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, 'enroll')}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                            Enroll Group
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, 'unenroll')}
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
