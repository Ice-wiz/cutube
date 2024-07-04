import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../component/Video';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const backendUrl = import.meta.env.VITE_BACKEND_URL; 

const UserProfile = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        profilePictureUrl: '',
        bio: '',
        videos: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, [userId]);

    const fetchUserProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${backendUrl}/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const user = response.data;
            setProfile({
                firstName: user.firstname,
                lastName: user.lastname,
                profilePictureUrl: user.profilePicture || '/default-profile.png',
                bio: user.bio,
                videos: user.videos,
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError('Failed to fetch user profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = (videoUrl) => {
        setSelectedVideo(videoUrl);
    };

    const closeVideoModal = () => {
        setSelectedVideo(null);
    };

    const handleOutsideClick = (event) => {
        if (event.target.id === 'videoModal') {
            closeVideoModal();
        }
    };

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
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{`${profile.firstName} ${profile.lastName}`}</h2>
                    <p className="text-gray-400 mb-4 text-center">{profile.bio || 'No bio available.'}</p>
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
                                <VideoCard
                                    key={video._id}
                                    video={video}
                                    onClick={() => handleVideoClick(video.videoUrl)}
                                    lazy={true}
                                />
                            ))
                        )}
                    </div>
                </div>
            </main>
            {selectedVideo && (
                   <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
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

export default UserProfile;
