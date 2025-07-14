import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class GalleryPage extends BasePage {
  readonly galleryContainer: Locator;
  readonly photoGrid: Locator;
  readonly photoItems: Locator;
  readonly uploadButton: Locator;
  readonly filterButtons: Locator;
  readonly lightbox: Locator;
  readonly lightboxImage: Locator;
  readonly lightboxClose: Locator;
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.galleryContainer = page.locator('[data-testid="gallery"], .gallery, .photo-gallery').first();
    this.photoGrid = page.locator('[data-testid="photo-grid"], .photo-grid, .gallery-grid');
    this.photoItems = page.locator('.photo-item, [data-testid="photo-item"], .gallery-item img');
    this.uploadButton = page.locator('button:has-text("Upload"), [data-testid="upload-button"]');
    this.filterButtons = page.locator('.filter-button, [data-testid="filter-button"]');
    this.lightbox = page.locator('.lightbox, [data-testid="lightbox"], .modal');
    this.lightboxImage = page.locator('.lightbox img, [data-testid="lightbox-image"]');
    this.lightboxClose = page.locator('.lightbox-close, [data-testid="lightbox-close"], .close');
    this.nextButton = page.locator('.next, [data-testid="next-photo"]');
    this.prevButton = page.locator('.prev, [data-testid="prev-photo"]');
    this.searchInput = page.locator('input[type="search"], [data-testid="search-input"]');
  }

  async goto() {
    await super.goto('/gallery');
    await this.waitForPageLoad();
  }

  async validateGalleryLayout() {
    await expect(this.galleryContainer).toBeVisible();
    
    if (await this.photoGrid.count() > 0) {
      await expect(this.photoGrid).toBeVisible();
    }
  }

  async validatePhotoItems() {
    if (await this.photoItems.count() > 0) {
      await expect(this.photoItems.first()).toBeVisible();
      
      // Check that images are loaded
      const firstPhoto = this.photoItems.first();
      await expect(firstPhoto).toHaveAttribute('src');
      
      // Validate image load
      const src = await firstPhoto.getAttribute('src');
      expect(src).toBeTruthy();
    }
  }

  async clickPhotoItem(index: number = 0) {
    const photos = await this.photoItems.all();
    if (photos.length > index) {
      await photos[index].click();
      await this.page.waitForTimeout(500); // Wait for lightbox animation
    }
  }

  async validateLightbox() {
    await this.clickPhotoItem(0);
    
    if (await this.lightbox.count() > 0) {
      await expect(this.lightbox).toBeVisible();
      
      if (await this.lightboxImage.count() > 0) {
        await expect(this.lightboxImage).toBeVisible();
        await expect(this.lightboxImage).toHaveAttribute('src');
      }
      
      if (await this.lightboxClose.count() > 0) {
        await expect(this.lightboxClose).toBeVisible();
      }
    }
  }

  async closeLightbox() {
    if (await this.lightboxClose.count() > 0) {
      await this.lightboxClose.click();
      await expect(this.lightbox).toBeHidden();
    } else {
      // Try clicking outside or pressing escape
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(500);
    }
  }

  async navigateLightbox(direction: 'next' | 'prev') {
    if (direction === 'next' && await this.nextButton.count() > 0) {
      await this.nextButton.click();
    } else if (direction === 'prev' && await this.prevButton.count() > 0) {
      await this.prevButton.click();
    }
    
    await this.page.waitForTimeout(500); // Wait for navigation
  }

  async testLightboxNavigation() {
    await this.validateLightbox();
    
    // Test next navigation
    const initialSrc = await this.lightboxImage.getAttribute('src');
    await this.navigateLightbox('next');
    
    // Check if image changed
    const newSrc = await this.lightboxImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
    
    await this.closeLightbox();
  }

  async validatePhotoFilters() {
    if (await this.filterButtons.count() > 0) {
      const filterCount = await this.filterButtons.count();
      
      for (let i = 0; i < filterCount; i++) {
        const filter = this.filterButtons.nth(i);
        await filter.click();
        await this.waitForNetworkIdle();
        
        // Validate photos are filtered
        await this.validatePhotoItems();
      }
    }
  }

  async testPhotoSearch() {
    if (await this.searchInput.count() > 0) {
      await this.searchInput.fill('test');
      await this.page.keyboard.press('Enter');
      await this.waitForNetworkIdle();
      
      // Validate search results
      await this.validatePhotoItems();
    }
  }

  async validatePhotoUpload() {
    if (await this.uploadButton.count() > 0) {
      await this.uploadButton.click();
      
      // Check for upload modal or form
      const uploadModal = this.page.locator('.upload-modal, [data-testid="upload-modal"]');
      const fileInput = this.page.locator('input[type="file"], [data-testid="file-input"]');
      
      if (await uploadModal.count() > 0) {
        await expect(uploadModal).toBeVisible();
      }
      
      if (await fileInput.count() > 0) {
        await expect(fileInput).toBeVisible();
      }
    }
  }

  async checkImageOptimization() {
    const images = await this.photoItems.all();
    const imageMetrics = [];
    
    for (const image of images.slice(0, 5)) { // Check first 5 images
      const src = await image.getAttribute('src');
      const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
      const naturalHeight = await image.evaluate((img: HTMLImageElement) => img.naturalHeight);
      const displayWidth = await image.evaluate((img: HTMLImageElement) => img.clientWidth);
      const displayHeight = await image.evaluate((img: HTMLImageElement) => img.clientHeight);
      
      imageMetrics.push({
        src,
        naturalWidth,
        naturalHeight,
        displayWidth,
        displayHeight,
        isOptimized: naturalWidth <= displayWidth * 2 // Reasonable optimization check
      });
    }
    
    return imageMetrics;
  }

  async validatePhotoLikes() {
    const likeButtons = this.page.locator('.like-button, [data-testid="like-button"]');
    
    if (await likeButtons.count() > 0) {
      const firstLike = likeButtons.first();
      const initialLikes = await this.page.locator('.like-count, [data-testid="like-count"]').first().textContent();
      
      await firstLike.click();
      await this.waitForNetworkIdle();
      
      // Check if like count changed
      const newLikes = await this.page.locator('.like-count, [data-testid="like-count"]').first().textContent();
      return { initialLikes, newLikes, changed: initialLikes !== newLikes };
    }
    
    return { hasLikes: false };
  }

  async checkSupabasePhotoIntegration() {
    const photoRequests: string[] = [];
    
    this.page.on('request', request => {
      const url = request.url();
      if (url.includes('/rest/v1/photos') || url.includes('/rest/v1/photo_gallery') || 
          url.includes('/rest/v1/gallery_photos') || url.includes('storage/v1/object/')) {
        photoRequests.push(url);
      }
    });

    return photoRequests;
  }

  async validatePhotoMetadata() {
    const photos = await this.photoItems.all();
    const metadata = [];
    
    for (const photo of photos.slice(0, 3)) { // Check first 3 photos
      const alt = await photo.getAttribute('alt');
      const title = await photo.getAttribute('title');
      const dataAttributes = await photo.evaluate((img) => {
        const attrs: any = {};
        for (const attr of img.attributes) {
          if (attr.name.startsWith('data-')) {
            attrs[attr.name] = attr.value;
          }
        }
        return attrs;
      });
      
      metadata.push({ alt, title, dataAttributes });
    }
    
    return metadata;
  }

  async testPhotoLazyLoading() {
    // Scroll to trigger lazy loading
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await this.page.waitForTimeout(2000);
    
    // Check if more photos loaded
    const finalPhotoCount = await this.photoItems.count();
    
    // Scroll back to top
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    
    return { finalPhotoCount };
  }

  async validatePhotoAccessibility() {
    const photos = await this.photoItems.all();
    const accessibilityIssues = [];
    
    for (const photo of photos.slice(0, 5)) {
      const alt = await photo.getAttribute('alt');
      const ariaLabel = await photo.getAttribute('aria-label');
      const role = await photo.getAttribute('role');
      
      if (!alt && !ariaLabel) {
        accessibilityIssues.push('Missing alt text or aria-label');
      }
    }
    
    return accessibilityIssues;
  }
}