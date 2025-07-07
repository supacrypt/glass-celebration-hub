import React from 'react';

interface PhotosTabProps {
  userRole: 'guest' | 'admin' | 'couple';
  onNavigate: (path: string) => void;
}

const PhotosTab: React.FC<PhotosTabProps> = ({ userRole, onNavigate }) => {
  const buttonStyle = {
    boxShadow: `
      5px 5px 10px rgba(163, 155, 146, 0.3),
      -5px -5px 10px rgba(255, 255, 255, 0.6)
    `
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-[#2d3f51]">
        {userRole === 'admin' ? 'Photo Moderation' : 'Photo Gallery'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {userRole === 'admin' ? (
          <>
            <button
              onClick={() => onNavigate('/dashboard/photos/pending')}
              className="p-3 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-xl text-sm font-medium hover:scale-105 transition-transform animate-pulse"
            >
              Review Pending (12)
            </button>
            <button
              onClick={() => onNavigate('/dashboard/photos/approved')}
              className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
              style={buttonStyle}
            >
              Approved Photos
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onNavigate('/gallery')}
              className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
              style={buttonStyle}
            >
              View Gallery
            </button>
            <button
              onClick={() => onNavigate('/gifts')}
              className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
              style={buttonStyle}
            >
              Gift Registry
            </button>
          </>
        )}
      </div>
      <div className="text-xs text-[#7a736b] bg-white/30 p-3 rounded-xl">
        {userRole === 'admin' 
          ? 'Review and moderate photo uploads, manage gallery content, and track photo statistics.'
          : 'View wedding photos and upload your own memories to share with everyone.'
        }
      </div>
    </div>
  );
};

export default PhotosTab;