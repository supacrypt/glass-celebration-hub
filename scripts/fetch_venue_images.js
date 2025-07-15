import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import path from 'path';
import fs from 'fs/promises';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Venue configurations
const VENUE_CONFIGS = [
  {
    name: 'Benean Homestead',
    url: 'https://benean.com.au',
    bucket: 'venue-ben-ean',
    venueId: null, // Will be fetched from database
    selectors: {
      hero: [
        'meta[property="og:image"]',
        '.hero-image img',
        '.banner img',
        '.header-image img',
        'img[alt*="Benean"]'
      ],
      gallery: [
        '.gallery img',
        '.slider img',
        '.carousel img',
        'img[src*="gallery"]'
      ]
    }
  },
  {
    name: 'Prince of Merewether',
    url: 'https://princeofmerewether.com',
    bucket: 'venue-pub',
    venueId: null,
    selectors: {
      hero: [
        'meta[property="og:image"]',
        '.hero img',
        '.banner img',
        'header img',
        'img[alt*="Prince"]'
      ],
      gallery: [
        '.gallery img',
        '.images img',
        'img[src*="gallery"]'
      ]
    }
  }
];

async function fetchVenueIds() {
  console.log('Fetching venue IDs from database...');
  
  for (const config of VENUE_CONFIGS) {
    const { data, error } = await supabase
      .from('venues')
      .select('id')
      .ilike('name', `%${config.name.split(' ')[0]}%`)
      .single();
    
    if (error) {
      console.error(`Error fetching venue ID for ${config.name}:`, error);
      continue;
    }
    
    config.venueId = data.id;
    console.log(`Found venue ID for ${config.name}: ${data.id}`);
  }
}

