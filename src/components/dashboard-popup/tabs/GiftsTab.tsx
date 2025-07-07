import React from 'react';

interface GiftsTabProps {
  onNavigate: (path: string) => void;
}

const GiftsTab: React.FC<GiftsTabProps> = ({ onNavigate }) => {
  const buttonStyle = {
    boxShadow: `
      5px 5px 10px rgba(163, 155, 146, 0.3),
      -5px -5px 10px rgba(255, 255, 255, 0.6)
    `
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-[#2d3f51]">Gift Registry Management</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('/dashboard/gifts')}
          className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
          style={buttonStyle}
        >
          Manage Gifts
        </button>
        <button
          onClick={() => onNavigate('/dashboard/gifts/add')}
          className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
          style={buttonStyle}
        >
          Add New Gift
        </button>
      </div>
      <div className="text-xs text-[#7a736b] bg-white/30 p-3 rounded-xl">
        Manage gift registry items, track purchases, and handle gift-related features for the wedding.
      </div>
    </div>
  );
};

export default GiftsTab;