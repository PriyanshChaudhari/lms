"use client"
import { useState, useEffect } from 'react';
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

const Profile = () => {
    const router = useRouter();
    const firebaseStorageId = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const DefaultProfilePic = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageId}/o/default-profile-pic.png?alt=media`;
    const [profilePicUrl, setProfilePicUrl] = useState<string>(DefaultProfilePic);
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showFileInput, setShowFileInput] = useState(true);

    // Existing useEffect and handler functions remain the same
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
    }, [userId]);

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    const openPopup = () => setShowPopup(true);
    const closePopup = () => {
        setShowPopup(false);
        setNewProfilePic(null);
        setPreviewUrl(null);
        setShowFileInput(true);
    };

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewProfilePic(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
                setShowFileInput(false);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const uploadProfilePic = async () => {
        if (!newProfilePic || !userId) return;
        const storage = getStorage();
        const storageRef = ref(storage, `users/${userId}/profile_pic.png`);
        try {
            await uploadBytes(storageRef, newProfilePic);
            const downloadUrl = await getDownloadURL(storageRef);
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { profilePicUrl: downloadUrl });
            setProfilePicUrl(downloadUrl);
            closePopup();
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    const navigateToDashboard = () => {
        if (user?.role === 'Admin') {
            router.push(`/admin/${user.userId}/dashboard`);
        } else if (user?.role === 'Student') {
            router.push(`/student/${user.userId}/dashboard`);
        } else if (user?.role === 'Teacher') {
            router.push(`/teacher/${user.userId}/dashboard`);
        } else {
            router.replace('/dashboard');
        }
    };

    const handleChangeImage = () => {
        setPreviewUrl(null);
        setShowFileInput(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Profile Header with Banner */}
                    <div className="relative h-60 bg-gradient-to-r from-blue-500 to-purple-600">
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
                        </div>
                        
                        {/* Profile Picture Container */}
                        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
                            <div 
                                className="relative"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="w-40 h-40 rounded-full ring-4 ring-white dark:ring-gray-700 shadow-lg overflow-hidden bg-white dark:bg-gray-700">
                                    <img 
                                        src={user?.profilePicUrl || DefaultProfilePic} 
                                        className="h-full w-full object-cover"
                                        alt="Profile"
                                    />
                                </div>
                                {isHovering && (
                                    <div
                                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
                                        onClick={openPopup}
                                    >
                                        <span className="text-white font-medium">Change Photo</span>
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full ring-4 ring-white dark:ring-gray-700"></div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-24 pb-8 px-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {`${user?.first_name} ${user?.last_name}`}
                            </h1>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                {user?.role}
                            </p>
                        </div>

                        {/* Profile Information Cards */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-4">
                                    <span className="text-2xl">👤</span>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                                            {`${user?.first_name} ${user?.last_name}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-4">
                                    <span className="text-2xl">✉️</span>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-4">
                                    <span className="text-2xl">🎓</span>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</h3>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                                            {user?.role}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-4">
                                    <span className="text-2xl">#</span>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</h3>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                                            {user?.userId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Back to Dashboard Button */}
                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={navigateToDashboard}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Picture Upload Modal */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Update Profile Picture
                        </h2>
                        
                        <div className="space-y-4">
                            {showFileInput ? (
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded p-6">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleProfilePicChange}
                                        className="block w-full text-sm text-gray-500 dark:text-gray-400
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded file:border-0
                                        file:text-sm file:font-medium
                                        file:bg-blue-50 file:text-blue-700
                                        dark:file:bg-blue-900/50 dark:file:text-blue-300
                                        hover:file:bg-blue-100 dark:hover:file:bg-blue-900"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-100 dark:ring-gray-700">
                                        <img
                                            src={previewUrl || ''}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleChangeImage}
                                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                    >
                                        Choose Different Image
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex space-x-3">
                            <button
                                onClick={uploadProfilePic}
                                disabled={!newProfilePic}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                            >
                                Upload
                            </button>
                            <button
                                onClick={closePopup}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;