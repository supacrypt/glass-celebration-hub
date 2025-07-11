import React, { useState } from 'react';
import { SwipeableTabsNavigation } from '@/components/mobile/SwipeableTabsNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Users, 
  Palette, 
  MessageSquare, 
  BarChart, 
  Settings, 
  Code, 
  Zap 
} from 'lucide-react';

// Import existing components
import AppSettingsManager from '@/components/admin/AppSettingsManager';
import CompactStats from '@/components/admin/CompactStats';
// import EventTimeline from '@/components/admin/EventTimeline'; // Replaced by GuestContentManager
import UnifiedAccountsManagement from '@/components/admin/UnifiedAccountsManagement';
import WeddingGuestManagement from '@/components/admin/WeddingGuestManagement';
import EnhancedRSVPManagement from '@/components/admin/EnhancedRSVPManagement';
import ThemeCustomization from '@/components/admin/ThemeCustomization';
import FontManager from '@/components/admin/FontManager';
import AdvancedCommunicationCenter from '@/components/admin/AdvancedCommunicationCenter';
import NotificationCenter from '@/components/admin/NotificationCenter';
import EmailSystemManagement from '@/components/admin/EmailSystemManagement';
import EnhancedAnalytics from '@/components/admin/EnhancedAnalytics';
import AnalyticsInsights from '@/components/admin/AnalyticsInsights';
import PerformanceAnalytics from '@/components/admin/PerformanceAnalytics';
import CompactSystemSettings from '@/components/admin/CompactSystemSettings';
import AdvancedSecurity from '@/components/admin/AdvancedSecurity';
import BackupRecovery from '@/components/admin/BackupRecovery';
import SystemMonitoring from '@/components/admin/SystemMonitoring';
import ProductionReadinessTest from '@/components/admin/ProductionReadinessTest';
import DeploymentOptimization from '@/components/admin/DeploymentOptimization';
import RealTimeMonitoring from '@/components/admin/RealTimeMonitoring';
import { PerformanceMonitor } from '@/components/monitoring/PerformanceMonitor';
import { LiveMonitoring } from '@/components/monitoring/LiveMonitoring';
import AdminFunctionalityTester from '@/components/admin/AdminFunctionalityTester';
import FAQManagement from '@/components/admin/FAQManagement/FAQManagement';
import GuestContentManager from '@/components/admin/GuestContentManager';
import type { AdminStats, User, RSVP, Photo } from './types';

interface ConsolidatedAdminDashboardProps {
  stats: AdminStats;
  users: User[];
  rsvps: RSVP[];
  photos: Photo[];
  onRefresh: () => void;
}

