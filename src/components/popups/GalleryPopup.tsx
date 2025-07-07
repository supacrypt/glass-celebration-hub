import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Camera, Download, Plus } from 'lucide-react';

interface GalleryPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const GalleryPopup: React.FC<GalleryPopupProps> = ({ isOpen, onClose }) => {
  const { userRole } = useAuth();

  if (!isOpen) return null;

  const isAdmin = userRole?.role === 'admin';

  const photoPlaceholders = ['📸', '📷', '🖼️', '📸', '📷', '➕'];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[998]" onClick={onClose} />
      
      <div className="fixed bottom-[100px] left-1/2 transform -translate-x-1/2 z-[999] max-w-[90vw] w-[650px] max-h-[80vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-[#f5ede4] to-[#e8e0d7] rounded-[25px] p-6 shadow-glass border border-white/30">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[#2d3f51]">
              {isAdmin ? 'Photo Management' : 'Photo Gallery'}
            </h2>
          </div>

          {/* Photo Grid */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#2d3f51] mb-4">Wedding Memories</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {photoPlaceholders.map((emoji, index) => (
                <div 
                  key={index}
                  className="aspect-square bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl flex items-center justify-center text-2xl text-[#7a736b] cursor-pointer transition-all duration-200 hover:scale-105 shadow-glass"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="text-center p-5 bg-white/30 rounded-xl mb-6">
            <div className="text-4xl mb-3">
              <Camera className="w-12 h-12 mx-auto text-[#7a736b]" />
            </div>
            <div className="text-base font-medium text-[#2d3f51]">234 Photos Shared</div>
            <div className="text-xs text-[#7a736b] mt-1">
              {isAdmin ? 'Manage and moderate wedding photos' : 'Be part of our memory collection!'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl py-3 px-5 font-medium text-sm shadow-lg hover:transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2">
              {isAdmin ? (
                <>
                  <Camera className="w-4 h-4" />
                  Moderate Photos
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Upload Photos
                </>
              )}
            </button>
            <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-5 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200">
              {isAdmin ? 'Pending Approval' : 'My Uploads'}
            </button>
            <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-5 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download All
            </button>
            <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-5 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200">
              Create Album
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryPopup;