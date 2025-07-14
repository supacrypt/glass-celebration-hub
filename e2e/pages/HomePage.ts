import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly countdownSection: Locator;
  readonly eventsSection: Locator;
  readonly rsvpButton: Locator;
  readonly navigationMenu: Locator;
  readonly galleryLink: Locator;
  readonly venueLink: Locator;
  readonly accommodationLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('[data-testid="hero-section"], .hero-section, section').first();
    this.countdownSection = page.locator('[data-testid="countdown-section"], .countdown-section');
    this.eventsSection = page.locator('[data-testid="events-section"], .events-section');
    this.rsvpButton = page.locator('[data-testid="rsvp-button"], .rsvp-button, a[href*="rsvp"]').first();
    this.navigationMenu = page.locator('nav, [data-testid="navigation"]');
    this.galleryLink = page.locator('a[href*="gallery"], a[href="/gallery"]');
    this.venueLink = page.locator('a[href*="venue"], a[href="/venue"]');
    this.accommodationLink = page.locator('a[href*="accommodation"], a[href="/accommodation"]');
  }

  async goto() {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  async validateHeroSection() {
    await expect(this.heroSection).toBeVisible();
    
    // Check for essential hero elements
    const heroTitle = this.page.locator('h1, .hero-title, [data-testid="hero-title"]').first();
    await expect(heroTitle).toBeVisible();
    
    // Check for background image or hero image
    const heroImage = this.page.locator('.hero-image, [data-testid="hero-image"], img').first();
    if (await heroImage.count() > 0) {
      await expect(heroImage).toBeVisible();
    }
  }

  async validateCountdown() {
    if (await this.countdownSection.count() > 0) {
      await expect(this.countdownSection).toBeVisible();
      
      // Check for countdown elements (days, hours, minutes, seconds)
      const countdownNumbers = this.page.locator('.countdown-number, [data-testid="countdown-number"]');
      if (await countdownNumbers.count() > 0) {
        await expect(countdownNumbers.first()).toBeVisible();
      }
    }
  }

  async validateEventsSection() {
    if (await this.eventsSection.count() > 0) {
      await expect(this.eventsSection).toBeVisible();
      
      // Check for event cards or items
      const eventItems = this.page.locator('.event-item, .event-card, [data-testid="event-item"]');
      if (await eventItems.count() > 0) {
        await expect(eventItems.first()).toBeVisible();
      }
    }
  }

  async validateNavigation() {
    await expect(this.navigationMenu).toBeVisible();
    
    // Check for main navigation links
    const navLinks = this.navigationMenu.locator('a');
    await expect(navLinks.first()).toBeVisible();
  }

  async clickRSVP() {
    if (await this.rsvpButton.count() > 0) {
      await this.rsvpButton.click();
      await this.waitForNetworkIdle();
    }
  }

  async navigateToGallery() {
    if (await this.galleryLink.count() > 0) {
      await this.galleryLink.click();
      await this.waitForNetworkIdle();
    }
  }

  async navigateToVenue() {
    if (await this.venueLink.count() > 0) {
      await this.venueLink.click();
      await this.waitForNetworkIdle();
    }
  }

  async navigateToAccommodation() {
    if (await this.accommodationLink.count() > 0) {
      await this.accommodationLink.click();
      await this.waitForNetworkIdle();
    }
  }

  async validatePageElements() {
    await this.validateHeroSection();
    await this.validateNavigation();
    await this.validateCountdown();
    await this.validateEventsSection();
  }

  async checkResponsiveDesign() {
    // Test mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.validatePageElements();
    
    // Test tablet viewport
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.validatePageElements();
    
    // Test desktop viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.validatePageElements();
  }
}