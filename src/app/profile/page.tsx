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
    const [user, setUser] = useState<UserProfile | null>(null)
    const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
    // const [editProfilePic, setEditProfilePic] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showFileInput, setShowFileInput] = useState(true);

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

            // Update profile pic URL in Firestore
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
            router.push('/admin/dashboard');
        }
        else if (user?.role === 'Student') {
            const studentId = user.userId;
            router.push(`/student/${studentId}/dashboard`);
        }
        else if (user?.role === 'Teacher') {
            const teacherId = user.userId;
            router.push(`/teacher/${teacherId}/dashboard`);
        }
        else {
            router.replace('/dashboard');
        }

    };

    const handleChangeImage = () => {
        setPreviewUrl(null);
        setShowFileInput(true);
    };

    return (
        <div className="bg-gray-300 dark:bg-[#212830] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-[#151b23] shadow-xl rounded-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="relative h-48 bg-gray-500 dark:bg-[#444c56]">
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                            <div className="relative"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-4xl text-gray-600 dark:text-gray-300">
                                    <img src={user?.profilePicUrl || DefaultProfilePic} className="h-full w-full rounded-full object-cover" />
                                </div>
                                {isHovering && (
                                    <div
                                        className="absolute inset-0 bg-white dark:bg-[#212830] bg-opacity-20 dark:bg-opacity-70 rounded-full flex items-center justify-center cursor-pointer"
                                        onClick={openPopup}
                                    >
                                        <span className="text-white">Edit</span>
                                    </div>
                                )}
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

                        {/* <div className="text-center mb-8">
                            <div className="btn bg-green-500 hover:bg-green-600" onClick={() => setEditProfilePic(prev => !prev)}>
                                {editProfilePic ? 'Cancel' : 'Edit Profile Picture'}
                            </div>

                            {editProfilePic && (
                                <div>
                                    <input type="file" accept=".jpg, .jpeg, .png" onChange={handleProfilePicChange} />
                                    <button onClick={uploadProfilePic}>Upload New Profile Picture</button>
                                </div>
                            )}
                        </div> */}

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
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

                            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
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

                            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
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

                            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                                <div className="flex-shrink-0 text-gray-500 dark:text-gray-900 text-xl font-bold w-8 text-center">
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
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#212830] bg-opacity-50 dark:bg-opacity-50">
                    <div className="relative bg-white  dark:bg-[#151b23] p-6 rounded shadow-md ">
                        <h2 className="text-xl font-bold mb-4 ">Edit Profile Picture</h2>
                        <div className="mb-4 ">

                        {showFileInput ? (
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleProfilePicChange}
                                    className="mb-2"
                                />
                            ) : (
                                <div className="mt-2 flex flex-col items-center">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">Preview:</p>
                                        <div className="w-24 h-24 rounded-full border-4 dark:border-white border-gray-400 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-4xl text-gray-600 dark:text-gray-300">
                                            <img
                                                src={previewUrl || ''}
                                                alt="Preview"
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleChangeImage}
                                        className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                                    >
                                        Change Image
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center space-x-2">
                            <button
                                onClick={uploadProfilePic}
                                className="bg-blue-500 text-white px-4 py-2 w-1/2 rounded text-sm hover:bg-blue-600"
                                disabled={!newProfilePic}
                            >
                                Upload
                            </button>
                            <button
                                onClick={closePopup}
                                className="bg-gray-300 text-gray-800 px-4 py-2 w-1/2 text-sm rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShowProfile;