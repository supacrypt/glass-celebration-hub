import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  Settings,
  Home,
  Calendar,
  Heart,
  MessageSquare,
  Camera,
  HelpCircle,
  Building,
  Bus,
  UserCheck,
  ClipboardList,
  UserPlus,
  MapPin,
  BarChart,
  Shield,
  Database,
  Code
} from 'lucide-react';

// Import wireframe-based components
import HomePageManager from '@/components/admin/HomePageManager';
import EventTimelineManager from '@/components/admin/EventTimelineManager';
import GuestContentManager from '@/components/admin/GuestContentManager';
import SeatingPlanManager from '@/components/admin/SeatingPlanManager';
import FAQManagement from '@/components/admin/FAQManagement/FAQManagement';
import AccommodationManager from '@/components/admin/AccommodationManager';
import TransportationManager from '@/components/admin/TransportationManager';

// Import existing components that fit wireframe structure
import UnifiedAccountsManagement from '@/components/admin/UnifiedAccountsManagement';
import WeddingGuestManagement from '@/components/admin/WeddingGuestManagement';
import EnhancedRSVPManagement from '@/components/admin/EnhancedRSVPManagement';
import CompactSystemSettings from '@/components/admin/CompactSystemSettings';
import EnhancedAnalytics from '@/components/admin/EnhancedAnalytics';
import AdvancedSecurity from '@/components/admin/AdvancedSecurity';
import BackupRecovery from '@/components/admin/BackupRecovery';
import SystemMonitoring from '@/components/admin/SystemMonitoring';
import ProductionReadinessTest from '@/components/admin/ProductionReadinessTest';

import type { AdminStats, User, RSVP, Photo } from './types';

interface WireframeAdminDashboardProps {
  stats: AdminStats;
  users: User[];
  rsvps: RSVP[];
  photos: Photo[];
  onRefresh: () => void;
}

