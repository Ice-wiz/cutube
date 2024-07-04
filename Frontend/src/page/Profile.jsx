
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Footer from '../component/Footer';
import Modal from '../component/Modal';
import VideoCard from '../component/Video';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


// Memoize VideoCard for performance optimization
const MemoizedVideoCard = React.memo(VideoCard);

// Custom hook to fetch user details
const useUserDetails = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        profilePictureUrl: '',
        bio: '',
        videos: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const user = response.data;
                setProfile({
                    firstName: user.firstname,
                    lastName: user.lastname,
                    profilePictureUrl: user.profilePicture || '/default-profile.png',
                    bio: user.bio,
                    videos: user.videos
                });
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Failed to fetch user details.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    return { profile, loading, error, setProfile, setLoading, setError };
};

// Custom hook for handling bio updates
const useBioUpdate = (setProfile, setError) => {
    const [loading, setLoading] = useState(false);
    const [isBioModalOpen, setIsBioModalOpen] = useState(false);
    const [bio, setBio] = useState('');

    const handleBioUpdate = useCallback(async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.put(
                `${backendUrl}/api/users/bio`,
                { bio },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.data.success) {
                throw new Error('Failed to update bio');
            }

            setProfile((prevProfile) => ({
                ...prevProfile,
                bio
            }));

            setIsBioModalOpen(false);
        } catch (error) {
            setError('Error updating bio. Please try again.');
            console.error('Error updating bio:', error);
        } finally {
            setLoading(false);
        }
    }, [bio, setError, setProfile]);

    return { isBioModalOpen, setIsBioModalOpen, bio, setBio, handleBioUpdate, loading };
};

