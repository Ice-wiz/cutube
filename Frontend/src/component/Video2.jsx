import React, { useState } from 'react';

const VideoCard = ({ video }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleVideoClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <img
        src={video.thumbnailUrl || '/default-thumbnail.png'}
        alt={video.title}
        className="w-full h-full object-cover rounded-md cursor-pointer"
        onClick={handleVideoClick}
      />
      {isOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <video
            src={video.url}
            controls
            className="w-full h-full"
          ></video>
          <button
            onClick={handleVideoClick}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