const WireframeAdminDashboard: React.FC<WireframeAdminDashboardProps> = ({
  stats,
  users,
  rsvps,
  photos,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [activeSubTab, setActiveSubTab] = useState<Record<string, string>>({
    content: 'home',
    users: 'accounts',
    system: 'settings'
  });

  // WIREFRAME TAB 1: Content Management
  const contentSubTabs = [
    { id: 'home', label: 'Home Page', icon: Home, badge: undefined, component: <HomePageManager /> },
    { id: 'events', label: 'Events & Timeline', icon: Calendar, badge: undefined, component: <EventTimelineManager /> },
    { id: 'guest-dashboard', label: 'Guest Dashboard', icon: Heart, badge: undefined, component: <GuestContentManager /> },
    { id: 'social', label: 'Social Feed', icon: MessageSquare, badge: undefined, component: <div>Social Feed Management</div> },
    { id: 'gallery', label: 'Gallery', icon: Camera, badge: undefined, component: <div>Gallery Management</div> },
    { id: 'faq', label: 'FAQ Management', icon: HelpCircle, badge: undefined, component: <FAQManagement /> },
    { id: 'accommodation', label: 'Accommodation', icon: Building, badge: undefined, component: <AccommodationManager /> },
    { id: 'transport', label: 'Transportation', icon: Bus, badge: undefined, component: <TransportationManager /> }
  ];

  // WIREFRAME TAB 2: Users & RSVPs
  const usersSubTabs = [
    { 
      id: 'accounts', 
      label: 'User Accounts', 
      icon: Users, 
      badge: stats?.totalUsers?.toString(),
      component: <UnifiedAccountsManagement users={users} onRefresh={onRefresh} /> 
    },
    { 
      id: 'guestlist', 
      label: 'Guest List', 
      icon: UserPlus, 
      badge: stats?.totalRSVPs?.toString(),
      component: <WeddingGuestManagement onRefresh={onRefresh} /> 
    },
    { 
      id: 'rsvp', 
      label: 'RSVP Management', 
      icon: ClipboardList, 
      badge: `${Math.round((rsvps?.filter(r => r.status === 'attending').length || 0) / (stats?.totalRSVPs || 1) * 100)}%`,
      component: <EnhancedRSVPManagement rsvps={rsvps} onRefresh={onRefresh} /> 
    },
    { 
      id: 'seating', 
      label: 'Seating Plan', 
      icon: MapPin, 
      badge: undefined,
      component: <SeatingPlanManager /> 
    }
  ];

  // WIREFRAME TAB 3: System
  const systemSubTabs = [
    { id: 'settings', label: 'Settings', icon: Settings, badge: undefined, component: <CompactSystemSettings /> },
    { id: 'performance', label: 'Performance', icon: BarChart, badge: undefined, component: <EnhancedAnalytics /> },
    { id: 'security', label: 'Security & Backup', icon: Shield, badge: undefined, component: <AdvancedSecurity /> },
    { id: 'dev', label: 'Dev Tools', icon: Code, badge: undefined, component: <ProductionReadinessTest /> }
  ];

  const mainTabs = [
    {
      id: 'content',
      label: 'Content Management',
      icon: <FileText className="w-4 h-4" />,
      description: 'Home page, events, guest dashboard, social feed, gallery',
      subTabs: contentSubTabs
    },
    {
      id: 'users',
      label: 'Guest Management',
      icon: <Users className="w-4 h-4" />,
      badge: `${users?.length || 0} users`,
      subTabs: usersSubTabs
    },
    {
      id: 'system',
      label: 'System',
      icon: <Settings className="w-4 h-4" />,
      description: 'Settings, performance, security, development tools',
      subTabs: systemSubTabs
    }
  ];

  const getCurrentSubTabs = () => {
    const currentTab = mainTabs.find(tab => tab.id === activeTab);
    return currentTab?.subTabs || [];
  };

  const getCurrentComponent = () => {
    const currentSubTabs = getCurrentSubTabs();
    const currentSubTab = activeSubTab[activeTab];
    const selectedSubTab = currentSubTabs.find(subTab => subTab.id === currentSubTab);
    return selectedSubTab?.component || currentSubTabs[0]?.component;
  };

  const setSubTab = (subTabId: string) => {
    setActiveSubTab(prev => ({
      ...prev,
      [activeTab]: subTabId
    }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main Tab Navigation - Wireframe Style */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mainTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`h-auto p-6 flex flex-col items-start gap-3 text-left ${
                activeTab === tab.id 
                  ? 'bg-wedding-navy text-white' 
                  : 'glass-card hover:bg-wedding-navy/10'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="flex items-center gap-3 w-full">
                {tab.icon}
                <span className="font-semibold text-lg">{tab.label}</span>
                {tab.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {tab.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm opacity-80">{tab.description}</p>
            </Button>
          ))}
        </div>
      </div>

      {/* Sub-Tab Navigation - Wireframe Style */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {mainTabs.find(tab => tab.id === activeTab)?.icon}
            {mainTabs.find(tab => tab.id === activeTab)?.label} Management
          </CardTitle>
          {mainTabs.find(tab => tab.id === activeTab)?.description && (
            <p className="text-sm text-muted-foreground">
              {mainTabs.find(tab => tab.id === activeTab)?.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {getCurrentSubTabs().map((subTab) => {
              const IconComponent = subTab.icon;
              const isActive = activeSubTab[activeTab] === subTab.id;
              
              return (
                <Button
                  key={subTab.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-2 ${
                    isActive ? 'bg-wedding-navy text-white' : 'glass-secondary'
                  }`}
                  onClick={() => setSubTab(subTab.id)}
                >
                  <IconComponent className="w-4 h-4" />
                  {subTab.label}
                  {subTab.badge && (
                    <Badge variant="secondary" className="ml-1">
                      {subTab.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="h-full">
          {getCurrentComponent()}
        </div>
      </div>
    </div>
  );
};

export default WireframeAdminDashboard;