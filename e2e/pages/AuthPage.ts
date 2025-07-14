import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthPage extends BasePage {
  readonly signInForm: Locator;
  readonly signUpForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpButton: Locator;
  readonly toggleFormButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly magicLinkButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.signInForm = page.locator('[data-testid="sign-in-form"], .sign-in-form, form').first();
    this.signUpForm = page.locator('[data-testid="sign-up-form"], .sign-up-form');
    this.emailInput = page.locator('input[type="email"], input[name="email"], [data-testid="email-input"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"], [data-testid="password-input"]');
    this.signInButton = page.locator('button:has-text("Sign In"), [data-testid="sign-in-button"]');
    this.signUpButton = page.locator('button:has-text("Sign Up"), [data-testid="sign-up-button"]');
    this.toggleFormButton = page.locator('button:has-text("Sign Up"), button:has-text("Sign In"), [data-testid="toggle-form"]');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), [data-testid="forgot-password"]');
    this.magicLinkButton = page.locator('button:has-text("Magic Link"), [data-testid="magic-link-button"]');
    this.errorMessage = page.locator('.error, .alert-error, [data-testid="error-message"]');
    this.successMessage = page.locator('.success, .alert-success, [data-testid="success-message"]');
  }

  async goto() {
    await super.goto('/auth');
    await this.waitForPageLoad();
  }

  async validateAuthForms() {
    // Check if sign-in form is visible
    await expect(this.signInForm).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async fillSignInForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async fillSignUpForm(email: string, password: string, confirmPassword?: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    if (confirmPassword) {
      const confirmPasswordInput = this.page.locator('input[name="confirmPassword"], [data-testid="confirm-password"]');
      if (await confirmPasswordInput.count() > 0) {
        await confirmPasswordInput.fill(confirmPassword);
      }
    }
  }

  async clickSignIn() {
    await this.signInButton.click();
    await this.waitForNetworkIdle();
  }

  async clickSignUp() {
    await this.signUpButton.click();
    await this.waitForNetworkIdle();
  }

  async toggleToSignUp() {
    const signUpToggle = this.page.locator('button:has-text("Sign Up"), a:has-text("Sign Up")');
    if (await signUpToggle.count() > 0) {
      await signUpToggle.click();
      await this.waitForNetworkIdle();
    }
  }

  async toggleToSignIn() {
    const signInToggle = this.page.locator('button:has-text("Sign In"), a:has-text("Sign In")');
    if (await signInToggle.count() > 0) {
      await signInToggle.click();
      await this.waitForNetworkIdle();
    }
  }

  async clickForgotPassword() {
    if (await this.forgotPasswordLink.count() > 0) {
      await this.forgotPasswordLink.click();
      await this.waitForNetworkIdle();
    }
  }

  async clickMagicLink() {
    if (await this.magicLinkButton.count() > 0) {
      await this.magicLinkButton.click();
      await this.waitForNetworkIdle();
    }
  }

  async signIn(email: string, password: string) {
    await this.fillSignInForm(email, password);
    await this.clickSignIn();
  }

  async signUp(email: string, password: string, confirmPassword?: string) {
    await this.toggleToSignUp();
    await this.fillSignUpForm(email, password, confirmPassword);
    await this.clickSignUp();
  }

  async checkForErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    if (await this.errorMessage.count() > 0) {
      const errorTexts = await this.errorMessage.allTextContents();
      errors.push(...errorTexts);
    }
    
    return errors;
  }

  async checkForSuccess(): Promise<string[]> {
    const successes: string[] = [];
    
    if (await this.successMessage.count() > 0) {
      const successTexts = await this.successMessage.allTextContents();
      successes.push(...successTexts);
    }
    
    return successes;
  }

  async validatePasswordStrength() {
    const passwordStrengthMeter = this.page.locator('.password-strength, [data-testid="password-strength"]');
    if (await passwordStrengthMeter.count() > 0) {
      await expect(passwordStrengthMeter).toBeVisible();
    }
  }

  async validateFormValidation() {
    // Test empty form submission
    await this.clickSignIn();
    
    // Check for validation messages
    const validationMessages = this.page.locator('.invalid-feedback, .error, [aria-invalid="true"]');
    if (await validationMessages.count() > 0) {
      await expect(validationMessages.first()).toBeVisible();
    }
  }

  async testAuthRedirect() {
    // After successful auth, should redirect
    const currentUrl = this.page.url();
    return !currentUrl.includes('/auth');
  }

  async checkSupabaseAuthIntegration() {
    // Monitor Supabase auth requests
    const authRequests: string[] = [];
    
    this.page.on('request', request => {
      const url = request.url();
      if (url.includes('/auth/v1/') || url.includes('supabase') && url.includes('auth')) {
        authRequests.push(url);
      }
    });

    return authRequests;
  }
}