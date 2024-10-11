"use client"
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

interface UserProfile {
    userId: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profilePicUrl: string;
}

const ShowProfile = () => {
    const router = useRouter();
    const firebaseStorageId = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    const DefaultProfilePic = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageId}/o/default-profile-pic.png?alt=media`;
    const [profilePicUrl, setProfilePicUrl] = useState<string>(DefaultProfilePic);
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile|null>(null)
    const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
    const [editProfilePic,setEditProfilePic] = useState<boolean>(false);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`/api/get/one-user?userId=${userId}`);
                if (!response.ok) throw new Error('Failed to fetch user profile');
                const data = await response.json();
                setUser(data.userData);
                setProfilePicUrl(user?.profilePicUrl || DefaultProfilePic);
            } catch (err) {
                console.error('Error fetching user profile:', err);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    },[userId]);

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewProfilePic(e.target.files[0]);
        }
    };

    const uploadProfilePic = async () => {
        if (!newProfilePic || !userId) return;

        const storage = getStorage();
        const storageRef = ref(storage, `users/${userId}/profile_pic.png`);
        try {
            await uploadBytes(storageRef, newProfilePic);
            const downloadUrl = await getDownloadURL(storageRef);

            // Update profile pic URL in Firestore
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { profilePicUrl: downloadUrl });

            setProfilePicUrl(downloadUrl);
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    const navigateToDashboard = () => {
        router.push('/dashboard');

        if (user?.role === 'admin') {
            router.push('/admin/dashboard');
        }
        else if (user?.role === 'student') {
            const studentId = user.userId;
            router.push(`/student/${studentId}/dashboard`);
        }
        else if (user?.role === 'teacher') {
            const teacherId = user.userId;
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
                                    <img src={user?.profilePicUrl || DefaultProfilePic} className="h-full w-full rounded-full object-cover" />
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
                                {`${user?.first_name} ${user?.last_name}`}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                User ID: {user?.userId}
                            </p>
                        </div>

                        <div className="text-center mb-8">
                            <div className="btn bg-green-500 hover:bg-green-600" onClick={() => setEditProfilePic(prev => !prev)}>
                                {editProfilePic ? 'Cancel' : 'Edit Profile Picture'}
                            </div>

                            {editProfilePic && (
                                <div>
                                    <input type="file" accept=".jpg, .jpeg, .png" onChange={handleProfilePicChange} />
                                    <button onClick={uploadProfilePic}>Upload New Profile Picture</button>
                                </div>
                            )}
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
                                        {`${user?.first_name} ${user?.last_name}` || 'Not provided'}
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
                                        {user?.email || 'Not Available'}
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
                                    <p className="text-lg text-gray-900 dark:text-gray-100 capitalize">
                                        {user?.role}
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
                                        {user?.userId}
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