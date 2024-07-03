import React from 'react';

const VideoCard = ({ video, onClick }) => {
  return (
    <div
      className="relative group cursor-pointer transition transform hover:scale-105 mb-6"
      onClick={onClick}
    >
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="w-full h-48 object-cover rounded-lg shadow-lg"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black bg-opacity-50 rounded-lg">
        <button className="text-white text-xl bg-blue-600 p-2 rounded-full">
          ▶
        </button>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold">{video.title}</h3>
        <p className="text-gray-400 mt-2">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoCard;
