"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

const ShowProfile = () => {
    const router = useRouter();
    const DefaultProfilePic = 'https://firebasestorage.googleapis.com/v0/b/minor-project-01-5a5b7.appspot.com/o/users%2F8021000004%2Fprofile_pic.png?alt=media&token=061a7885-4080-41d2-bb21-d2131be8f098';
    const [profilePicUrl, setProfilePicUrl] = useState<string>('');
    const [userid, setUserid] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile>({
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        role: ""
    });

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');
        if (!storedUserId) {
            setError('User ID not found. Please log in again.');
            setLoading(false);
            return;
        }
        setUserid(storedUserId);
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userid) return;

            try {
                const response = await fetch(`/api/get/one-user?userId=${userid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const userData = await response.json();
                let picUrl = userData.profilePicUrl;
                setUser(userData);

                console.log(userData);
                if (picUrl) {
                    picUrl = picUrl.replace('gs://minor-project-01-5a5b7.appspot.com/', 'https://firebasestorage.googleapis.com/v0/b/minor-project-01-5a5b7.appspot.com/o/');
                  }
                  setProfilePicUrl(picUrl); 
            } catch (err) {
                setError('Failed to load user profile');
                console.error('Error fetching user profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userid) {
            fetchUserProfile();
        }
    }, [userid]);

    const navigateToDashboard = () => {
        router.push('/dashboard');

        if(user.role === 'admin') {
            router.push('/admin/dashboard');
        }
        else if(user.role === 'student') {
            const studentId = user.id;
            router.push(`/student/${studentId}/dashboard`);
        }
        else if(user.role === 'teacher') {
            const teacherId = user.id;
            router.push(`/teacher/${teacherId}/dashboard`);
        }

    };



    return (
        <div className="bg-gray-300 dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="relative h-48 bg-gray-500">
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-4xl text-gray-600 dark:text-gray-300">
                                    <img src={profilePicUrl || DefaultProfilePic} className="h-full w-full rounded-full object-cover" />
                                </div>
                                <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white">

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-20 pb-8 px-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {`${user.first_name} ${user.last_name}`}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                User ID: {user.id}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex-shrink-0 text-gray-500 text-xl font-bold w-8 text-center">
                                    👤
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        Full Name
                                    </h3>
                                    <p className="text-lg text-gray-900 dark:text-gray-100">
                                        {`${user.first_name} ${user.last_name}` || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                           
                            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex-shrink-0 text-gray-500 text-xl font-bold w-8 text-center">
                                ✉️
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        Email
                                    </h3>
                                    <p className="text-lg text-gray-900 dark:text-gray-100">
                                        {user.email || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex-shrink-0 text-gray-500 text-xl font-bold w-8 text-center">
                                🎓
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                      Role
                                    </h3>
                                    <p className="text-lg text-gray-900 dark:text-gray-100">
                                        {user.role}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex-shrink-0 text-gray-500 text-xl font-bold w-8 text-center">
                                #
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        User ID
                                    </h3>
                                    <p className="text-lg text-gray-900 dark:text-gray-100">
                                        {user.id}
                                    </p>
                                </div>
                            </div>
                            
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={navigateToDashboard}
                                className="bg-gray-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-red-600 transition duration-300"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowProfile;