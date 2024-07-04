import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../component/Video';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ListingPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/users/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
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
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-screen-lg mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Users Listing</h1>
                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <div className="space-y-6">
                        {users.map((user) => (
                            <div key={user._id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={user.profilePicture || '/default-profile.png'}
                                            alt={`${user.firstname}'s profile`}
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                        <h2 className="text-xl font-bold">{user.firstname}</h2>
                                    </div>
                                    <Link
                                        to={`/profile/${user._id}`}
                                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {user.videos.length > 0 ? (
                                        user.videos.slice(0, 5).map((video, index) => (
                                            <VideoCard key={index} video={video} onClick={() => handleVideoClick(video.videoUrl)} />
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center">No uploads</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
        </div>
    );
};

export default ListingPage;
