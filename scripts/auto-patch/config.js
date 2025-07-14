/**
 * Configuration for Auto-Patch System
 */

const path = require('path');

const config = {
  // General settings
  maxAttempts: 3,
  timeoutMs: 300000, // 5 minutes
  
  // Test runner settings
  testRunner: {
    defaultTimeout: 120000, // 2 minutes per test
    watchMode: false,
    parallel: true,
    retryFailedTests: true,
    
    // Test command patterns
    commands: {
      jest: {
        single: 'npx jest "{file}" --verbose --no-cache',
        all: 'npm test',
        watch: 'npx jest --watch --silent'
      },
      playwright: {
        single: 'npx playwright test "{file}"',
        all: 'npm run test:e2e',
        watch: 'npx playwright test --watch'
      },
      storybook: {
        single: 'npm run test:storybook -- --testPathPattern="{file}"',
        all: 'npm run test:storybook',
        watch: 'npm run test:storybook -- --watch'
      }
    }
  },

  // Error analysis settings
  errorAnalysis: {
    // Confidence thresholds for auto-patching
    confidenceThresholds: {
      critical: 0.9,  // Only apply critical fixes with 90%+ confidence
      high: 0.8,      // High severity with 80%+ confidence
      medium: 0.7,    // Medium severity with 70%+ confidence
      low: 0.6        // Low severity with 60%+ confidence
    },
    
    // Max errors to process in one cycle
    maxErrorsPerCycle: 50,
    
    // Error pattern weights (for prioritization)
    severityWeights: {
      critical: 10,
      high: 5,
      medium: 2,
      low: 1
    }
  },

  // Patch generation settings
  patchGeneration: {
    // Strategy timeout (ms)
    strategyTimeout: 30000,
    
    // Enable experimental patches
    experimental: false,
    
    // Skip patches for certain file types
    skipFilePatterns: [
      /node_modules/,
      /\.git/,
      /\.next/,
      /build/,
      /dist/,
      /coverage/
    ],
    
    // Common import corrections
    importCorrections: {
      'react': "import React from 'react';",
      '@testing-library/react': "import { render, screen, fireEvent, waitFor } from '@testing-library/react';",
      '@testing-library/jest-dom': "import '@testing-library/jest-dom';",
      '@testing-library/user-event': "import userEvent from '@testing-library/user-event';",
      'jest': "import { jest } from '@jest/globals';",
      '@storybook/react': "import type { Meta, StoryObj } from '@storybook/react';",
      '@storybook/addon-essentials': "import { addons } from '@storybook/addons';",
      'next/router': "import { useRouter } from 'next/router';",
      'next/image': "import Image from 'next/image';",
      'next/link': "import Link from 'next/link';"
    },

    // Common typo corrections
    typoCorrections: {
      'reac': 'react',
      'react-dom': 'react-dom',
      '@testing-libray': '@testing-library',
      '@testing-library/reac': '@testing-library/react',
      'jest-dom': '@testing-library/jest-dom',
      'storyboo': '@storybook',
      'playwrigh': 'playwright',
      'cypres': 'cypress'
    },

    // Database table name corrections
    tableNameCorrections: {
      'user': 'users',
      'wedding': 'weddings',
      'vendor': 'vendors',
      'guest': 'guests',
      'venue': 'venues',
      'invitation': 'invitations',
      'rsvp': 'rsvps',
      'payment': 'payments',
      'budget': 'budgets',
      'timeline': 'timelines',
      'photo': 'photos',
      'message': 'messages'
    }
  },

  // Backup settings
  backup: {
    enabled: true,
    directory: '.auto-patch/backups',
    retentionDays: 7,
    maxBackupSize: 100 * 1024 * 1024, // 100MB
    
    // Backup file naming
    namingPattern: '{filename}.{timestamp}.attempt-{attempt}.backup'
  },

  // Logging settings
  logging: {
    directory: '.auto-patch/logs',
    level: 'info', // debug, info, warn, error
    maxLogSize: 10 * 1024 * 1024, // 10MB
    maxLogFiles: 5,
    
    // Session settings
    sessionTimeout: 2 * 60 * 60 * 1000, // 2 hours
    
    // Report generation
    generateMarkdown: true,
    includeStackTraces: false,
    maxErrorsInReport: 20,
    maxPatchesInReport: 15
  },

  // Performance settings
  performance: {
    enableProfiling: true,
    memoryThresholdMB: 512,
    cpuThresholdPercent: 80,
    
    // Parallel processing
    maxConcurrentPatches: 5,
    maxConcurrentTests: 3
  },

  // Integration settings
  integration: {
    // Git integration
    git: {
      enabled: false,
      autoCommit: false,
      commitMessage: 'Auto-patch: Fix {errorCount} errors via {strategies}',
      createBranch: false,
      branchPrefix: 'auto-patch/'
    },
    
    // CI/CD integration
    ci: {
      enabled: false,
      failOnPatchFailure: false,
      generateArtifacts: true,
      notifyOnFailure: false
    },
    
    // External tools
    external: {
      prettier: {
        enabled: true,
        runAfterPatch: true
      },
      eslint: {
        enabled: true,
        runAfterPatch: true,
        fixable: true
      }
    }
  },

  // File patterns
  filePatterns: {
    test: [
      '**/*.test.{js,ts,jsx,tsx}',
      '**/*.spec.{js,ts,jsx,tsx}',
      '**/__tests__/**/*.{js,ts,jsx,tsx}',
      '**/test/**/*.{js,ts,jsx,tsx}'
    ],
    
    e2e: [
      '**/*.e2e.{js,ts}',
      '**/e2e/**/*.{js,ts}',
      '**/tests/**/*.e2e.{js,ts}'
    ],
    
    storybook: [
      '**/*.stories.{js,ts,jsx,tsx}',
      '**/*.story.{js,ts,jsx,tsx}'
    ],
    
    source: [
      'src/**/*.{js,ts,jsx,tsx}',
      'components/**/*.{js,ts,jsx,tsx}',
      'pages/**/*.{js,ts,jsx,tsx}',
      'lib/**/*.{js,ts,jsx,tsx}'
    ]
  },

  // Patch strategies configuration
  strategies: {
    import: {
      enabled: true,
      priority: 'high',
      strategies: [
        'fixMissingImports',
        'fixRelativePaths',
        'fixTypoInImports',
        'addMissingPackages'
      ]
    },
    
    export: {
      enabled: true,
      priority: 'high',
      strategies: [
        'fixDefaultExports',
        'fixNamedExports',
        'addMissingExports'
      ]
    },
    
    typescript: {
      enabled: true,
      priority: 'medium',
      strategies: [
        'addTypeAssertions',
        'fixPropertyAccess',
        'addNullChecks',
        'fixTypeDefinitions'
      ]
    },
    
    database: {
      enabled: true,
      priority: 'low',
      strategies: [
        'fixTableNames',
        'fixColumnNames',
        'updateMigrations'
      ]
    },
    
    react: {
      enabled: true,
      priority: 'medium',
      strategies: [
        'fixPropTypes',
        'addKeys',
        'fixHookDependencies',
        'addNullChecks'
      ]
    },
    
    syntax: {
      enabled: true,
      priority: 'high',
      strategies: [
        'fixSyntaxErrors',
        'addMissingSemicolons',
        'fixBraces'
      ]
    }
  }
};

