import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly dashboardContainer: Locator;
  readonly adminStats: Locator;
  readonly guestList: Locator;
  readonly messageCenter: Locator;
  readonly analyticsSection: Locator;
  readonly rsvpManagement: Locator;
  readonly photoModeration: Locator;
  readonly userManagement: Locator;
  readonly eventManagement: Locator;
  readonly sidebar: Locator;
  readonly mainContent: Locator;
  readonly navigationTabs: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardContainer = page.locator('[data-testid="dashboard"], .dashboard, .admin-dashboard').first();
    this.adminStats = page.locator('[data-testid="admin-stats"], .admin-stats, .stats-section');
    this.guestList = page.locator('[data-testid="guest-list"], .guest-list');
    this.messageCenter = page.locator('[data-testid="message-center"], .message-center');
    this.analyticsSection = page.locator('[data-testid="analytics"], .analytics-section');
    this.rsvpManagement = page.locator('[data-testid="rsvp-management"], .rsvp-management');
    this.photoModeration = page.locator('[data-testid="photo-moderation"], .photo-moderation');
    this.userManagement = page.locator('[data-testid="user-management"], .user-management');
    this.eventManagement = page.locator('[data-testid="event-management"], .event-management');
    this.sidebar = page.locator('.sidebar, [data-testid="sidebar"], nav');
    this.mainContent = page.locator('.main-content, [data-testid="main-content"], main');
    this.navigationTabs = page.locator('.nav-tabs, [data-testid="nav-tabs"], .navigation-tabs');
  }

  async goto() {
    await super.goto('/dashboard');
    await this.waitForPageLoad();
  }

  async gotoAdmin() {
    await super.goto('/dashboard/admin');
    await this.waitForPageLoad();
  }

  async gotoUsers() {
    await super.goto('/dashboard/users');
    await this.waitForPageLoad();
  }

  async gotoAnalytics() {
    await super.goto('/dashboard/analytics');
    await this.waitForPageLoad();
  }

  async gotoMessages() {
    await super.goto('/dashboard/messages');
    await this.waitForPageLoad();
  }

  async gotoPhotos() {
    await super.goto('/dashboard/photos');
    await this.waitForPageLoad();
  }

  async gotoEvents() {
    await super.goto('/dashboard/events');
    await this.waitForPageLoad();
  }

  async gotoRSVPs() {
    await super.goto('/dashboard/rsvps');
    await this.waitForPageLoad();
  }

  async validateDashboardLayout() {
    await expect(this.dashboardContainer).toBeVisible();
    
    // Check for main layout elements
    if (await this.sidebar.count() > 0) {
      await expect(this.sidebar).toBeVisible();
    }
    
    if (await this.mainContent.count() > 0) {
      await expect(this.mainContent).toBeVisible();
    }
  }

  async validateAdminStats() {
    if (await this.adminStats.count() > 0) {
      await expect(this.adminStats).toBeVisible();
      
      // Check for stat cards or metrics
      const statCards = this.page.locator('.stat-card, .metric-card, [data-testid="stat-card"]');
      if (await statCards.count() > 0) {
        await expect(statCards.first()).toBeVisible();
      }
    }
  }

  async validateGuestList() {
    if (await this.guestList.count() > 0) {
      await expect(this.guestList).toBeVisible();
      
      // Check for guest items
      const guestItems = this.page.locator('.guest-item, [data-testid="guest-item"], tr');
      if (await guestItems.count() > 0) {
        await expect(guestItems.first()).toBeVisible();
      }
    }
  }

  async validateMessageCenter() {
    if (await this.messageCenter.count() > 0) {
      await expect(this.messageCenter).toBeVisible();
      
      // Check for message items
      const messageItems = this.page.locator('.message-item, [data-testid="message-item"]');
      if (await messageItems.count() > 0) {
        await expect(messageItems.first()).toBeVisible();
      }
    }
  }

  async validateAnalytics() {
    if (await this.analyticsSection.count() > 0) {
      await expect(this.analyticsSection).toBeVisible();
      
      // Check for charts or analytics widgets
      const charts = this.page.locator('.chart, canvas, svg, [data-testid="chart"]');
      if (await charts.count() > 0) {
        await expect(charts.first()).toBeVisible();
      }
    }
  }

  async validateRSVPManagement() {
    if (await this.rsvpManagement.count() > 0) {
      await expect(this.rsvpManagement).toBeVisible();
      
      // Check for RSVP items or filters
      const rsvpItems = this.page.locator('.rsvp-item, [data-testid="rsvp-item"]');
      const rsvpFilters = this.page.locator('.rsvp-filters, [data-testid="rsvp-filters"]');
      
      if (await rsvpItems.count() > 0) {
        await expect(rsvpItems.first()).toBeVisible();
      }
      
      if (await rsvpFilters.count() > 0) {
        await expect(rsvpFilters).toBeVisible();
      }
    }
  }

  async validatePhotoModeration() {
    if (await this.photoModeration.count() > 0) {
      await expect(this.photoModeration).toBeVisible();
      
      // Check for photo items
      const photoItems = this.page.locator('.photo-item, [data-testid="photo-item"], img');
      if (await photoItems.count() > 0) {
        await expect(photoItems.first()).toBeVisible();
      }
    }
  }

  async validateUserManagement() {
    if (await this.userManagement.count() > 0) {
      await expect(this.userManagement).toBeVisible();
      
      // Check for user items or table
      const userItems = this.page.locator('.user-item, [data-testid="user-item"], tr');
      if (await userItems.count() > 0) {
        await expect(userItems.first()).toBeVisible();
      }
    }
  }

  async validateEventManagement() {
    if (await this.eventManagement.count() > 0) {
      await expect(this.eventManagement).toBeVisible();
      
      // Check for event items or timeline
      const eventItems = this.page.locator('.event-item, [data-testid="event-item"]');
      const timeline = this.page.locator('.timeline, [data-testid="timeline"]');
      
      if (await eventItems.count() > 0) {
        await expect(eventItems.first()).toBeVisible();
      }
      
      if (await timeline.count() > 0) {
        await expect(timeline).toBeVisible();
      }
    }
  }

  async navigateToSection(section: string) {
    const navLink = this.page.locator(`a[href*="${section}"], button:has-text("${section}"), [data-testid="nav-${section}"]`);
    if (await navLink.count() > 0) {
      await navLink.click();
      await this.waitForNetworkIdle();
    }
  }

  async checkDataLoading() {
    // Check for loading states
    const loadingIndicators = this.page.locator('.loading, .spinner, [data-testid="loading"]');
    
    // Wait for loading to complete
    if (await loadingIndicators.count() > 0) {
      await expect(loadingIndicators.first()).toBeHidden({ timeout: 10000 });
    }
    
    // Ensure data is loaded
    await this.waitForNetworkIdle();
  }

  async validateRealTimeFeatures() {
    // Check for real-time indicators
    const realtimeIndicators = this.page.locator('.realtime, .live, [data-testid="realtime-indicator"]');
    if (await realtimeIndicators.count() > 0) {
      await expect(realtimeIndicators.first()).toBeVisible();
    }
  }

  async checkSupabaseDataIntegration() {
    const dataRequests: string[] = [];
    
    this.page.on('request', request => {
      const url = request.url();
      if (url.includes('/rest/v1/') && 
          (url.includes('guests') || url.includes('rsvps') || url.includes('messages') || 
           url.includes('photos') || url.includes('profiles') || url.includes('wedding_events'))) {
        dataRequests.push(url);
      }
    });

    return dataRequests;
  }

  async validatePermissions() {
    // Check for admin-only elements
    const adminOnlyElements = this.page.locator('[data-admin-only], .admin-only');
    
    if (await adminOnlyElements.count() > 0) {
      // Should be visible if user has admin permissions
      const isVisible = await adminOnlyElements.first().isVisible();
      return { hasAdminElements: true, adminElementsVisible: isVisible };
    }
    
    return { hasAdminElements: false, adminElementsVisible: false };
  }

  async testResponsiveDashboard() {
    // Test mobile view
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.validateDashboardLayout();
    
    // Test tablet view
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.validateDashboardLayout();
    
    // Test desktop view
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.validateDashboardLayout();
  }
}