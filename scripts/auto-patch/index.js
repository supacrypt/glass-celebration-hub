#!/usr/bin/env node

/**
 * Auto-Patch System - Main Entry Point
 * 
 * Automated troubleshooting and patching system for test failures
 */

const ErrorAnalyzer = require('./error-analyzer');
const PatchGenerator = require('./patch-generator');
const TestRunner = require('./test-runner');
const PatchApplier = require('./patch-applier');
const Logger = require('./logger');
const { config, validateConfig } = require('./config');

class AutoPatchSystem {
  constructor(options = {}) {
    this.config = { ...config, ...options };
    this.validateConfiguration();
    
    this.errorAnalyzer = new ErrorAnalyzer();
    this.patchGenerator = new PatchGenerator();
    this.testRunner = new TestRunner();
    this.patchApplier = new PatchApplier();
    this.logger = new Logger();
    
    this.performance = {
      startTime: Date.now(),
      phases: {}
    };
  }

  /**
   * Validate system configuration
   */
  validateConfiguration() {
    const validation = validateConfig(this.config);
    if (!validation.valid) {
      throw new Error(`Configuration errors: ${validation.errors.join(', ')}`);
    }
  }

  /**
   * Main auto-patch execution
   */
  async run() {
    console.log('🚀 Starting Auto-Patch System...');
    console.log(`📋 Max attempts: ${this.config.maxAttempts}`);
    console.log(`⏱️  Timeout: ${this.config.timeoutMs}ms`);
    
    try {
      // Initialize performance tracking
      this.startPhase('total');
      
      // Step 1: Run all tests and analyze failures
      const initialResults = await this.runInitialTests();
      
      if (!initialResults.hasFailures) {
        console.log('✅ All tests passing! No patches needed.');
        return this.generateFinalReport({
          success: true,
          message: 'All tests passing',
          cycles: 0
        });
      }

      // Step 2: Execute patch cycles
      const cycleResults = await this.executePatchCycles(initialResults);
      
      // Step 3: Generate final report
      return this.generateFinalReport(cycleResults);
      
    } catch (error) {
      console.error('❌ Auto-patch system failed:', error.message);
      this.logger.writeLog({
        type: 'system_error',
        error: error.message,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      this.endPhase('total');
    }
  }

  /**
   * Run initial test suite
   */
  async runInitialTests() {
    console.log('\n📊 Running initial test suite...');
    this.startPhase('initial_tests');
    
    const testResults = await this.testRunner.runAllTests();
    this.logger.logTestExecution(testResults);
    
    // Check if any tests failed
    const hasFailures = Object.values(testResults).some(result => !result.success);
    
    if (!hasFailures) {
      this.endPhase('initial_tests');
      return { hasFailures: false, testResults };
    }

    // Extract and analyze errors
    const allOutput = Object.values(testResults)
      .map(r => r.output || '')
      .join('\n');
    
    const errors = this.errorAnalyzer.analyzeTestOutput(allOutput);
    const errorSummary = this.errorAnalyzer.generateSummary(errors);
    
    console.log(`🔍 Found ${errors.length} errors across ${errorSummary.files.length} files`);
    this.logger.logErrorAnalysis(errors, errorSummary);
    
    this.endPhase('initial_tests');
    
    return {
      hasFailures: true,
      testResults,
      errors,
      errorSummary,
      failingFiles: this.testRunner.extractFailingFiles(allOutput)
    };
  }

  /**
   * Execute patch cycles with retry logic
   */
  async executePatchCycles(initialResults) {
    let currentErrors = initialResults.errors;
    let attempt = 1;
    const cycleResults = {
      cycles: [],
      finalSuccess: false,
      totalPatches: 0,
      successfulPatches: 0
    };

    while (attempt <= this.config.maxAttempts && currentErrors.length > 0) {
      console.log(`\n🔄 Starting patch cycle ${attempt}/${this.config.maxAttempts}`);
      console.log(`📋 Processing ${currentErrors.length} errors`);
      
      const cycleResult = await this.executeSingleCycle(currentErrors, attempt);
      cycleResults.cycles.push(cycleResult);
      
      cycleResults.totalPatches += cycleResult.patchResults.results.length;
      cycleResults.successfulPatches += cycleResult.patchResults.successCount;
      
      // If no patches were successfully applied, stop trying
      if (cycleResult.patchResults.successCount === 0) {
        console.log('⚠️  No patches applied successfully, stopping cycles');
        break;
      }
      
      // Re-run tests to check if errors are fixed
      const retestResults = await this.retestFailingFiles(cycleResult.failingFiles);
      
      if (retestResults.allPassed) {
        console.log('🎉 All tests now passing!');
        cycleResults.finalSuccess = true;
        break;
      }
      
      // Analyze remaining errors
      currentErrors = this.errorAnalyzer.analyzeTestOutput(retestResults.output);
      console.log(`📊 ${currentErrors.length} errors remaining`);
      
      attempt++;
    }

    return cycleResults;
  }

  /**
   * Execute a single patch cycle
   */
  async executeSingleCycle(errors, attempt) {
    // Limit errors per cycle to avoid overwhelming the system
    const maxErrors = this.config.errorAnalysis.maxErrorsPerCycle;
    const limitedErrors = errors.slice(0, maxErrors);
    
    // Generate patches
    console.log('🔧 Generating patches...');
    this.startPhase(`patch_generation_${attempt}`);
    
    const patches = await this.patchGenerator.generatePatches(limitedErrors);
    this.logger.logPatchGeneration(patches);
    
    this.endPhase(`patch_generation_${attempt}`);
    
    if (patches.length === 0) {
      console.log('⚠️  No patches could be generated');
      return {
        attempt,
        errors: limitedErrors,
        patches: [],
        patchResults: { results: [], successCount: 0, failureCount: 0 }
      };
    }

    // Apply patches
    console.log(`📝 Applying ${patches.length} patches...`);
    this.startPhase(`patch_application_${attempt}`);
    
    const patchResults = await this.patchApplier.applyPatches(patches, attempt);
    this.logger.logPatchApplication(patchResults, attempt);
    
    this.endPhase(`patch_application_${attempt}`);
    
    // Extract failing files for re-testing
    const failingFiles = [...new Set(limitedErrors.map(e => e.file).filter(Boolean))];
    
    return {
      attempt,
      errors: limitedErrors,
      patches,
      patchResults,
      failingFiles
    };
  }

  /**
   * Re-test failing files to check if patches worked
   */
  async retestFailingFiles(failingFiles) {
    if (!failingFiles || failingFiles.length === 0) {
      return { allPassed: true, output: '' };
    }

    console.log(`🧪 Re-testing ${failingFiles.length} files...`);
    this.startPhase('retest');
    
    const retestResults = await this.testRunner.runFailingTests(failingFiles);
    const allPassed = retestResults.every(result => result.success);
    const combinedOutput = retestResults.map(r => r.output || '').join('\n');
    
    this.endPhase('retest');
    
    return {
      allPassed,
      output: combinedOutput,
      results: retestResults
    };
  }

  /**
   * Generate comprehensive final report
   */
  async generateFinalReport(cycleResults) {
    console.log('\n📋 Generating final report...');
    
    const sessionData = {
      session: {
        sessionId: this.logger.currentSession,
        startTime: new Date(this.performance.startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - this.performance.startTime
      },
      performance: this.calculatePerformanceMetrics(),
      ...cycleResults
    };

    // Generate markdown report
    const reportPath = await this.logger.generatePatchCycleLog(sessionData);
    
    // Log cycle completion
    this.logger.logCycleCompletion(cycleResults);
    
    // Display summary
    console.log('\n📊 Auto-Patch Summary:');
    console.log(`   Cycles Executed: ${cycleResults.cycles?.length || 0}`);
    console.log(`   Total Patches: ${cycleResults.totalPatches || 0}`);
    console.log(`   Successful Patches: ${cycleResults.successfulPatches || 0}`);
    console.log(`   Final Status: ${cycleResults.finalSuccess ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`   Report: ${reportPath}`);
    
    return {
      success: cycleResults.finalSuccess || false,
      reportPath,
      sessionData
    };
  }

  /**
   * Calculate performance metrics
   */
  calculatePerformanceMetrics() {
    const totalTime = Date.now() - this.performance.startTime;
    const phases = this.performance.phases;
    
    return {
      totalTime,
      testTime: this.sumPhasesByPattern(phases, /test/),
      analysisTime: this.sumPhasesByPattern(phases, /analysis/),
      patchTime: this.sumPhasesByPattern(phases, /patch_generation/),
      applicationTime: this.sumPhasesByPattern(phases, /patch_application/),
      avgTimePerError: 0, // Will be calculated in report
      avgTimePerPatch: 0  // Will be calculated in report
    };
  }

  /**
   * Sum phases matching a pattern
   */
  sumPhasesByPattern(phases, pattern) {
    return Object.keys(phases)
      .filter(key => pattern.test(key))
      .reduce((sum, key) => sum + (phases[key].duration || 0), 0);
  }

  /**
   * Start performance phase tracking
   */
  startPhase(name) {
    this.performance.phases[name] = {
      start: Date.now()
    };
  }

  /**
   * End performance phase tracking
   */
  endPhase(name) {
    if (this.performance.phases[name]) {
      this.performance.phases[name].end = Date.now();
      this.performance.phases[name].duration = 
        this.performance.phases[name].end - this.performance.phases[name].start;
    }
  }

  /**
   * Watch mode for continuous auto-patching
   */
  async watchMode() {
    console.log('👀 Starting auto-patch watch mode...');
    
    const watchProcess = await this.testRunner.watchTests(async (testOutput) => {
      const errors = this.errorAnalyzer.analyzeTestOutput(testOutput);
      
      if (errors.length > 0) {
        console.log(`🔍 Detected ${errors.length} new errors, auto-patching...`);
        
        const patches = await this.patchGenerator.generatePatches(errors);
        if (patches.length > 0) {
          await this.patchApplier.applyPatches(patches, 1);
        }
      }
    });
    
    return watchProcess;
  }

  /**
   * Clean up old files and data
   */
  async cleanup() {
    console.log('🧹 Cleaning up auto-patch data...');
    
    // Clean old backups
    const cleanedBackups = await this.patchApplier.cleanBackups(7);
    console.log(`   Cleaned ${cleanedBackups} old backup files`);
    
    // Could add log cleanup here
    return {
      backupsRemoved: cleanedBackups
    };
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'run';
  
  try {
    const autoPatch = new AutoPatchSystem();
    
    switch (command) {
      case 'run':
        await autoPatch.run();
        break;
        
      case 'watch':
        await autoPatch.watchMode();
        break;
        
      case 'cleanup':
        await autoPatch.cleanup();
        break;
        
      case 'test':
        // Test mode - run with single attempt
        const testSystem = new AutoPatchSystem({ maxAttempts: 1 });
        await testSystem.run();
        break;
        
      default:
        console.log('Usage: node index.js [run|watch|cleanup|test]');
        console.log('  run    - Execute auto-patch cycle (default)');
        console.log('  watch  - Start watch mode for continuous patching');
        console.log('  cleanup - Clean old backup and log files');
        console.log('  test   - Run single attempt for testing');
        process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Auto-patch failed:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = AutoPatchSystem;

// Run CLI if called directly
if (require.main === module) {
  main();
}