// Custom hook for handling video uploads
const useVideoUpload = (setProfile, setError) => {
    const [uploading, setUploading] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [videoDescription, setVideoDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    const handleVideoUpload = useCallback(async (event) => {
        event.preventDefault();
        setUploading(true);
        setError('');

        const title = event.target.videoTitle.value;
        const description = videoDescription.trim();
        const wordCount = description.split(/\s+/).length;

        if (wordCount > 30) {
            setDescriptionError('Description cannot exceed 30 words.');
            setUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', event.target.videoFile.files[0]);
        formData.append('thumbnail', event.target.thumbnail.files[0]);

        try {
            const response = await axios.post(`${backendUrl}/api/uploads/video`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.data.success) {
                throw new Error('Failed to upload video');
            }

            setProfile((prevProfile) => ({
                ...prevProfile,
                videos: [...prevProfile.videos, response.data.video]
            }));

            setIsVideoModalOpen(false);
            setVideoDescription('');
        } catch (error) {
            setError('Error uploading video. Please try again.');
            console.error('Error uploading video:', error);
        } finally {
            setUploading(false);
        }
    }, [videoDescription, setError, setProfile]);

    const handleDescriptionChange = (event) => {
        const description = event.target.value;
        const wordCount = description.trim().split(/\s+/).length;

        if (wordCount > 30) {
            setDescriptionError('Description cannot exceed 30 words.');
        } else {
            setDescriptionError('');
        }

        setVideoDescription(description);
    };

    return {
        isVideoModalOpen,
        setIsVideoModalOpen,
        videoDescription,
        setVideoDescription,
        descriptionError,
        handleVideoUpload,
        handleDescriptionChange,
        uploading
    };
};

// Custom hook for handling profile picture updates
const useProfilePictureUpdate = (setProfile, setError) => {
    const [uploading, setUploading] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    const handleProfilePictureUpdate = useCallback(async (event) => {
        event.preventDefault();
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', event.target.profilePhoto.files[0]);

        try {
            const response = await axios.post(`${backendUrl}/api/uploads/profile-picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.data.success) {
                throw new Error('Failed to upload profile photo');
            }

            setProfile((prevProfile) => ({
                ...prevProfile,
                profilePictureUrl: response.data.profilePictureUrl
            }));

            setIsPhotoModalOpen(false);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error);
            } else {
                setError('Error uploading profile photo. Please try again.');
            }
            console.error('Error uploading profile photo:', error);
        } finally {
            setUploading(false);
        }
    }, [setError, setProfile]);

    return { isPhotoModalOpen, setIsPhotoModalOpen, handleProfilePictureUpdate, uploading };
};

const Profile = () => {
    const { profile, loading, error, setProfile, setLoading, setError } = useUserDetails();

    const {
        isBioModalOpen,
        setIsBioModalOpen,
        bio,
        setBio,
        handleBioUpdate,
        bioLoading
    } = useBioUpdate(setProfile, setError);

    const {
        isVideoModalOpen,
        setIsVideoModalOpen,
        videoDescription,
        setVideoDescription,
        descriptionError,
        handleVideoUpload,
        handleDescriptionChange,
        videoUploading
    } = useVideoUpload(setProfile, setError);

    const {
        isPhotoModalOpen,
        setIsPhotoModalOpen,
        handleProfilePictureUpdate,
        photoUploading
    } = useProfilePictureUpdate(setProfile, setError);

    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleVideoClick = useCallback((videoUrl) => {
        setSelectedVideo(videoUrl);
    }, []);

    const closeVideoModal = useCallback(() => {
        setSelectedVideo(null);
    }, []);

    const handleOutsideClick = useCallback((e) => {
        if (e.target.id === 'videoModal') {
            closeVideoModal();
        }
    }, [closeVideoModal]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <main className="flex-grow flex flex-col items-center px-4 py-8">
                <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        <img
                            src={profile.profilePictureUrl}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
                        />
                        <button
                            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 text-white"
                            onClick={() => setIsPhotoModalOpen(true)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm8 6.4c.78 0 1.4.62 1.4 1.4S12.78 11.2 12 11.2s-1.4-.62-1.4-1.4S11.22 8.4 12 8.4zM6.5 5C5.67 5 5 5.67 5 6.5S5.67 8 6.5 8 8 7.33 8 6.5 7.33 5 6.5 5zM4 14s1-1.5 4-1.5S12 14 12 14H4z" />
                            </svg>
                        </button>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{`${profile.firstName} ${profile.lastName}`}</h2>
                    <p className="text-gray-400 mb-4 text-center">{profile.bio || 'No bio available.'}</p>
                    <button
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold mb-4"
                        onClick={() => setIsBioModalOpen(true)}
                    >
                        Update Bio
                    </button>
                </div>
                <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-bold mb-4">Uploaded Videos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading ? (
                            [1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n}>
                                    <Skeleton height={200} />
                                    <Skeleton count={2} />
                                </div>
                            ))
                        ) : (
                            profile.videos.map((video) => (
                                <MemoizedVideoCard
                                    key={video._id}
                                    video={video}
                                    onClick={() => handleVideoClick(video.videoUrl)}
                                    lazy={true}
                                />
                            ))
                        )}
                    </div>
                    <button
                        className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
                        onClick={() => setIsVideoModalOpen(true)}
                    >
                        Upload Video
                    </button>
                    {(videoUploading || loading) && <p className="mt-4 text-blue-600">Uploading video...</p>}
                    {error && <p className="mt-4 text-red-600">{error}</p>}
                </div>
            </main>
            <Footer />

   
            <Modal isOpen={isBioModalOpen} onClose={() => setIsBioModalOpen(false)} title="Update Bio">
                <form onSubmit={handleBioUpdate} className="flex flex-col">
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="mb-4 p-2 bg-gray-700 text-white rounded-md resize-none"
                        rows="4"
                        placeholder="Enter your bio here..."
                    />
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
                    >
                        Save
                    </button>
                </form>
                {bioLoading && <p className="mt-4 text-blue-600">Updating bio...</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </Modal>


            <Modal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} title="Upload Video">
                <form onSubmit={handleVideoUpload} className="flex flex-col">
                    <input
                        type="text"
                        name="videoTitle"
                        placeholder="Video Title"
                        className="mb-4 p-2 bg-gray-700 text-white rounded-md"
                        required
                    />
                    <textarea
                        name="videoDescription"
                        value={videoDescription}
                        onChange={handleDescriptionChange}
                        className="mb-4 p-2 bg-gray-700 text-white rounded-md resize-none"
                        rows="4"
                        placeholder="Video Description (max 30 words)"
                        maxLength="150" // approximately 30 words limit
                        required
                    />
                    {descriptionError && <p className="mt-1 text-red-600">{descriptionError}</p>}
                    <input
                        type="file"
                        name="videoFile"
                        accept="video/*"
                        className="mb-4 p-2 bg-gray-700 text-white rounded-md"
                        required
                    />
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        className="mb-4 p-2 bg-gray-700 text-white rounded-md"
                        required
                    />
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
                    >
                        Upload
                    </button>
                </form>
                {videoUploading && <p className="mt-4 text-blue-600">Uploading video...</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </Modal>

          
            <Modal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} title="Upload Profile Photo">
                <form onSubmit={handleProfilePictureUpdate} className="flex flex-col">
                    <input
                        type="file"
                        name="profilePhoto"
                        accept="image/*"
                        className="mb-4 p-2 bg-gray-700 text-white rounded-md"
                        required
                    />
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
                    >
                        Upload
                    </button>
                </form>
                {photoUploading && <p className="mt-4 text-blue-600">Uploading photo...</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </Modal>

           
            {selectedVideo && (
                <div id="videoModal" className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleOutsideClick}>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative w-full max-w-2xl">
                        <button
                            className="absolute top-2 right-2 text-white hover:text-gray-400"
                            onClick={closeVideoModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <video controls className="w-full rounded-md">
                            <source src={selectedVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;





























// import React, { useState, useEffect } from 'react';
// import Navbar from '../component/Navbar';
// import Footer from '../component/Footer';
// import Modal from '../component/Modal';
// import VideoCard from '../component/Video';
// import axios from 'axios';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';

// const Profile = () => {
//     const [isBioModalOpen, setIsBioModalOpen] = useState(false);
//     const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
//     const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
//     const [bio, setBio] = useState('');
//     const [videos, setVideos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [uploading, setUploading] = useState(false);
//     const [error, setError] = useState('');
//     const [selectedVideo, setSelectedVideo] = useState(null);
//     const [profile, setProfile] = useState({
//         firstName: '',
//         lastName: '',
//         profilePictureUrl: '',
//     });
//     const [videoDescription, setVideoDescription] = useState('');
//     const [descriptionError, setDescriptionError] = useState('');

//     useEffect(() => {
//         fetchUserDetails();
//     }, []);

//     const fetchUserDetails = async () => {
//         try {
//             const response = await axios.get(`http://localhost:3000/api/users/me`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             const user = response.data;
//             setBio(user.bio);
//             setVideos(user.videos);
//             setProfile({
//                 firstName: user.firstname,
//                 lastName: user.lastname,
//                 profilePictureUrl: user.profilePicture || '/default-profile.png',
//             });
//         } catch (error) {
//             console.error('Error fetching user details:', error);
//             setError('Failed to fetch user details.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleBioUpdate = async () => {
//         setLoading(true);
//         setError('');
//         try {
//             const response = await axios.put(
//                 `http://localhost:3000/api/users/bio`,
//                 { bio },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 }
//             );

//             if (!response.data.success) {
//                 throw new Error('Failed to update bio');
//             }

//             setIsBioModalOpen(false);
//             fetchUserDetails();
//         } catch (error) {
//             setError('Error updating bio. Please try again.');
//             console.error('Error updating bio:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleVideoUpload = async (event) => {
//         event.preventDefault();
//         setUploading(true);
//         setError('');
        
//         const title = event.target.videoTitle.value;
//         const description = videoDescription.trim();
//         const wordCount = description.split(/\s+/).length;
        
//         if (wordCount > 30) {
//             setDescriptionError('Description cannot exceed 30 words.');
//             setUploading(false);
//             return;
//         }
        
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('description', description);
//         formData.append('video', event.target.videoFile.files[0]);
//         formData.append('thumbnail', event.target.thumbnail.files[0]);

//         try {
//             const response = await axios.post(`http://localhost:3000/api/uploads/video`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });

//             if (!response.data.success) {
//                 throw new Error('Failed to upload video');
//             }

//             setVideos((prevVideos) => [...prevVideos, response.data.video]);
//             setIsVideoModalOpen(false);
//             setVideoDescription('');
//         } catch (error) {
//             setError('Error uploading video. Please try again.');
//             console.error('Error uploading video:', error);
//         } finally {
//             setUploading(false);
//         }
//     };

//     const handleProfilePictureUpdate = async (event) => {
//         event.preventDefault();
//         setUploading(true);
//         setError('');
//         const formData = new FormData();
//         formData.append('file', event.target.profilePhoto.files[0]);

//         try {
//             const response = await axios.post(`http://localhost:3000/api/uploads/profile-picture`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });

//             if (!response.data.success) {
//                 throw new Error('Failed to upload profile photo');
//             }

//             setProfile((prevProfile) => ({
//                 ...prevProfile,
//                 profilePictureUrl: response.data.profilePictureUrl,
//             }));

//             setIsPhotoModalOpen(false);
//         } catch (error) {
//             if (error.response && error.response.data) {
//                 setError(error.response.data.error);
//             } else {
//                 setError('Error uploading profile photo. Please try again.');
//             }
//             console.error('Error uploading profile photo:', error);
//         } finally {
//             setUploading(false);
//         }
//     };

//     const handleVideoClick = (videoUrl) => {
//         setSelectedVideo(videoUrl);
//     };

//     const closeVideoModal = () => {
//         setSelectedVideo(null);
//     };

//     const handleOutsideClick = (e) => {
//         if (e.target.id === 'videoModal') {
//             closeVideoModal();
//         }
//     };

//     const handleDescriptionChange = (event) => {
//         const description = event.target.value;
//         const wordCount = description.trim().split(/\s+/).length;

//         if (wordCount > 30) {
//             setDescriptionError('Description cannot exceed 30 words.');
//         } else {
//             setDescriptionError('');
//         }

//         setVideoDescription(description);
//     };

//     return (
//         <div className="flex flex-col min-h-screen bg-gray-900 text-white">
//             <main className="flex-grow flex flex-col items-center px-4 py-8">
//                 <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center mb-8">
//                     <div className="relative mb-4">
//                         <img
//                             src={profile.profilePictureUrl}
//                             alt="Profile"
//                             className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
//                         />
//                         <button
//                             className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 text-white"
//                             onClick={() => setIsPhotoModalOpen(true)}
//                         >
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-5 w-5"
//                                 viewBox="0 0 20 20"
//                                 fill="currentColor"
//                             >
//                                 <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm8 6.4c.78 0 1.4.62 1.4 1.4S12.78 11.2 12 11.2s-1.4-.62-1.4-1.4S11.22 8.4 12 8.4zM6.5 5C5.67 5 5 5.67 5 6.5S5.67 8 6.5 8 8 7.33 8 6.5 7.33 5 6.5 5zM4 14s1-1.5 4-1.5S12 14 12 14H4z" />
//                             </svg>
//                         </button>
//                     </div>
//                     <h2 className="text-3xl font-bold mb-2">{`${profile.firstName} ${profile.lastName}`}</h2>
//                     <p className="text-gray-400 mb-4 text-center">{bio || 'No bio available.'}</p>
//                     <button
//                         className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold mb-4"
//                         onClick={() => setIsBioModalOpen(true)}
//                     >
//                         Update Bio
//                     </button>
//                 </div>
//                 <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
//                     <h2 className="text-2xl font-bold mb-4">Uploaded Videos</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {loading ? (
//                             [1, 2, 3, 4, 5, 6].map((n                            ) => (
//                                 <div key={n}>
//                                     <Skeleton height={200} />
//                                     <Skeleton count={2} />
//                                 </div>
//                             ))
//                         ) : (
//                             videos.map((video) => (
//                                 <VideoCard
//                                     key={video._id}
//                                     video={video}
//                                     onClick={() => handleVideoClick(video.videoUrl)}
//                                     lazy={true}
//                                 />
//                             ))
//                         )}
//                     </div>
//                     <button
//                         className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
//                         onClick={() => setIsVideoModalOpen(true)}
//                     >
//                         Upload Video
//                     </button>
//                     {uploading && <p className="mt-4 text-blue-600">Uploading video...</p>}
//                 </div>
//             </main>
//             <Footer />

//             <Modal isOpen={isBioModalOpen}
//                 onClose={() => setIsBioModalOpen(false)}
//                 title="Update Bio"
//             >
//                 <form onSubmit={handleBioUpdate} className="flex flex-col">
//                     <textarea
//                         value={bio}
//                         onChange={(e) => setBio(e.target.value)}
//                         className="mb-4 p-2 bg-gray-700 text-white rounded-md resize-none"
//                         rows="4"
//                         placeholder="Enter your bio here..."
//                     />
//                     <button
//                         type="submit"
//                         className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
//                     >
//                         Save
//                     </button>
//                 </form>
//                 {loading && <p className="mt-4 text-blue-600">Updating bio...</p>}
//                 {error && <p className="mt-4 text-red-600">{error}</p>}
//             </Modal>

//             <Modal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} title="Upload Video">
//                 <form onSubmit={handleVideoUpload} className="flex flex-col">
//                     <input
//                         type="text"
//                         name="videoTitle"
//                         placeholder="Video Title"
//                         className="mb-4 p-2 bg-gray-700 text-white rounded-md"
//                         required
//                     />
//                     <textarea
//                         name="videoDescription"
//                         value={videoDescription}
//                         onChange={handleDescriptionChange}
//                         className="mb-4 p-2 bg-gray-700 text-white rounded-md resize-none"
//                         rows="4"
//                         placeholder="Video Description (max 30 words)"
//                         maxLength="150" // approximately 30 words limit
//                         required
//                     />
//                     {descriptionError && <p className="mt-1 text-red-600">{descriptionError}</p>}
//                     <input
//                         type="file"
//                         name="videoFile"
//                         accept="video/*"
//                         className="mb-4 p-2 bg-gray-700 text-white rounded-md"
//                         required
//                     />
//                     <input
//                         type="file"
//                         name="thumbnail"
//                         accept="image/*"
//                         className="mb-4 p-2 bg-gray-700 text-white rounded-md"
//                         required
//                     />
//                     <button
//                         type="submit"
//                         className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
//                     >
//                         Upload
//                     </button>
//                 </form>
//                 {uploading && <p className="mt-4 text-blue-600">Uploading video...</p>}
//                 {error && <p className="mt-4 text-red-600">{error}</p>}
//             </Modal>

//             <Modal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} title="Upload Profile Photo">
//                 <form onSubmit={handleProfilePictureUpdate} className="flex flex-col">
//                     <input
//                         type="file"
//                         name="profilePhoto"
//                         accept="image/*"
//                         className="mb-4 p-2 bg-gray-700 text-white rounded-md"
//                         required
//                     />
//                     <button
//                         type="submit"
//                         className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
//                     >
//                         Upload
//                     </button>
//                 </form>
//                 {uploading && <p className="mt-4 text-blue-600">Uploading photo...</p>}
//                 {error && <p className="mt-4 text-red-600">{error}</p>}
//             </Modal>

//             {selectedVideo && (
//                 <div id="videoModal" className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleOutsideClick}>
//                     <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative w-full max-w-2xl">
//                         <button
//                             className="absolute top-2 right-2 text-white hover:text-gray-400"
//                             onClick={closeVideoModal}
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                         <video controls className="w-full rounded-md">
//                             <source src={selectedVideo} type="video/mp4" />
//                             Your browser does not support the video tag.
//                         </video>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Profile;