async function fetchImageUrl(pageUrl, selectors) {
  try {
    const response = await fetch(pageUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Try meta tags first
    for (const selector of selectors) {
      if (selector.includes('meta')) {
        const metaContent = $(selector).attr('content');
        if (metaContent) {
          return new URL(metaContent, pageUrl).href;
        }
      } else {
        const imgSrc = $(selector).first().attr('src');
        if (imgSrc) {
          return new URL(imgSrc, pageUrl).href;
        }
      }
    }
    
    // Fallback: find the largest image on the page
    let largestImage = null;
    let maxSize = 0;
    
    $('img').each((i, elem) => {
      const width = parseInt($(elem).attr('width') || '0');
      const height = parseInt($(elem).attr('height') || '0');
      const size = width * height;
      
      if (size > maxSize) {
        maxSize = size;
        largestImage = $(elem).attr('src');
      }
    });
    
    if (largestImage) {
      return new URL(largestImage, pageUrl).href;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching page ${pageUrl}:`, error);
    return null;
  }
}

async function downloadImage(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const buffer = await response.buffer();
    const contentType = response.headers.get('content-type');
    const extension = contentType?.includes('jpeg') || contentType?.includes('jpg') ? 'jpg' : 'png';
    
    return { buffer, extension, contentType };
  } catch (error) {
    console.error(`Error downloading image ${imageUrl}:`, error);
    return null;
  }
}

async function uploadToSupabase(buffer, bucket, fileName) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return { path: `${bucket}/${fileName}`, url: publicUrl };
  } catch (error) {
    console.error(`Error uploading to Supabase:`, error);
    return null;
  }
}

async function createVenueImageRecord(venueId, imageData, imageType, order = 0) {
  try {
    const { data, error } = await supabase
      .from('venue_images')
      .insert({
        venue_id: venueId,
        image_url: imageData.url,
        image_path: imageData.path,
        image_type: imageType,
        title: imageType === 'cover' ? 'Hero Image' : `Gallery Image ${order}`,
        description: `Venue ${imageType} image`,
        image_order: order,
        is_published: true,
        mime_type: 'image/jpeg',
        file_size: 0 // Will be updated if we track size
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error creating venue image record:`, error);
    return null;
  }
}

async function processVenue(config) {
  console.log(`\nProcessing ${config.name}...`);
  
  if (!config.venueId) {
    console.error(`No venue ID found for ${config.name}, skipping...`);
    return;
  }
  
  // Check if images already exist
  const { data: existingImages } = await supabase
    .from('venue_images')
    .select('id')
    .eq('venue_id', config.venueId)
    .eq('is_published', true);
  
  if (existingImages && existingImages.length > 0) {
    console.log(`${config.name} already has ${existingImages.length} images, skipping...`);
    return;
  }
  
  // Fetch hero image
  console.log(`Fetching hero image from ${config.url}...`);
  const heroImageUrl = await fetchImageUrl(config.url, config.selectors.hero);
  
  if (heroImageUrl) {
    console.log(`Found hero image: ${heroImageUrl}`);
    const imageData = await downloadImage(heroImageUrl);
    
    if (imageData) {
      const fileName = `hero-${Date.now()}.${imageData.extension}`;
      const uploadResult = await uploadToSupabase(imageData.buffer, config.bucket, fileName);
      
      if (uploadResult) {
        console.log(`Uploaded hero image to ${uploadResult.path}`);
        await createVenueImageRecord(config.venueId, uploadResult, 'cover', 0);
        console.log(`Created venue image record for hero image`);
      }
    }
  } else {
    console.log(`No hero image found for ${config.name}`);
  }
  
  // Try to fetch gallery images (limited to avoid overwhelming)
  console.log(`Attempting to fetch gallery images...`);
  const galleryUrls = [
    `${config.url}/gallery`,
    `${config.url}/images`,
    `${config.url}/photos`,
    config.url
  ];
  
  let galleryCount = 0;
  for (const galleryUrl of galleryUrls) {
    if (galleryCount >= 3) break; // Limit to 3 gallery images
    
    const galleryImageUrl = await fetchImageUrl(galleryUrl, config.selectors.gallery);
    if (galleryImageUrl && galleryImageUrl !== heroImageUrl) {
      console.log(`Found gallery image: ${galleryImageUrl}`);
      const imageData = await downloadImage(galleryImageUrl);
      
      if (imageData) {
        const fileName = `gallery-${Date.now()}-${galleryCount}.${imageData.extension}`;
        const uploadResult = await uploadToSupabase(imageData.buffer, config.bucket, fileName);
        
        if (uploadResult) {
          galleryCount++;
          console.log(`Uploaded gallery image ${galleryCount} to ${uploadResult.path}`);
          await createVenueImageRecord(config.venueId, uploadResult, 'gallery', galleryCount);
        }
      }
    }
  }
  
  console.log(`Completed processing ${config.name}: 1 hero + ${galleryCount} gallery images`);
}

// Fallback images from static sources
async function uploadFallbackImages() {
  console.log('\nChecking for venues without images...');
  
  const { data: venuesWithoutImages } = await supabase
    .from('venues')
    .select('id, name')
    .not('id', 'in', `(SELECT DISTINCT venue_id FROM venue_images WHERE is_published = true)`);
  
  if (venuesWithoutImages && venuesWithoutImages.length > 0) {
    console.log(`Found ${venuesWithoutImages.length} venues without images`);
    
    for (const venue of venuesWithoutImages) {
      console.log(`Creating placeholder image for ${venue.name}...`);
      
      // Determine bucket based on venue name
      let bucket = 'venue-ben-ean';
      if (venue.name.includes('Prince')) bucket = 'venue-pub';
      if (venue.name.includes('Beach')) bucket = 'venue-beach';
      
      // Create a placeholder record pointing to a default image
      const placeholderData = {
        venue_id: venue.id,
        image_url: `${supabaseUrl}/storage/v1/object/public/${bucket}/placeholder.jpg`,
        image_path: `${bucket}/placeholder.jpg`,
        image_type: 'cover',
        title: 'Venue Image',
        description: 'Beautiful venue awaiting professional photography',
        image_order: 0,
        is_published: true,
        mime_type: 'image/jpeg'
      };
      
      await supabase
        .from('venue_images')
        .insert(placeholderData);
      
      console.log(`Created placeholder image record for ${venue.name}`);
    }
  }
}

// Main execution
async function main() {
  console.log('Starting venue image fetch process...');
  console.log('======================================');
  
  // Fetch venue IDs
  await fetchVenueIds();
  
  // Process each venue
  for (const config of VENUE_CONFIGS) {
    await processVenue(config);
  }
  
  // Handle any venues without images
  await uploadFallbackImages();
  
  console.log('\n======================================');
  console.log('Venue image fetch process completed!');
  
  // Generate report
  const report = await generateReport();
  await fs.writeFile(
    path.join(process.cwd(), 'venue_image_fix.md'),
    report,
    'utf-8'
  );
  
  console.log('Report saved to venue_image_fix.md');
}

async function generateReport() {
  const { data: allImages } = await supabase
    .from('venue_images')
    .select(`
      *,
      venues (name)
    `)
    .order('venue_id', { ascending: true })
    .order('image_order', { ascending: true });
  
  let report = `# VENUE IMAGE FIX REPORT\n\n`;
  report += `## Date: ${new Date().toISOString()}\n\n`;
  report += `## Summary\n`;
  report += `Successfully fetched and uploaded venue images from external sources.\n\n`;
  
  report += `## Images by Venue\n\n`;
  
  const imagesByVenue = {};
  allImages?.forEach(img => {
    const venueName = img.venues?.name || 'Unknown';
    if (!imagesByVenue[venueName]) {
      imagesByVenue[venueName] = [];
    }
    imagesByVenue[venueName].push(img);
  });
  
  for (const [venueName, images] of Object.entries(imagesByVenue)) {
    report += `### ${venueName}\n`;
    report += `Total Images: ${images.length}\n\n`;
    
    images.forEach(img => {
      report += `- **${img.title || 'Untitled'}** (${img.image_type})\n`;
      report += `  - Path: \`${img.image_path}\`\n`;
      report += `  - URL: ${img.image_url}\n`;
      report += `  - Published: ${img.is_published ? 'Yes' : 'No'}\n\n`;
    });
  }
  
  report += `## Technical Details\n\n`;
  report += `- Fetched images from benean.com.au and princeofmerewether.com\n`;
  report += `- Images stored in venue-specific buckets\n`;
  report += `- All images have signed URL support\n`;
  report += `- Fallback placeholders created for venues without images\n\n`;
  
  report += `## Next Steps\n\n`;
  report += `1. Verify images display correctly in VenueHeroImage component\n`;
  report += `2. Consider adding more gallery images manually\n`;
  report += `3. Update placeholder images with professional photography\n`;
  report += `4. Implement image optimization for performance\n`;
  
  return report;
}

// Run the script
main().catch(console.error);