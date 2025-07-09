import React, { useState, lazy, Suspense } from 'react';
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

// Lazy load admin components
const AppSettingsManager = lazy(() => import('@/components/admin/AppSettingsManager'));
const CompactStats = lazy(() => import('@/components/admin/CompactStats'));
const EventTimeline = lazy(() => import('@/components/admin/EventTimeline'));
const UnifiedAccountsManagement = lazy(() => import('@/components/admin/UnifiedAccountsManagement'));
const WeddingGuestManagement = lazy(() => import('@/components/admin/WeddingGuestManagement'));
const EnhancedRSVPManagement = lazy(() => import('@/components/admin/EnhancedRSVPManagement'));
const ThemeCustomization = lazy(() => import('@/components/admin/ThemeCustomization'));
const BackgroundManager = lazy(() => import('@/components/admin/BackgroundManager'));
const FontManager = lazy(() => import('@/components/admin/FontManager'));
const AdvancedCommunicationCenter = lazy(() => import('@/components/admin/AdvancedCommunicationCenter'));
const NotificationCenter = lazy(() => import('@/components/admin/NotificationCenter'));
const EmailSystemManagement = lazy(() => import('@/components/admin/EmailSystemManagement'));
const EnhancedAnalytics = lazy(() => import('@/components/admin/EnhancedAnalytics'));
const AnalyticsInsights = lazy(() => import('@/components/admin/AnalyticsInsights'));
const PerformanceAnalytics = lazy(() => import('@/components/admin/PerformanceAnalytics'));
const CompactSystemSettings = lazy(() => import('@/components/admin/CompactSystemSettings'));
const AdvancedSecurity = lazy(() => import('@/components/admin/AdvancedSecurity'));
const BackupRecovery = lazy(() => import('@/components/admin/BackupRecovery'));
const SystemMonitoring = lazy(() => import('@/components/admin/SystemMonitoring'));
const ProductionReadinessTest = lazy(() => import('@/components/admin/ProductionReadinessTest'));
const DeploymentOptimization = lazy(() => import('@/components/admin/DeploymentOptimization'));
const RealTimeMonitoring = lazy(() => import('@/components/admin/RealTimeMonitoring'));
const PerformanceMonitor = lazy(() => import('@/components/monitoring/PerformanceMonitor').then(m => ({ default: m.PerformanceMonitor })));
const LiveMonitoring = lazy(() => import('@/components/monitoring/LiveMonitoring').then(m => ({ default: m.LiveMonitoring })));
const AdminFunctionalityTester = lazy(() => import('@/components/admin/AdminFunctionalityTester'));
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
    content: 'app-settings',
    users: 'accounts',
    design: 'themes',
    communication: 'messaging',
    analytics: 'insights',
    system: 'settings',
    development: 'testing',
    advanced: 'monitoring'
  });

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
    </div>
  );

  // Content Management Group
  const contentTabs = [
    { id: 'app-settings', label: 'App Settings', component: <Suspense fallback={<LoadingFallback />}><AppSettingsManager /></Suspense> },
    { id: 'timeline', label: 'Events', component: <Suspense fallback={<LoadingFallback />}><EventTimeline /></Suspense> },
    { id: 'stats', label: 'Overview', component: <Suspense fallback={<LoadingFallback />}><CompactStats stats={stats} /></Suspense> }
  ];

  // User & RSVP Management Group
  const userTabs = [
    { id: 'accounts', label: 'User Accounts', component: <Suspense fallback={<LoadingFallback />}><UnifiedAccountsManagement users={users} onRefresh={onRefresh} /></Suspense> },
    { id: 'guests', label: 'Guest Management', component: <Suspense fallback={<LoadingFallback />}><WeddingGuestManagement onRefresh={onRefresh} /></Suspense> },
    { id: 'rsvps', label: 'RSVPs', component: <Suspense fallback={<LoadingFallback />}><EnhancedRSVPManagement rsvps={rsvps} onRefresh={onRefresh} /></Suspense> }
  ];

  // Design & Themes Group
  const designTabs = [
    { id: 'themes', label: 'Theme Customization', component: <Suspense fallback={<LoadingFallback />}><ThemeCustomization /></Suspense> },
    { id: 'backgrounds', label: 'Backgrounds', component: <Suspense fallback={<LoadingFallback />}><BackgroundManager /></Suspense> },
    { id: 'fonts', label: 'Typography', component: <Suspense fallback={<LoadingFallback />}><FontManager /></Suspense> }
  ];

  // Communication Group
  const communicationTabs = [
    { id: 'messaging', label: 'Messages', component: <Suspense fallback={<LoadingFallback />}><AdvancedCommunicationCenter /></Suspense> },
    { id: 'notifications', label: 'Notifications', component: <Suspense fallback={<LoadingFallback />}><NotificationCenter /></Suspense> },
    { id: 'email', label: 'Email System', component: <Suspense fallback={<LoadingFallback />}><EmailSystemManagement /></Suspense> }
  ];

  // Analytics & Reports Group
  const analyticsTabs = [
    { id: 'insights', label: 'Analytics', component: <Suspense fallback={<LoadingFallback />}><EnhancedAnalytics /></Suspense> },
    { id: 'analytics-insights', label: 'Detailed Insights', component: <Suspense fallback={<LoadingFallback />}><AnalyticsInsights /></Suspense> },
    { id: 'performance-analytics', label: 'Performance', component: <Suspense fallback={<LoadingFallback />}><PerformanceAnalytics /></Suspense> }
  ];

  // System Management Group
  const systemTabs = [
    { id: 'settings', label: 'System Settings', component: <Suspense fallback={<LoadingFallback />}><CompactSystemSettings /></Suspense> },
    { id: 'security', label: 'Security', component: <Suspense fallback={<LoadingFallback />}><AdvancedSecurity /></Suspense> },
    { id: 'backup', label: 'Backup & Recovery', component: <Suspense fallback={<LoadingFallback />}><BackupRecovery /></Suspense> }
  ];

  // Development & Testing Group
  const developmentTabs = [
    { id: 'testing', label: 'Testing Suite', component: <Suspense fallback={<LoadingFallback />}><ProductionReadinessTest /></Suspense> },
    { id: 'functionality-test', label: 'Admin Function Tests', component: <Suspense fallback={<LoadingFallback />}><AdminFunctionalityTester /></Suspense> },
    { id: 'deployment', label: 'Deployment', component: <Suspense fallback={<LoadingFallback />}><DeploymentOptimization /></Suspense> },
    { id: 'system-monitor', label: 'System Monitor', component: <Suspense fallback={<LoadingFallback />}><SystemMonitoring /></Suspense> }
  ];

  // Advanced Features Group
  const advancedTabs = [
    { id: 'monitoring', label: 'Real-time Monitor', component: <Suspense fallback={<LoadingFallback />}><RealTimeMonitoring /></Suspense> },
    { id: 'performance', label: 'Performance Monitor', component: <Suspense fallback={<LoadingFallback />}><PerformanceMonitor /></Suspense> },
    { id: 'live-monitoring', label: 'Live Monitoring', component: <Suspense fallback={<LoadingFallback />}><LiveMonitoring /></Suspense> }
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
      description: 'Themes, backgrounds, fonts'
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