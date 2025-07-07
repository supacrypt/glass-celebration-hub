import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Users, Image, Calendar, MessageSquare, BarChart3, CheckCircle, AlertTriangle, Activity, Gift } from 'lucide-react';
import { TabNavigation, OverviewTab, UsersTab, PhotosTab, RSVPsTab, GiftsTab, MessagesTab } from './index';
import { DashboardPopupProps, TabItem, StatItem, ActivityItem } from './types';

const DashboardPopupRefactored: React.FC<DashboardPopupProps> = ({ isOpen, onClose, userRole }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const adminTabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'gifts', label: 'Gifts', icon: Gift },
    { id: 'rsvps', label: 'RSVPs', icon: Calendar },
  ];

  const guestTabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'rsvps', label: 'RSVP', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const tabs = userRole === 'admin' ? adminTabs : guestTabs;

  const adminStats: StatItem[] = [
    { label: 'Total Users', value: '156', icon: CheckCircle, color: 'from-blue-500 to-purple-600' },
    { label: 'Total RSVPs', value: '89', icon: Calendar, color: 'from-pink-500 to-red-500' },
    { label: 'Pending Photos', value: '12', icon: AlertTriangle, color: 'from-cyan-500 to-blue-500' },
    { label: 'Total Messages', value: '342', icon: MessageSquare, color: 'from-pink-400 to-yellow-400' },
    { label: 'Approved Photos', value: '234', icon: CheckCircle, color: 'from-teal-400 to-pink-300' },
    { label: 'Active Users', value: '45', icon: Activity, color: 'from-orange-200 to-orange-400' },
  ];

  const guestStats: StatItem[] = [
    { label: 'RSVPs', value: '67', total: '85', icon: Users },
    { label: 'Photos', value: '134', icon: Image },
    { label: 'Days Left', value: '42', icon: Calendar },
    { label: 'Messages', value: '23', icon: MessageSquare },
  ];

  const recentActivity: ActivityItem[] = [
    { icon: '📸', text: 'New photo uploaded by John Doe', time: '2 min ago' },
    { icon: '✅', text: 'Sarah Smith confirmed RSVP', time: '15 min ago' },
    { icon: '👤', text: 'New user registration: Mike Johnson', time: '1 hour ago' },
  ];

  const stats = userRole === 'admin' ? adminStats : guestStats;

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} activities={recentActivity} userRole={userRole} />;
      case 'users':
        return userRole === 'admin' ? <UsersTab onNavigate={handleNavigate} /> : null;
      case 'photos':
        return <PhotosTab userRole={userRole} onNavigate={handleNavigate} />;
      case 'rsvps':
        return <RSVPsTab userRole={userRole} onNavigate={handleNavigate} />;
      case 'gifts':
        return userRole === 'admin' ? <GiftsTab onNavigate={handleNavigate} /> : null;
      case 'messages':
        return userRole !== 'admin' ? <MessagesTab onNavigate={handleNavigate} /> : null;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Invisible Overlay for click-to-close functionality */}
      <div 
        className="fixed inset-0 z-[998]"
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
          <TabNavigation 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPopupRefactored;