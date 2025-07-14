import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting E2E Test Suite Global Teardown');
  
  const artifactsDir = path.join(__dirname, '../../artefacts/e2e_dataflow');
  const trackingFile = path.join(artifactsDir, 'test-tracking.json');

  try {
    // Update test results with completion time
    if (fs.existsSync(trackingFile)) {
      const testResults = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
      testResults.endTime = new Date().toISOString();
      testResults.duration = new Date(testResults.endTime).getTime() - new Date(testResults.startTime).getTime();
      
      fs.writeFileSync(trackingFile, JSON.stringify(testResults, null, 2));
      console.log('📊 Test tracking data updated');
    }

    // Clean up temporary files
    const tempFiles = [
      path.join(__dirname, '../fixtures/auth-state.json')
    ];

    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`🗑️  Cleaned up: ${path.basename(file)}`);
      }
    });

    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
  }
}

export default globalTeardown;