// Environment-specific overrides
const env = process.env.NODE_ENV || 'development';

const envConfigs = {
  development: {
    logging: {
      level: 'debug',
      includeStackTraces: true
    },
    patchGeneration: {
      experimental: true
    }
  },
  
  test: {
    maxAttempts: 1,
    timeoutMs: 60000,
    backup: {
      enabled: false
    },
    logging: {
      level: 'warn'
    }
  },
  
  production: {
    errorAnalysis: {
      confidenceThresholds: {
        critical: 0.95,
        high: 0.9,
        medium: 0.85,
        low: 0.8
      }
    },
    patchGeneration: {
      experimental: false
    },
    logging: {
      level: 'info',
      includeStackTraces: false
    }
  }
};

// Merge environment-specific config
function getConfig() {
  const envConfig = envConfigs[env] || {};
  return mergeConfig(config, envConfig);
}

// Deep merge configurations
function mergeConfig(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeConfig(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

// Validate configuration
function validateConfig(config) {
  const errors = [];
  
  if (config.maxAttempts < 1 || config.maxAttempts > 10) {
    errors.push('maxAttempts must be between 1 and 10');
  }
  
  if (config.timeoutMs < 10000) {
    errors.push('timeoutMs must be at least 10 seconds');
  }
  
  if (!config.testRunner.commands.jest) {
    errors.push('Jest test runner configuration is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  getConfig,
  validateConfig,
  config: getConfig()
};