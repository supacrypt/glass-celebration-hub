import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface SocialPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SocialPopup: React.FC<SocialPopupProps> = ({ isOpen, onClose }) => {
  const { userRole } = useAuth();

  if (!isOpen) return null;

  const isAdmin = userRole?.role === 'admin';

  const socialPosts = [
    {
      author: 'John Doe',
      avatar: 'JD',
      time: '2 hours ago',
      content: "So excited for the big day! Can't wait to celebrate with everyone! 🎉"
    },
    {
      author: 'Sarah Miller',
      avatar: 'SM',
      time: '5 hours ago',
      content: 'Just booked my hotel room! Who else is staying at the Grand Estate?'
    },
    {
      author: 'The Couple',
      avatar: 'TC',
      time: '1 day ago',
      content: 'Welcome to our wedding social feed! Share your excitement and connect with other guests here! 💕'
    }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[998]" onClick={onClose} />
      
      <div className="fixed bottom-[100px] left-1/2 transform -translate-x-1/2 z-[999] max-w-[90vw] w-[650px] max-h-[80vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-[#f5ede4] to-[#e8e0d7] rounded-[25px] p-6 shadow-glass border border-white/30">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[#2d3f51]">
              {isAdmin ? 'Social Management' : 'Social Feed'}
            </h2>
          </div>

          {/* Recent Updates */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#2d3f51] mb-4">Recent Updates</h3>
            <div className="space-y-3">
              {socialPosts.map((post, index) => (
                <div 
                  key={index}
                  className="bg-white/30 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-white/50 hover:transform hover:translate-x-1"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center text-white text-sm font-semibold">
                      {post.avatar}
                    </div>
                    <div className="font-medium text-[#2d3f51] text-sm">
                      {post.author}
                    </div>
                    <div className="text-xs text-[#8a8580] ml-auto">
                      {post.time}
                    </div>
                  </div>
                  <div className="text-sm text-[#5a5651] leading-relaxed">
                    {post.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl py-3 px-5 font-medium text-sm shadow-lg hover:transform hover:-translate-y-1 transition-all duration-200">
              {isAdmin ? 'Moderate Posts' : 'Post Update'}
            </button>
            <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-5 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200">
              {isAdmin ? 'User Activity' : 'View All Posts'}
            </button>
            <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-5 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200">
              Guest List
            </button>
            <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-5 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200">
              Message Board
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialPopup;