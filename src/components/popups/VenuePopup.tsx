import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface VenuePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const VenuePopup: React.FC<VenuePopupProps> = ({ isOpen, onClose }) => {
  const { userRole } = useAuth();

  if (!isOpen) return null;

  const venues = [
    {
      icon: '💒',
      title: 'Ceremony',
      detail: "St. Mary's Church\n2:30 PM",
      gradient: 'from-[#667eea] to-[#764ba2]'
    },
    {
      icon: '🏰',
      title: 'Reception', 
      detail: 'Grand Estate Hotel\n4:00 PM',
      gradient: 'from-[#f093fb] to-[#f5576c]'
    },
    {
      icon: '🚗',
      title: 'Parking',
      detail: 'Free valet available\nGuest parking area',
      gradient: 'from-[#4facfe] to-[#00f2fe]'
    },
    {
      icon: '🏨',
      title: 'Hotels',
      detail: 'Room blocks nearby\nSpecial rates',
      gradient: 'from-[#fa709a] to-[#fee140]'
    }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[998]" onClick={onClose} />
      
      <div className="fixed bottom-[100px] left-1/2 transform -translate-x-1/2 z-[999] max-w-[90vw] w-[650px] max-h-[80vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-[#f5ede4] to-[#e8e0d7] rounded-[25px] p-6 shadow-glass border border-white/30">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[#2d3f51]">Venue Information</h2>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-2xl h-[200px] flex items-center justify-center text-5xl text-[#7a736b] mb-6 shadow-glass">
            📍
          </div>

          {/* Venue Details */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#2d3f51] mb-4">Venue Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {venues.map((venue, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-2xl p-4 shadow-glass cursor-pointer transition-all duration-200 hover:transform hover:-translate-y-1"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${venue.gradient} flex items-center justify-center text-xl mb-3`}>
                    {venue.icon}
                  </div>
                  <div className="font-semibold text-[#2d3f51] text-sm mb-1">
                    {venue.title}
                  </div>
                  <div className="text-xs text-[#7a736b] whitespace-pre-line">
                    {venue.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl py-3 px-5 font-medium text-sm shadow-lg hover:transform hover:-translate-y-1 transition-all duration-200">
              Get Directions
            </button>
            <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-5 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200">
              Transportation Info
            </button>
            <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-5 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200">
              Book Accommodation
            </button>
            <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-5 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200">
              Contact Venue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VenuePopup;