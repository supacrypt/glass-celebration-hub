import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RSVPPage extends BasePage {
  readonly rsvpForm: Locator;
  readonly attendingYes: Locator;
  readonly attendingNo: Locator;
  readonly guestNameInput: Locator;
  readonly emailInput: Locator;
  readonly dietaryRequirements: Locator;
  readonly plusOneSection: Locator;
  readonly submitButton: Locator;
  readonly confirmationMessage: Locator;
  readonly errorMessage: Locator;
  readonly accommodationSection: Locator;
  readonly transportSection: Locator;

  constructor(page: Page) {
    super(page);
    this.rsvpForm = page.locator('[data-testid="rsvp-form"], .rsvp-form, form').first();
    this.attendingYes = page.locator('input[value="yes"], button:has-text("Yes"), [data-testid="attending-yes"]');
    this.attendingNo = page.locator('input[value="no"], button:has-text("No"), [data-testid="attending-no"]');
    this.guestNameInput = page.locator('input[name="name"], input[name="guestName"], [data-testid="guest-name"]');
    this.emailInput = page.locator('input[type="email"], input[name="email"], [data-testid="email"]');
    this.dietaryRequirements = page.locator('textarea[name="dietary"], select[name="dietary"], [data-testid="dietary-requirements"]');
    this.plusOneSection = page.locator('.plus-one, [data-testid="plus-one-section"]');
    this.submitButton = page.locator('button[type="submit"], button:has-text("Submit"), [data-testid="submit-rsvp"]');
    this.confirmationMessage = page.locator('.confirmation, .success, [data-testid="confirmation-message"]');
    this.errorMessage = page.locator('.error, .alert-error, [data-testid="error-message"]');
    this.accommodationSection = page.locator('.accommodation, [data-testid="accommodation-section"]');
    this.transportSection = page.locator('.transport, [data-testid="transport-section"]');
  }

  async goto() {
    await super.goto('/rsvp');
    await this.waitForPageLoad();
  }

  async validateRSVPForm() {
    await expect(this.rsvpForm).toBeVisible();
    await expect(this.attendingYes).toBeVisible();
    await expect(this.attendingNo).toBeVisible();
  }

  async selectAttending(attending: boolean) {
    if (attending) {
      await this.attendingYes.click();
    } else {
      await this.attendingNo.click();
    }
    await this.page.waitForTimeout(500); // Wait for form updates
  }

  async fillGuestDetails(name: string, email: string) {
    if (await this.guestNameInput.count() > 0) {
      await this.guestNameInput.fill(name);
    }
    if (await this.emailInput.count() > 0) {
      await this.emailInput.fill(email);
    }
  }

  async fillDietaryRequirements(requirements: string) {
    if (await this.dietaryRequirements.count() > 0) {
      await this.dietaryRequirements.fill(requirements);
    }
  }

  async addPlusOne(name: string, email?: string) {
    if (await this.plusOneSection.count() > 0) {
      const addPlusOneButton = this.page.locator('button:has-text("Add"), [data-testid="add-plus-one"]');
      if (await addPlusOneButton.count() > 0) {
        await addPlusOneButton.click();
        
        const plusOneName = this.page.locator('input[name*="plusOne"], [data-testid="plus-one-name"]').last();
        await plusOneName.fill(name);
        
        if (email) {
          const plusOneEmail = this.page.locator('input[name*="plusOneEmail"], [data-testid="plus-one-email"]').last();
          if (await plusOneEmail.count() > 0) {
            await plusOneEmail.fill(email);
          }
        }
      }
    }
  }

  async submitRSVP() {
    await this.submitButton.click();
    await this.waitForNetworkIdle();
  }

  async completeRSVP(data: {
    attending: boolean;
    name?: string;
    email?: string;
    dietary?: string;
    plusOne?: { name: string; email?: string };
  }) {
    await this.selectAttending(data.attending);
    
    if (data.attending) {
      if (data.name) await this.fillGuestDetails(data.name, data.email || '');
      if (data.dietary) await this.fillDietaryRequirements(data.dietary);
      if (data.plusOne) await this.addPlusOne(data.plusOne.name, data.plusOne.email);
    }
    
    await this.submitRSVP();
  }

  async validateConfirmation() {
    await expect(this.confirmationMessage).toBeVisible();
    const confirmationText = await this.confirmationMessage.textContent();
    return confirmationText;
  }

  async checkForErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    if (await this.errorMessage.count() > 0) {
      const errorTexts = await this.errorMessage.allTextContents();
      errors.push(...errorTexts);
    }
    
    return errors;
  }

  async validateAccommodationIntegration() {
    if (await this.accommodationSection.count() > 0) {
      await expect(this.accommodationSection).toBeVisible();
      
      const accommodationOptions = this.page.locator('.accommodation-option, [data-testid="accommodation-option"]');
      if (await accommodationOptions.count() > 0) {
        await expect(accommodationOptions.first()).toBeVisible();
      }
    }
  }

  async validateTransportIntegration() {
    if (await this.transportSection.count() > 0) {
      await expect(this.transportSection).toBeVisible();
      
      const transportOptions = this.page.locator('.transport-option, [data-testid="transport-option"]');
      if (await transportOptions.count() > 0) {
        await expect(transportOptions.first()).toBeVisible();
      }
    }
  }

  async checkRSVPHistory() {
    const historySection = this.page.locator('.rsvp-history, [data-testid="rsvp-history"]');
    if (await historySection.count() > 0) {
      await expect(historySection).toBeVisible();
    }
  }

  async validateFormValidation() {
    // Test submitting without required fields
    await this.selectAttending(true);
    await this.submitRSVP();
    
    const validationErrors = this.page.locator('.validation-error, .invalid-feedback, [aria-invalid="true"]');
    if (await validationErrors.count() > 0) {
      await expect(validationErrors.first()).toBeVisible();
    }
  }

  async checkSupabaseIntegration() {
    const rsvpRequests: string[] = [];
    
    this.page.on('request', request => {
      const url = request.url();
      if (url.includes('/rest/v1/rsvps') || url.includes('/rest/v1/guests')) {
        rsvpRequests.push(url);
      }
    });

    return rsvpRequests;
  }

  async validateResponseAfterSubmission() {
    // After RSVP submission, check for proper response
    const currentUrl = this.page.url();
    const hasConfirmation = await this.confirmationMessage.count() > 0;
    const hasErrors = await this.errorMessage.count() > 0;
    
    return {
      url: currentUrl,
      hasConfirmation,
      hasErrors,
      redirected: !currentUrl.includes('/rsvp') || currentUrl.includes('success') || currentUrl.includes('confirmation')
    };
  }
}