import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Info, Camera, Users } from 'lucide-react';

interface DashboardPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardPopup: React.FC<DashboardPopupProps> = ({ isOpen, onClose }) => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const isAdmin = userRole?.role === 'admin';

  const tabs = isAdmin ? [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'info', label: 'Info', icon: Info }
  ] : [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'rsvp', label: 'RSVP', icon: Users },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'info', label: 'Info', icon: Info }
  ];

  const scheduleItems = [
    { time: '2:30 PM', title: 'Ceremony', location: "St. Mary's Church", icon: '💒', gradient: 'from-[#f093fb] to-[#f5576c]' },
    { time: '4:00 PM', title: 'Cocktail Hour', location: 'Garden Terrace', icon: '🥂', gradient: 'from-[#4facfe] to-[#00f2fe]' },
    { time: '6:00 PM', title: 'Reception Dinner', location: 'Grand Ballroom', icon: '🍽️', gradient: 'from-[#fa709a] to-[#fee140]' }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[998]" onClick={onClose} />
      
      <div className="fixed bottom-[100px] left-1/2 transform -translate-x-1/2 z-[999] max-w-[90vw] w-[650px] max-h-[80vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-[#f5ede4] to-[#e8e0d7] rounded-[25px] p-6 shadow-glass border border-white/30">
          
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-xl font-semibold text-[#2d3f51]">
              {isAdmin ? 'Admin Dashboard' : 'Guest Dashboard'}
            </h2>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-2 mb-5 border-b border-[#a39b92]/20 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 relative ${
                    activeTab === tab.id
                      ? 'text-[#2d3f51] after:absolute after:bottom-[-11px] after:left-0 after:right-0 after:h-0.5 after:bg-[#2d3f51]'
                      : 'text-[#7a736b] hover:text-[#5a5651]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px] bg-gradient-to-b from-transparent to-white/10 rounded-2xl p-3">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-base font-semibold text-[#2d3f51] mb-4">
                  {isAdmin ? 'Wedding Overview' : 'Event Schedule'}
                </h3>
                <div className="space-y-3">
                  {scheduleItems.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 bg-white/30 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/50 hover:transform hover:translate-x-1"
                    >
                      <div className="font-semibold text-[#2d3f51] min-w-[70px] text-sm">
                        {item.time}
                      </div>
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center text-lg`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#2d3f51] text-sm">{item.title}</div>
                        <div className="text-xs text-[#7a736b]">{item.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RSVP Tab (Guest) / Users Tab (Admin) */}
            {(activeTab === 'rsvp' || activeTab === 'users') && (
              <div>
                {isAdmin ? (
                  <div>
                    <h3 className="text-base font-semibold text-[#2d3f51] mb-4">User Management</h3>
                    <div className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-2xl p-5 shadow-glass">
                      <div className="text-center">
                        <div className="text-3xl mb-3">👥</div>
                        <div className="text-lg font-semibold text-[#2d3f51]">48 Total Users</div>
                        <div className="text-sm text-[#7a736b] mt-1">Manage guest accounts and permissions</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-2xl p-5 mb-5 shadow-glass">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#11998e] to-[#38ef7d] flex items-center justify-center text-2xl">
                          ✓
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-[#2d3f51]">You're Attending!</div>
                          <div className="text-sm text-[#7a736b]">RSVP confirmed for 2 guests</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-4 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200">
                        Update RSVP
                      </button>
                      <button className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] text-[#5a5651] rounded-xl py-3 px-4 font-medium text-sm shadow-glass hover:transform hover:-translate-y-1 transition-all duration-200">
                        Dietary Preferences
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === 'photos' && (
              <div>
                <div className="text-center bg-white/30 rounded-2xl p-5 mb-5">
                  <div className="w-15 h-15 mx-auto mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-base font-semibold text-[#2d3f51] mb-2">
                    {isAdmin ? 'Photo Management' : 'Share Your Memories'}
                  </div>
                  <div className="text-xs text-[#7a736b] mb-4">
                    {isAdmin ? 'Moderate and manage uploaded photos' : 'Upload photos from the celebration'}
                  </div>
                  <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl py-2 px-6 font-medium text-sm shadow-lg hover:transform hover:-translate-y-1 transition-all duration-200">
                    {isAdmin ? 'Manage Photos' : 'Upload Photos'}
                  </button>
                </div>
              </div>
            )}

            {/* Info Tab */}
            {activeTab === 'info' && (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-2xl p-4 shadow-glass">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center text-xl mb-3">
                      📍
                    </div>
                    <div className="font-semibold text-[#2d3f51] text-sm mb-1">Venue Location</div>
                    <div className="text-xs text-[#7a736b]">Grand Estate Hotel<br />123 Wedding Lane</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-2xl p-4 shadow-glass">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#f093fb] to-[#f5576c] flex items-center justify-center text-xl mb-3">
                      🏨
                    </div>
                    <div className="font-semibold text-[#2d3f51] text-sm mb-1">Accommodation</div>
                    <div className="text-xs text-[#7a736b]">Room block available<br />Code: SMITHWED2024</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPopup;