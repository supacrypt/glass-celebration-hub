/**
 * Error Analyzer - Parses test output and classifies errors
 */

const fs = require('fs');
const path = require('path');

class ErrorAnalyzer {
  constructor() {
    this.errorPatterns = {
      import: {
        patterns: [
          /Cannot resolve module ['"`]([^'"`]+)['"`]/,
          /Module not found: Error: Can't resolve ['"`]([^'"`]+)['"`]/,
          /Cannot find module ['"`]([^'"`]+)['"`]/,
          /Failed to resolve import ['"`]([^'"`]+)['"`]/,
          /SyntaxError: Cannot use import statement outside a module/,
          /Error: \[ERR_MODULE_NOT_FOUND\]: Cannot find package ['"`]([^'"`]+)['"`]/
        ],
        severity: 'high',
        category: 'dependency'
      },
      
      export: {
        patterns: [
          /export '([^']+)' \(imported as '([^']+)'\) was not found in ['"`]([^'"`]+)['"`]/,
          /Attempted import error: ['"`]([^'"`]+)['"`] does not contain a default export/,
          /Named export '([^']+)' not found/,
          /SyntaxError: Unexpected token 'export'/
        ],
        severity: 'high',
        category: 'dependency'
      },
      
      typescript: {
        patterns: [
          /Property '([^']+)' does not exist on type '([^']+)'/,
          /Type '([^']+)' is not assignable to type '([^']+)'/,
          /Argument of type '([^']+)' is not assignable to parameter of type '([^']+)'/,
          /Cannot find name '([^']+)'/,
          /Type '([^']+)' has no properties in common with type '([^']+)'/,
          /Object is possibly 'null'/,
          /Object is possibly 'undefined'/
        ],
        severity: 'medium',
        category: 'types'
      },
      
      database: {
        patterns: [
          /Table '([^']+)' doesn't exist/,
          /Unknown column '([^']+)' in '([^']+)'/,
          /relation "([^"]+)" does not exist/,
          /no such table: ([^\s]+)/,
          /column "([^"]+)" of relation "([^"]+)" does not exist/
        ],
        severity: 'critical',
        category: 'database'
      },
      
      react: {
        patterns: [
          /Cannot read propert(?:y|ies) '([^']+)' of undefined/,
          /Cannot read propert(?:y|ies) '([^']+)' of null/,
          /Warning: Failed prop type: Invalid prop `([^`]+)` of type `([^`]+)` supplied to `([^`]+)`, expected `([^`]+)`/,
          /Warning: React.createElement: type is invalid/,
          /Warning: Each child in a list should have a unique "key" prop/,
          /Hook "([^"]+)" cannot be called conditionally/,
          /Rendered more hooks than during the previous render/
        ],
        severity: 'medium',
        category: 'react'
      },
      
      syntax: {
        patterns: [
          /SyntaxError: Unexpected token/,
          /SyntaxError: Unexpected end of input/,
          /SyntaxError: Missing semicolon/,
          /SyntaxError: Unexpected identifier/,
          /Parsing error: Unexpected token/
        ],
        severity: 'high',
        category: 'syntax'
      },
      
      testing: {
        patterns: [
          /expect\(received\).toBe\(expected\)/,
          /expect\(received\).toEqual\(expected\)/,
          /Unable to find an element/,
          /TestingLibraryElementError/,
          /Timeout - Async callback was not invoked within the 5000 ms timeout/,
          /Cannot find element with testid: "([^"]+)"/
        ],
        severity: 'low',
        category: 'assertion'
      }
    };
  }

  /**
   * Analyze test output and extract errors
   */
  analyzeTestOutput(testOutput) {
    const lines = testOutput.split('\n');
    const errors = [];
    let currentError = null;
    let inStackTrace = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;

      // Check for test failure markers
      if (line.includes('FAIL') || line.includes('✕') || line.includes('×')) {
        if (currentError) {
          errors.push(currentError);
        }
        
        currentError = {
          file: this.extractFilePath(line),
          type: 'unknown',
          category: 'unknown',
          severity: 'medium',
          message: line,
          stackTrace: [],
          lineNumber: null,
          column: null
        };
        inStackTrace = false;
      }
      
      // Analyze error patterns
      if (currentError) {
        const classification = this.classifyError(line);
        if (classification) {
          currentError.type = classification.type;
          currentError.category = classification.category;
          currentError.severity = classification.severity;
          currentError.matches = classification.matches;
        }

        // Extract line numbers and file paths
        const locationMatch = line.match(/at.*\(([^:]+):(\d+):(\d+)\)/);
        if (locationMatch) {
          currentError.file = currentError.file || locationMatch[1];
          currentError.lineNumber = parseInt(locationMatch[2]);
          currentError.column = parseInt(locationMatch[3]);
          inStackTrace = true;
        }

        // Collect stack trace
        if (inStackTrace || line.startsWith('    at ')) {
          currentError.stackTrace.push(line);
        }
      }
    }

    // Add the last error if exists
    if (currentError) {
      errors.push(currentError);
    }

    return this.deduplicateErrors(errors);
  }

  /**
   * Classify error based on patterns
   */
  classifyError(errorMessage) {
    for (const [type, config] of Object.entries(this.errorPatterns)) {
      for (const pattern of config.patterns) {
        const match = errorMessage.match(pattern);
        if (match) {
          return {
            type,
            category: config.category,
            severity: config.severity,
            matches: match
          };
        }
      }
    }
    return null;
  }

  /**
   * Extract file path from error line
   */
  extractFilePath(line) {
    // Try various formats
    const patterns = [
      /FAIL\s+(.+\.(?:js|ts|jsx|tsx|spec\.js|test\.js))/,
      /×\s+(.+\.(?:js|ts|jsx|tsx|spec\.js|test\.js))/,
      /Error in\s+(.+\.(?:js|ts|jsx|tsx))/,
      /at\s+(.+\.(?:js|ts|jsx|tsx)):(\d+):(\d+)/
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Remove duplicate errors
   */
  deduplicateErrors(errors) {
    const seen = new Set();
    return errors.filter(error => {
      const key = `${error.file}:${error.type}:${error.message}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Generate error summary
   */
  generateSummary(errors) {
    const summary = {
      total: errors.length,
      byCategory: {},
      bySeverity: {},
      byType: {},
      files: new Set()
    };

    errors.forEach(error => {
      // Count by category
      summary.byCategory[error.category] = (summary.byCategory[error.category] || 0) + 1;
      
      // Count by severity
      summary.bySeverity[error.severity] = (summary.bySeverity[error.severity] || 0) + 1;
      
      // Count by type
      summary.byType[error.type] = (summary.byType[error.type] || 0) + 1;
      
      // Track files
      if (error.file) {
        summary.files.add(error.file);
      }
    });

    summary.files = Array.from(summary.files);
    return summary;
  }
}

module.exports = ErrorAnalyzer;