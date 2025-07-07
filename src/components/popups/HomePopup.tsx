import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface HomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const HomePopup: React.FC<HomePopupProps> = ({ isOpen, onClose }) => {
  const { userRole } = useAuth();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const weddingDate = new Date('2024-12-15T14:30:00');
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    if (isOpen) {
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const features = userRole?.role === 'admin' ? [
    { icon: '👥', title: 'User Management', desc: 'Manage guest accounts' },
    { icon: '📊', title: 'Analytics', desc: 'View event statistics' },
    { icon: '📝', title: 'Content Control', desc: 'Moderate content' },
    { icon: '⚙️', title: 'Settings', desc: 'Configure wedding details' }
  ] : [
    { icon: '💌', title: 'RSVP Status', desc: 'Manage your attendance' },
    { icon: '📸', title: 'Photo Gallery', desc: 'Share memories' },
    { icon: '📍', title: 'Venue Info', desc: 'Location & directions' },
    { icon: '💬', title: 'Messages', desc: 'Contact the couple' }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[998]" onClick={onClose} />
      
      <div className="fixed bottom-[100px] left-1/2 transform -translate-x-1/2 z-[999] max-w-[90vw] w-[650px] max-h-[80vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-[#f5ede4] to-[#e8e0d7] rounded-[25px] p-6 shadow-glass border border-white/30">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[#2d3f51] mb-2">
              {userRole?.role === 'admin' ? 'Admin Dashboard' : 'Wedding Home'}
            </h2>
          </div>

          {/* Countdown Section */}
          <div className="text-center mb-6">
            <div className="text-2xl font-semibold text-[#2d3f51] mb-4">
              Tim & Kirsten's Wedding
            </div>
            <div className="grid grid-cols-4 gap-4 mb-5">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-2xl p-4 shadow-glass">
                  <span className="text-3xl font-bold text-[#2d3f51] block">
                    {value}
                  </span>
                  <span className="text-xs text-[#7a736b] mt-1 capitalize">
                    {unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Features */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#2d3f51] mb-4">
              {userRole?.role === 'admin' ? 'Admin Tools' : 'Quick Access'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-2xl p-5 text-center shadow-glass cursor-pointer transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-glass-hover"
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <div className="text-sm font-semibold text-[#2d3f51] mb-1">
                    {feature.title}
                  </div>
                  <div className="text-xs text-[#7a736b]">
                    {feature.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl py-3 px-5 font-medium text-sm shadow-lg hover:transform hover:-translate-y-1 transition-all duration-200">
              {userRole?.role === 'admin' ? 'Manage Wedding' : 'View Full Schedule'}
            </button>
            <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-5 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200">
              {userRole?.role === 'admin' ? 'User Analytics' : 'Wedding Story'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePopup;