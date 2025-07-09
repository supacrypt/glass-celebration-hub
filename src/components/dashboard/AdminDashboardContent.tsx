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
    { 
      id: 'stats', 
      label: 'Stats',
      component: <CompactStats stats={stats} />
    },
    { 
      id: 'accounts', 
      label: 'Accounts',
      component: <UnifiedAccountsManagement users={users} onRefresh={onRefresh} />
    },
    { 
      id: 'media', 
      label: 'Media',
      component: <EnhancedMediaManagement />
    },
    { 
      id: 'gifts', 
      label: 'Gifts',
      component: <CompactGiftManagement />
    },
    { 
      id: 'rsvps', 
      label: 'RSVPs',
      component: <EnhancedRSVPManagement rsvps={rsvps} onRefresh={onRefresh} />
    },
    { 
      id: 'analytics', 
      label: 'Analytics',
      component: <EnhancedAnalytics />
    },
    { 
      id: 'advanced-analytics', 
      label: 'Analytics+',
      component: <AdvancedAnalytics />
    },
    { 
      id: 'timeline', 
      label: 'Timeline',
      component: <EventTimeline />
    },
    { 
      id: 'themes', 
      label: 'Themes',
      component: <ThemeCustomization />
    },
    { 
      id: 'system', 
      label: 'System',
      component: <SystemMonitoring />
    },
    { 
      id: 'performance', 
      label: 'Perf',
      component: <PerformanceMonitor />
    },
    { 
      id: 'email', 
      label: 'Email',
      component: <EmailSystemManagement />
    },
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
      id: 'deployment', 
      label: 'Deploy',
      component: <DeploymentOptimization />
    },
    { 
      id: 'seo', 
      label: 'SEO',
      component: <SEOOptimizer />
    },
    { 
      id: 'settings', 
      label: 'Settings',
      component: <CompactSystemSettings />
    },
    // Phase 6: Advanced Admin Features
    { 
      id: 'monitoring', 
      label: 'Monitor',
      component: <RealTimeMonitoring />
    },
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
    { 
      id: 'performance-analytics', 
      label: 'Perf+',
      component: <PerformanceAnalytics />
    },
    { 
      id: 'communication', 
      label: 'Comm',
      component: <AdvancedCommunicationCenter />
    },
    // Phase 9: Final Integration, Testing & Deployment Readiness
    { 
      id: 'system-test', 
      label: 'Test Suite',
      component: <SystemTest />
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