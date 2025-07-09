import React, { useState } from 'react';
import { SwipeableTabsNavigation } from '@/components/mobile/SwipeableTabsNavigation';
import CompactStats from '@/components/admin/CompactStats';
import UnifiedAccountsManagement from '@/components/admin/UnifiedAccountsManagement';
import WeddingGuestManagement from '@/components/admin/WeddingGuestManagement';
import EnhancedPhotoModeration from '@/components/admin/EnhancedPhotoModeration';
import EnhancedRSVPManagement from '@/components/admin/EnhancedRSVPManagement';
import CompactGiftManagement from '@/components/admin/CompactGiftManagement';
import CompactSystemSettings from '@/components/admin/CompactSystemSettings';
import AnalyticsInsights from '@/components/admin/AnalyticsInsights';
import EnhancedAnalytics from '@/components/admin/EnhancedAnalytics';
import { AdvancedAnalytics } from '@/components/analytics/AdvancedAnalytics';
import ThemeCustomization from '@/components/admin/ThemeCustomization';
import EventTimeline from '@/components/admin/EventTimeline';
import NotificationCenter from '@/components/admin/NotificationCenter';
import EnhancedMediaManagement from '@/components/admin/EnhancedMediaManagement';
import SystemMonitoring from '@/components/admin/SystemMonitoring';
import EmailSystemManagement from '@/components/admin/EmailSystemManagement';
import ProductionReadinessTest from '@/components/admin/ProductionReadinessTest';
import { ProductionReadinessCheck } from '@/components/testing/ProductionReadinessCheck';
import DeploymentOptimization from '@/components/admin/DeploymentOptimization';
import RealTimeMonitoring from '@/components/admin/RealTimeMonitoring';
import AdvancedSecurity from '@/components/admin/AdvancedSecurity';
import BackupRecovery from '@/components/admin/BackupRecovery';
import PerformanceAnalytics from '@/components/admin/PerformanceAnalytics';
import { PerformanceMonitor } from '@/components/monitoring/PerformanceMonitor';
import AdvancedCommunicationCenter from '@/components/admin/AdvancedCommunicationCenter';
import { SEOOptimizer } from '@/components/optimization/SEOOptimizer';
import { SystemTest } from '@/components/test/SystemTest';
import { ProductionLaunch } from '@/components/deployment/ProductionLaunch';
import { LiveMonitoring } from '@/components/monitoring/LiveMonitoring';
import { UserFeedbackSystem } from '@/components/feedback/UserFeedbackSystem';
import { UserAnalytics } from '@/components/analytics/UserAnalytics';
import AppSettingsManager from '@/components/admin/AppSettingsManager';
import type { AdminStats, User, RSVP, Photo } from './types';

interface AdminDashboardContentProps {
  stats: AdminStats;
  users: User[];
  rsvps: RSVP[];
  photos: Photo[];
  onRefresh: () => void;
}

const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({
  stats,
  users,
  rsvps,
  photos,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState('stats');

  const adminTabs = [
    // Core Management
    { 
      id: 'app-settings', 
      label: 'App Settings',
      component: <AppSettingsManager />
    },
    { 
      id: 'stats', 
      label: 'Overview',
      component: <CompactStats stats={stats} />
    },
    
    // Content Management
    { 
      id: 'accounts', 
      label: 'Users',
      component: <UnifiedAccountsManagement users={users} onRefresh={onRefresh} />
    },
    { 
      id: 'rsvps', 
      label: 'RSVPs',
      component: <EnhancedRSVPManagement rsvps={rsvps} onRefresh={onRefresh} />
    },
    { 
      id: 'media', 
      label: 'Photos',
      component: <EnhancedMediaManagement />
    },
    { 
      id: 'gifts', 
      label: 'Gifts',
      component: <CompactGiftManagement />
    },
    { 
      id: 'timeline', 
      label: 'Events',
      component: <EventTimeline />
    },
    
    // Design & Themes
    { 
      id: 'themes', 
      label: 'Design',
      component: <ThemeCustomization />
    },
    
    // Analytics & Insights
    { 
      id: 'analytics', 
      label: 'Analytics',
      component: <EnhancedAnalytics />
    },
    { 
      id: 'user-analytics', 
      label: 'User Data',
      component: <UserAnalytics />
    },
    { 
      id: 'advanced-analytics', 
      label: 'Advanced',
      component: <AdvancedAnalytics />
    },
    
    // Communication
    { 
      id: 'communication', 
      label: 'Messages',
      component: <AdvancedCommunicationCenter />
    },
    { 
      id: 'email', 
      label: 'Email',
      component: <EmailSystemManagement />
    },
    { 
      id: 'user-feedback', 
      label: 'Feedback',
      component: <UserFeedbackSystem />
    },
    
    // System & Performance
    { 
      id: 'system', 
      label: 'System',
      component: <SystemMonitoring />
    },
    { 
      id: 'performance', 
      label: 'Performance',
      component: <PerformanceMonitor />
    },
    { 
      id: 'monitoring', 
      label: 'Monitoring',
      component: <RealTimeMonitoring />
    },
    { 
      id: 'live-monitoring', 
      label: 'Live Monitor',
      component: <LiveMonitoring />
    },
    
    // Security & Backup
    { 
      id: 'security', 
      label: 'Security',
      component: <AdvancedSecurity />
    },
    { 
      id: 'backup', 
      label: 'Backup',
      component: <BackupRecovery />
    },
    
    // Development & Testing
    { 
      id: 'testing', 
      label: 'Testing',
      component: <ProductionReadinessTest />
    },
    { 
      id: 'prod-ready', 
      label: 'Prod Check',
      component: <ProductionReadinessCheck />
    },
    { 
      id: 'system-test', 
      label: 'Test Suite',
      component: <SystemTest />
    },
    
    // Deployment & SEO
    { 
      id: 'deployment', 
      label: 'Deploy',
      component: <DeploymentOptimization />
    },
    { 
      id: 'production-launch', 
      label: 'Launch',
      component: <ProductionLaunch />
    },
    { 
      id: 'seo', 
      label: 'SEO',
      component: <SEOOptimizer />
    },
    
    // System Settings
    { 
      id: 'settings', 
      label: 'System Config',
      component: <CompactSystemSettings />
    },
  ];

  return (
    <div className="h-full">
      <SwipeableTabsNavigation
        tabs={adminTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default AdminDashboardContent;