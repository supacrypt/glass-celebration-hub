import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Users, Image, Calendar, MessageSquare, BarChart3, CheckCircle, AlertTriangle, Activity, Gift } from 'lucide-react';

interface DashboardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'guest' | 'admin' | 'couple';
}

const DashboardPopup: React.FC<DashboardPopupProps> = ({ isOpen, onClose, userRole }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'gifts', label: 'Gifts', icon: Gift },
    { id: 'rsvps', label: 'RSVPs', icon: Calendar },
  ];

  const guestTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'rsvps', label: 'RSVP', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const tabs = userRole === 'admin' ? adminTabs : guestTabs;

  const adminStats = [
    { label: 'Total Users', value: '156', icon: CheckCircle, color: 'from-blue-500 to-purple-600' },
    { label: 'Total RSVPs', value: '89', icon: Calendar, color: 'from-pink-500 to-red-500' },
    { label: 'Pending Photos', value: '12', icon: AlertTriangle, color: 'from-cyan-500 to-blue-500' },
    { label: 'Total Messages', value: '342', icon: MessageSquare, color: 'from-pink-400 to-yellow-400' },
    { label: 'Approved Photos', value: '234', icon: CheckCircle, color: 'from-teal-400 to-pink-300' },
    { label: 'Active Users', value: '45', icon: Activity, color: 'from-orange-200 to-orange-400' },
  ];

  const guestStats = [
    { label: 'RSVPs', value: '67', total: '85', icon: Users },
    { label: 'Photos', value: '134', icon: Image },
    { label: 'Days Left', value: '42', icon: Calendar },
    { label: 'Messages', value: '23', icon: MessageSquare },
  ];

  const recentActivity = [
    { icon: '📸', text: 'New photo uploaded by John Doe', time: '2 min ago' },
    { icon: '✅', text: 'Sarah Smith confirmed RSVP', time: '15 min ago' },
    { icon: '👤', text: 'New user registration: Mike Johnson', time: '1 hour ago' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[998] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed bottom-16 sm:bottom-24 left-1/2 transform -translate-x-1/2 z-[999] w-[95vw] sm:w-[90vw] max-w-2xl max-h-[75vh] sm:max-h-[80vh] overflow-y-auto">
        <div 
          className="glass-popup p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#2d3f51]">
              {userRole === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
            </h2>
            <button
              onClick={onClose}
              className="glass-button w-10 h-10 rounded-full flex items-center justify-center relative z-10"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-2 mb-5 border-b border-[#a39b92]/20 pb-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-[#2d3f51]'
                      : 'text-[#7a736b] hover:text-[#5a5651]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-[-11px] left-0 right-0 h-0.5 bg-[#2d3f51]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className={`grid gap-4 ${userRole === 'admin' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`}>
                  {(userRole === 'admin' ? adminStats : guestStats).map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={index}
                        className="glass-card p-4 flex items-center gap-3"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          userRole === 'admin' 
                            ? `bg-gradient-to-br ${stat.color}` 
                            : 'bg-[#2d3f51]'
                        }`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-[#2d3f51]">{stat.value}</div>
                          <div className="text-xs text-[#7a736b]">{stat.label}</div>
                          {'total' in stat && stat.total && (
                            <div className="mt-1 w-full bg-[#a39b92]/20 rounded-full h-1">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-700"
                                style={{ width: `${(parseInt(stat.value) / parseInt(stat.total)) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Activity */}
                <div className="glass-card p-4">
                  <h3 className="text-base font-semibold text-foreground mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 glass-button text-sm cursor-pointer"
                      >
                        <span className="text-base">{activity.icon}</span>
                        <span className="flex-1 text-[#5a5651]">{activity.text}</span>
                        <span className="text-xs text-[#8a8580]">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && userRole === 'admin' && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-[#2d3f51]">User Management</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleNavigate('/dashboard/users')}
                    className="glass-button p-3 text-sm font-medium text-foreground"
                  >
                    View All Users
                  </button>
                  <button
                    onClick={() => handleNavigate('/dashboard/users/roles')}
                    className="glass-button p-3 text-sm font-medium text-foreground"
                  >
                    Manage Roles
                  </button>
                </div>
                <div className="text-xs text-muted-foreground glass-card p-3">
                  Manage user roles (guest, admin, couple), track user activity, and handle account management functions.
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-[#2d3f51]">
                  {userRole === 'admin' ? 'Photo Moderation' : 'Photo Gallery'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userRole === 'admin' ? (
                    <>
                      <button
                        onClick={() => handleNavigate('/dashboard/photos/pending')}
                        className="p-3 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-xl text-sm font-medium hover:scale-105 transition-transform animate-pulse"
                      >
                        Review Pending (12)
                      </button>
                      <button
                        onClick={() => handleNavigate('/dashboard/photos/approved')}
                        className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
                        style={{
                          boxShadow: `
                            5px 5px 10px rgba(163, 155, 146, 0.3),
                            -5px -5px 10px rgba(255, 255, 255, 0.6)
                          `
                        }}
                      >
                        Approved Photos
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavigate('/gallery')}
                        className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
                        style={{
                          boxShadow: `
                            5px 5px 10px rgba(163, 155, 146, 0.3),
                            -5px -5px 10px rgba(255, 255, 255, 0.6)
                          `
                        }}
                      >
                        View Gallery
                      </button>
                      <button
                        onClick={() => handleNavigate('/gifts')}
                        className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
                        style={{
                          boxShadow: `
                            5px 5px 10px rgba(163, 155, 146, 0.3),
                            -5px -5px 10px rgba(255, 255, 255, 0.6)
                          `
                        }}
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
            )}

            {activeTab === 'rsvps' && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-[#2d3f51]">
                  {userRole === 'admin' ? 'RSVP Management' : 'RSVP Status'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userRole === 'admin' ? (
                    <>
                      <button
                        onClick={() => handleNavigate('/dashboard/rsvps')}
                        className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
                        style={{
                          boxShadow: `
                            5px 5px 10px rgba(163, 155, 146, 0.3),
                            -5px -5px 10px rgba(255, 255, 255, 0.6)
                          `
                        }}
                      >
                        View All RSVPs
                      </button>
                      <button
                        onClick={() => handleNavigate('/dashboard/rsvps/export')}
                        className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
                        style={{
                          boxShadow: `
                            5px 5px 10px rgba(163, 155, 146, 0.3),
                            -5px -5px 10px rgba(255, 255, 255, 0.6)
                          `
                        }}
                      >
                        Export Guest Data
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavigate('/rsvp')}
                        className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
                        style={{
                          boxShadow: `
                            5px 5px 10px rgba(163, 155, 146, 0.3),
                            -5px -5px 10px rgba(255, 255, 255, 0.6)
                          `
                        }}
                      >
                        Update RSVP
                      </button>
                      <button
                        onClick={() => handleNavigate('/rsvp/status')}
                        className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
                        style={{
                          boxShadow: `
                            5px 5px 10px rgba(163, 155, 146, 0.3),
                            -5px -5px 10px rgba(255, 255, 255, 0.6)
                          `
                        }}
                      >
                        View Status
                      </button>
                    </>
                  )}
                </div>
                <div className="text-xs text-[#7a736b] bg-white/30 p-3 rounded-xl">
                  {userRole === 'admin'
                    ? 'View RSVP responses, manage guest lists, track attendance numbers, and handle guest count management.'
                    : 'Update your RSVP status and view event details for the wedding celebration.'
                  }
                </div>
              </div>
            )}

            {activeTab === 'gifts' && userRole === 'admin' && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-[#2d3f51]">Gift Registry Management</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleNavigate('/dashboard/gifts')}
                    className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
                    style={{
                      boxShadow: `
                        5px 5px 10px rgba(163, 155, 146, 0.3),
                        -5px -5px 10px rgba(255, 255, 255, 0.6)
                      `
                    }}
                  >
                    Manage Gifts
                  </button>
                  <button
                    onClick={() => handleNavigate('/dashboard/gifts/add')}
                    className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
                    style={{
                      boxShadow: `
                        5px 5px 10px rgba(163, 155, 146, 0.3),
                        -5px -5px 10px rgba(255, 255, 255, 0.6)
                      `
                    }}
                  >
                    Add New Gift
                  </button>
                </div>
                <div className="text-xs text-[#7a736b] bg-white/30 p-3 rounded-xl">
                  Manage gift registry items, track purchases, and handle gift-related features for the wedding.
                </div>
              </div>
            )}

            {activeTab === 'messages' && userRole !== 'admin' && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-[#2d3f51]">Messages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleNavigate('/social')}
                    className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
                    style={{
                      boxShadow: `
                        5px 5px 10px rgba(163, 155, 146, 0.3),
                        -5px -5px 10px rgba(255, 255, 255, 0.6)
                      `
                    }}
                  >
                    View Messages
                  </button>
                  <button
                    onClick={() => handleNavigate('/social/compose')}
                    className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
                    style={{
                      boxShadow: `
                        5px 5px 10px rgba(163, 155, 146, 0.3),
                        -5px -5px 10px rgba(255, 255, 255, 0.6)
                      `
                    }}
                  >
                    Send Message
                  </button>
                </div>
                <div className="text-xs text-[#7a736b] bg-white/30 p-3 rounded-xl">
                  Connect with other wedding guests, share memories, and stay updated with wedding announcements.
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