const ConsolidatedAdminDashboard: React.FC<ConsolidatedAdminDashboardProps> = ({
  stats,
  users,
  rsvps,
  photos,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [activeSubTab, setActiveSubTab] = useState<Record<string, string>>({
    content: 'guest-content',
    users: 'accounts',
    design: 'themes',
    communication: 'messaging',
    analytics: 'insights',
    system: 'settings',
    development: 'testing',
    advanced: 'monitoring'
  });

  // Content Management Group
  const contentTabs = [
    { id: 'guest-content', label: 'Guest Experience', component: <GuestContentManager /> },
    { id: 'app-settings', label: 'App Settings', component: <AppSettingsManager /> },
    { id: 'faq', label: 'FAQ Management', component: <FAQManagement /> },
    { id: 'stats', label: 'Overview', component: <CompactStats stats={stats} /> }
  ];

  // User & RSVP Management Group
  const userTabs = [
    { id: 'accounts', label: 'User Accounts', component: <UnifiedAccountsManagement users={users} onRefresh={onRefresh} /> },
    { id: 'guests', label: 'Guest Management', component: <WeddingGuestManagement onRefresh={onRefresh} /> },
    { id: 'rsvps', label: 'RSVPs', component: <EnhancedRSVPManagement rsvps={rsvps} onRefresh={onRefresh} /> }
  ];

  // Design & Themes Group
  const designTabs = [
    { id: 'themes', label: 'Theme Customization', component: <ThemeCustomization /> },
    { id: 'fonts', label: 'Typography', component: <FontManager /> }
  ];

  // Communication Group
  const communicationTabs = [
    { id: 'messaging', label: 'Messages', component: <AdvancedCommunicationCenter /> },
    { id: 'notifications', label: 'Notifications', component: <NotificationCenter /> },
    { id: 'email', label: 'Email System', component: <EmailSystemManagement /> }
  ];

  // Analytics & Reports Group
  const analyticsTabs = [
    { id: 'insights', label: 'Analytics', component: <EnhancedAnalytics /> },
    { id: 'analytics-insights', label: 'Detailed Insights', component: <AnalyticsInsights /> },
    { id: 'performance-analytics', label: 'Performance', component: <PerformanceAnalytics /> }
  ];

  // System Management Group
  const systemTabs = [
    { id: 'settings', label: 'System Settings', component: <CompactSystemSettings /> },
    { id: 'security', label: 'Security', component: <AdvancedSecurity /> },
    { id: 'backup', label: 'Backup & Recovery', component: <BackupRecovery /> }
  ];

  // Development & Testing Group
  const developmentTabs = [
    { id: 'testing', label: 'Testing Suite', component: <ProductionReadinessTest /> },
    { id: 'functionality-test', label: 'Admin Function Tests', component: <AdminFunctionalityTester /> },
    { id: 'deployment', label: 'Deployment', component: <DeploymentOptimization /> },
    { id: 'system-monitor', label: 'System Monitor', component: <SystemMonitoring /> }
  ];

  // Advanced Features Group
  const advancedTabs = [
    { id: 'monitoring', label: 'Real-time Monitor', component: <RealTimeMonitoring /> },
    { id: 'performance', label: 'Performance Monitor', component: <PerformanceMonitor /> },
    { id: 'live-monitoring', label: 'Live Monitoring', component: <LiveMonitoring /> }
  ];

  const getTabsForGroup = (groupId: string) => {
    switch (groupId) {
      case 'content': return contentTabs;
      case 'users': return userTabs;
      case 'design': return designTabs;
      case 'communication': return communicationTabs;
      case 'analytics': return analyticsTabs;
      case 'system': return systemTabs;
      case 'development': return developmentTabs;
      case 'advanced': return advancedTabs;
      default: return contentTabs;
    }
  };

  const getCurrentComponent = () => {
    const currentTabs = getTabsForGroup(activeTab);
    const currentSubTab = activeSubTab[activeTab];
    const selectedTab = currentTabs.find(tab => tab.id === currentSubTab);
    return selectedTab?.component || currentTabs[0]?.component;
  };

  const mainTabs = [
    {
      id: 'content',
      label: 'Content',
      icon: <FileText className="w-4 h-4" />,
      description: 'App settings, events, welcome messages'
    },
    {
      id: 'users',
      label: 'Users & RSVPs',
      icon: <Users className="w-4 h-4" />,
      description: 'Guest management, RSVPs, accounts'
    },
    {
      id: 'design',
      label: 'Design',
      icon: <Palette className="w-4 h-4" />,
      description: 'Themes, typography, appearance'
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: <MessageSquare className="w-4 h-4" />,
      description: 'Messages, notifications, email'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart className="w-4 h-4" />,
      description: 'Insights, reports, performance'
    },
    {
      id: 'system',
      label: 'System',
      icon: <Settings className="w-4 h-4" />,
      description: 'Settings, security, backup'
    },
    {
      id: 'development',
      label: 'Development',
      icon: <Code className="w-4 h-4" />,
      description: 'Testing, deployment, debugging'
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: <Zap className="w-4 h-4" />,
      description: 'Monitoring, optimization'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Main Category Navigation */}
      <div className="mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {mainTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`h-auto p-3 flex flex-col items-center gap-1 text-xs ${
                activeTab === tab.id 
                  ? 'bg-wedding-navy text-white' 
                  : 'glass-card hover:bg-wedding-navy/10'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Sub-category Navigation */}
      <div className="mb-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              {mainTabs.find(tab => tab.id === activeTab)?.icon}
              {mainTabs.find(tab => tab.id === activeTab)?.label} Management
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {mainTabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {getTabsForGroup(activeTab).map((subTab) => (
                <Button
                  key={subTab.id}
                  variant={activeSubTab[activeTab] === subTab.id ? "default" : "outline"}
                  size="sm"
                  className={activeSubTab[activeTab] === subTab.id ? 'bg-wedding-navy text-white' : 'glass-secondary'}
                  onClick={() => setActiveSubTab(prev => ({ ...prev, [activeTab]: subTab.id }))}
                >
                  {subTab.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto max-h-[calc(100vh-200px)] pb-20">
        <div className="h-full">
          {getCurrentComponent()}
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedAdminDashboard;