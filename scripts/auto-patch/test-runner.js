/**
 * Test Runner - Executes tests and manages re-runs for failing specs
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.testCommands = {
      jest: 'npm test',
      playwright: 'npm run test:e2e',
      storybook: 'npm run test:storybook'
    };
    
    this.testPatterns = {
      jest: {
        pattern: /\.test\.(js|ts|jsx|tsx)$|\.spec\.(js|ts|jsx|tsx)$/,
        command: 'npx jest'
      },
      playwright: {
        pattern: /\.e2e\.(js|ts)$/,
        command: 'npx playwright test'
      },
      storybook: {
        pattern: /\.stories\.(js|ts|jsx|tsx)$/,
        command: 'npm run test:storybook'
      }
    };
  }

  /**
   * Run all tests and capture output
   */
  async runAllTests() {
    console.log('🧪 Running all tests...');
    
    const results = {
      jest: await this.runTestSuite('jest'),
      playwright: await this.runTestSuite('playwright'),
      storybook: await this.runTestSuite('storybook')
    };

    return results;
  }

  /**
   * Run specific test suite
   */
  async runTestSuite(suiteType) {
    const command = this.testCommands[suiteType];
    if (!command) {
      return {
        success: false,
        error: `Unknown test suite: ${suiteType}`,
        output: '',
        duration: 0
      };
    }

    const startTime = Date.now();
    
    try {
      const result = await this.executeCommand(command, { timeout: 300000 }); // 5 min timeout
      const duration = Date.now() - startTime;
      
      return {
        success: result.exitCode === 0,
        output: result.output,
        error: result.error,
        exitCode: result.exitCode,
        duration,
        suite: suiteType
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        output: '',
        duration: Date.now() - startTime,
        suite: suiteType
      };
    }
  }

  /**
   * Run specific failing tests
   */
  async runFailingTests(failingFiles) {
    const results = [];
    
    for (const file of failingFiles) {
      console.log(`🔄 Re-running test: ${file}`);
      
      const suiteType = this.detectTestType(file);
      const result = await this.runSingleTest(file, suiteType);
      
      results.push({
        file,
        ...result
      });
    }
    
    return results;
  }

  /**
   * Run a single test file
   */
  async runSingleTest(testFile, suiteType = 'jest') {
    const startTime = Date.now();
    
    try {
      let command;
      
      switch (suiteType) {
        case 'jest':
          command = `npx jest "${testFile}" --verbose`;
          break;
        case 'playwright':
          command = `npx playwright test "${testFile}"`;
          break;
        case 'storybook':
          command = `npm run test:storybook -- --testPathPattern="${testFile}"`;
          break;
        default:
          command = `npx jest "${testFile}" --verbose`;
      }
      
      const result = await this.executeCommand(command, { timeout: 120000 }); // 2 min timeout
      const duration = Date.now() - startTime;
      
      return {
        success: result.exitCode === 0,
        output: result.output,
        error: result.error,
        exitCode: result.exitCode,
        duration,
        suite: suiteType
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        output: '',
        duration: Date.now() - startTime,
        suite: suiteType
      };
    }
  }

  /**
   * Detect test type based on file path/name
   */
  detectTestType(filePath) {
    for (const [type, config] of Object.entries(this.testPatterns)) {
      if (config.pattern.test(filePath)) {
        return type;
      }
    }
    
    // Default to jest
    return 'jest';
  }

  /**
   * Execute shell command
   */
  executeCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const { timeout = 60000 } = options;
      
      console.log(`🚀 Executing: ${command}`);
      
      let output = '';
      let error = '';
      
      const [cmd, ...args] = command.split(' ');
      const child = spawn(cmd, args, {
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      // Set timeout
      const timer = setTimeout(() => {
        child.kill('SIGKILL');
        reject(new Error(`Command timed out after ${timeout}ms: ${command}`));
      }, timeout);
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      child.on('close', (exitCode) => {
        clearTimeout(timer);
        resolve({
          exitCode,
          output: output + error, // Combine for complete log
          error: error
        });
      });
      
      child.on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  /**
   * Extract failing test files from output
   */
  extractFailingFiles(testOutput) {
    const failingFiles = new Set();
    const lines = testOutput.split('\n');
    
    for (const line of lines) {
      // Jest patterns
      const jestMatch = line.match(/FAIL\s+(.+\.(?:test|spec)\.(js|ts|jsx|tsx))/);
      if (jestMatch) {
        failingFiles.add(jestMatch[1]);
        continue;
      }
      
      // Playwright patterns
      const playwrightMatch = line.match(/(\S+\.e2e\.(js|ts))\s+›.*×/);
      if (playwrightMatch) {
        failingFiles.add(playwrightMatch[1]);
        continue;
      }
      
      // Storybook patterns
      const storybookMatch = line.match(/(\S+\.stories\.(js|ts|jsx|tsx)).*FAIL/);
      if (storybookMatch) {
        failingFiles.add(storybookMatch[1]);
        continue;
      }
      
      // Generic error patterns
      const genericMatch = line.match(/Error in\s+(.+\.(js|ts|jsx|tsx))/);
      if (genericMatch) {
        failingFiles.add(genericMatch[1]);
        continue;
      }
    }
    
    return Array.from(failingFiles);
  }

  /**
   * Generate test summary
   */
  generateTestSummary(results) {
    const summary = {
      totalSuites: 0,
      passedSuites: 0,
      failedSuites: 0,
      totalDuration: 0,
      results: {}
    };

    for (const [suite, result] of Object.entries(results)) {
      summary.totalSuites++;
      summary.totalDuration += result.duration || 0;
      
      if (result.success) {
        summary.passedSuites++;
      } else {
        summary.failedSuites++;
      }
      
      summary.results[suite] = {
        success: result.success,
        duration: result.duration,
        hasOutput: !!result.output,
        hasErrors: !!result.error
      };
    }
    
    summary.successRate = summary.totalSuites > 0 ? 
      (summary.passedSuites / summary.totalSuites) * 100 : 0;
    
    return summary;
  }

  /**
   * Check if tests exist in project
   */
  async checkTestsExist() {
    const testDirs = ['src', 'test', 'tests', '__tests__', 'spec'];
    const testPatterns = [
      '**/*.test.{js,ts,jsx,tsx}',
      '**/*.spec.{js,ts,jsx,tsx}',
      '**/*.e2e.{js,ts}',
      '**/*.stories.{js,ts,jsx,tsx}'
    ];
    
    const hasTests = {
      jest: false,
      playwright: false,
      storybook: false
    };
    
    // Check for package.json test scripts
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const scripts = packageJson.scripts || {};
      
      hasTests.jest = !!(scripts.test || scripts['test:unit']);
      hasTests.playwright = !!(scripts['test:e2e'] || scripts['test:playwright']);
      hasTests.storybook = !!(scripts['test:storybook']);
      
    } catch (error) {
      console.warn('Could not read package.json:', error.message);
    }
    
    // TODO: Could add file system scanning for test files
    
    return hasTests;
  }

  /**
   * Watch mode for continuous testing
   */
  async watchTests(callback) {
    console.log('👀 Starting test watch mode...');
    
    const watchCommand = 'npx jest --watch --silent';
    
    try {
      const child = spawn('npx', ['jest', '--watch', '--silent'], {
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      let buffer = '';
      
      child.stdout.on('data', (data) => {
        buffer += data.toString();
        
        // Process complete test runs
        if (buffer.includes('Test Suites:')) {
          callback(buffer);
          buffer = '';
        }
      });
      
      child.stderr.on('data', (data) => {
        buffer += data.toString();
      });
      
      return child;
    } catch (error) {
      console.error('Failed to start watch mode:', error.message);
      return null;
    }
  }
}

module.exports = TestRunner;