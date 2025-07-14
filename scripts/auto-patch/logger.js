/**
 * Logger - Comprehensive logging and reporting system
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), '.auto-patch', 'logs');
    this.currentSession = this.generateSessionId();
    this.sessionLogFile = path.join(this.logDir, `session-${this.currentSession}.log`);
    this.summaryFile = path.join(this.logDir, 'patch_cycle_log.md');
    
    this.ensureLogDirectory();
    this.startSession();
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Ensure log directory exists
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Start new logging session
   */
  startSession() {
    const sessionStart = {
      sessionId: this.currentSession,
      startTime: new Date().toISOString(),
      type: 'session_start'
    };
    
    this.writeLog(sessionStart);
    console.log(`📝 Starting auto-patch session: ${this.currentSession}`);
  }

  /**
   * Write log entry
   */
  writeLog(entry) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      sessionId: this.currentSession,
      ...entry
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(this.sessionLogFile, logLine);
  }

  /**
   * Log test execution results
   */
  logTestExecution(testResults) {
    this.writeLog({
      type: 'test_execution',
      results: testResults,
      summary: this.generateTestSummary(testResults)
    });
    
    console.log(`📊 Test execution logged: ${Object.keys(testResults).length} suites`);
  }

  /**
   * Log error analysis results
   */
  logErrorAnalysis(errors, summary) {
    this.writeLog({
      type: 'error_analysis',
      errorCount: errors.length,
      errors: errors.map(e => ({
        type: e.type,
        category: e.category,
        severity: e.severity,
        file: e.file,
        message: e.message.substring(0, 200) // Truncate long messages
      })),
      summary
    });
    
    console.log(`🔍 Error analysis logged: ${errors.length} errors found`);
  }

  /**
   * Log patch generation results
   */
  logPatchGeneration(patches) {
    this.writeLog({
      type: 'patch_generation',
      patchCount: patches.length,
      patches: patches.map(p => ({
        errorType: p.error.type,
        strategy: p.strategy,
        confidence: p.patch.confidence,
        description: p.patch.description,
        hasChanges: p.patch.changes && p.patch.changes.length > 0
      }))
    });
    
    console.log(`🔧 Patch generation logged: ${patches.length} patches created`);
  }

  /**
   * Log patch application results
   */
  logPatchApplication(results, attempt) {
    this.writeLog({
      type: 'patch_application',
      attempt,
      totalPatches: results.results.length,
      successCount: results.successCount,
      failureCount: results.failureCount,
      results: results.results.map(r => ({
        success: r.success,
        type: r.type,
        strategy: r.patch?.strategy,
        errorType: r.patch?.error?.type,
        file: r.patch?.error?.file,
        changes: r.changes
      }))
    });
    
    console.log(`✅ Patch application logged: ${results.successCount}/${results.results.length} successful`);
  }

  /**
   * Log cycle completion
   */
  logCycleCompletion(cycleResults) {
    this.writeLog({
      type: 'cycle_completion',
      ...cycleResults,
      endTime: new Date().toISOString()
    });
    
    console.log(`🏁 Cycle completion logged`);
  }

  /**
   * Generate comprehensive patch cycle log
   */
  async generatePatchCycleLog(sessionData) {
    const logContent = this.buildMarkdownReport(sessionData);
    fs.writeFileSync(this.summaryFile, logContent);
    
    console.log(`📋 Patch cycle log generated: ${this.summaryFile}`);
    return this.summaryFile;
  }

  /**
   * Build markdown report
   */
  buildMarkdownReport(sessionData) {
    const {
      session,
      testResults,
      errors,
      errorSummary,
      patches,
      patchResults,
      cycleResults,
      performance
    } = sessionData;

    return `# Auto-Patch Cycle Log

## Session Information
- **Session ID**: ${session.sessionId}
- **Start Time**: ${session.startTime}
- **End Time**: ${session.endTime || 'In Progress'}
- **Duration**: ${this.formatDuration(session.duration)}

## Executive Summary
- **Total Errors Detected**: ${errors.length}
- **Patches Generated**: ${patches.length}
- **Successful Patches**: ${patchResults.successCount}
- **Failed Patches**: ${patchResults.failureCount}
- **Success Rate**: ${this.calculateSuccessRate(patchResults)}%

## Test Execution Results

${this.buildTestResultsSection(testResults)}

## Error Analysis

### Error Distribution by Category
${this.buildErrorDistributionTable(errorSummary.byCategory)}

### Error Distribution by Severity
${this.buildErrorDistributionTable(errorSummary.bySeverity)}

### Detailed Error List
${this.buildDetailedErrorList(errors)}

## Patch Generation & Application

### Patch Strategy Success Rates
${this.buildPatchStrategyTable(patchResults)}

### Detailed Patch Results
${this.buildDetailedPatchResults(patchResults)}

## Performance Metrics
${this.buildPerformanceSection(performance)}

## Manual Intervention Required

${this.buildManualInterventionSection(patchResults)}

## Recommendations

${this.buildRecommendationsSection(sessionData)}

---
*Generated on ${new Date().toISOString()} by Auto-Patch System*
`;
  }

  /**
   * Build test results section
   */
  buildTestResultsSection(testResults) {
    let section = '| Test Suite | Status | Duration | Errors |\n';
    section += '|------------|--------|----------|--------|\n';
    
    for (const [suite, result] of Object.entries(testResults)) {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      const duration = this.formatDuration(result.duration);
      const errors = result.success ? '-' : '🔴';
      
      section += `| ${suite} | ${status} | ${duration} | ${errors} |\n`;
    }
    
    return section;
  }

  /**
   * Build error distribution table
   */
  buildErrorDistributionTable(distribution) {
    let table = '| Type | Count | Percentage |\n';
    table += '|------|-------|------------|\n';
    
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    for (const [type, count] of Object.entries(distribution)) {
      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
      table += `| ${type} | ${count} | ${percentage}% |\n`;
    }
    
    return table;
  }

  /**
   * Build detailed error list
   */
  buildDetailedErrorList(errors) {
    return errors.slice(0, 20).map((error, index) => {
      return `### Error ${index + 1}: ${error.type}

- **File**: \`${error.file || 'Unknown'}\`
- **Category**: ${error.category}
- **Severity**: ${this.getSeverityEmoji(error.severity)} ${error.severity}
- **Message**: ${error.message.substring(0, 300)}${error.message.length > 300 ? '...' : ''}
${error.lineNumber ? `- **Line**: ${error.lineNumber}` : ''}
`;
    }).join('\n');
  }

  /**
   * Build patch strategy table
   */
  buildPatchStrategyTable(patchResults) {
    const strategyStats = {};
    
    patchResults.results.forEach(result => {
      const strategy = result.patch?.strategy || 'unknown';
      if (!strategyStats[strategy]) {
        strategyStats[strategy] = { total: 0, success: 0 };
      }
      strategyStats[strategy].total++;
      if (result.success) {
        strategyStats[strategy].success++;
      }
    });
    
    let table = '| Strategy | Success | Total | Rate |\n';
    table += '|----------|---------|-------|------|\n';
    
    for (const [strategy, stats] of Object.entries(strategyStats)) {
      const rate = stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : '0.0';
      table += `| ${strategy} | ${stats.success} | ${stats.total} | ${rate}% |\n`;
    }
    
    return table;
  }

  /**
   * Build detailed patch results
   */
  buildDetailedPatchResults(patchResults) {
    return patchResults.results.slice(0, 15).map((result, index) => {
      const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
      const strategy = result.patch?.strategy || 'Unknown';
      const errorType = result.patch?.error?.type || 'Unknown';
      const file = result.patch?.error?.file || 'Unknown';
      
      return `#### Patch ${index + 1}: ${status}

- **Strategy**: ${strategy}
- **Error Type**: ${errorType}
- **File**: \`${file}\`
- **Type**: ${result.type || 'applied'}
${result.message ? `- **Message**: ${result.message}` : ''}
${result.changes ? `- **Changes**: ${result.changes} modifications` : ''}
`;
    }).join('\n');
  }

  /**
   * Build performance section
   */
  buildPerformanceSection(performance) {
    if (!performance) {
      return 'Performance data not available.';
    }

    return `- **Total Execution Time**: ${this.formatDuration(performance.totalTime)}
- **Test Execution Time**: ${this.formatDuration(performance.testTime)}
- **Error Analysis Time**: ${this.formatDuration(performance.analysisTime)}
- **Patch Generation Time**: ${this.formatDuration(performance.patchTime)}
- **Patch Application Time**: ${this.formatDuration(performance.applicationTime)}
- **Average Time per Error**: ${this.formatDuration(performance.avgTimePerError)}
- **Average Time per Patch**: ${this.formatDuration(performance.avgTimePerPatch)}`;
  }

  /**
   * Build manual intervention section
   */
  buildManualInterventionSection(patchResults) {
    const manualInterventions = patchResults.results.filter(r => 
      !r.success || r.type === 'suggestion'
    );

    if (manualInterventions.length === 0) {
      return '✅ No manual intervention required. All patches were applied successfully.';
    }

    let section = `⚠️ **${manualInterventions.length} items require manual attention:**\n\n`;
    
    manualInterventions.forEach((result, index) => {
      const file = result.patch?.error?.file || 'Unknown';
      const strategy = result.patch?.strategy || 'Unknown';
      const message = result.message || result.error || 'Unknown issue';
      
      section += `${index + 1}. **File**: \`${file}\`\n`;
      section += `   **Strategy**: ${strategy}\n`;
      section += `   **Issue**: ${message}\n\n`;
    });

    return section;
  }

  /**
   * Build recommendations section
   */
  buildRecommendationsSection(sessionData) {
    const recommendations = [];
    const { errorSummary, patchResults } = sessionData;

    // Analyze error patterns
    if (errorSummary.byCategory.import > 5) {
      recommendations.push('Consider reviewing import organization and dependency management');
    }
    
    if (errorSummary.byCategory.typescript > 3) {
      recommendations.push('Review TypeScript configuration and type definitions');
    }
    
    if (errorSummary.bySeverity.critical > 0) {
      recommendations.push('⚠️ Critical errors detected - immediate attention required');
    }

    // Analyze patch success rates
    const successRate = this.calculateSuccessRate(patchResults);
    if (successRate < 70) {
      recommendations.push('Low patch success rate - consider improving error patterns or manual review');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ System is performing well. Consider running auto-patch regularly.');
    }

    return recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n');
  }

  /**
   * Get severity emoji
   */
  getSeverityEmoji(severity) {
    const emojis = {
      critical: '🔥',
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return emojis[severity] || '⚪';
  }

  /**
   * Format duration
   */
  formatDuration(ms) {
    if (!ms) return '0ms';
    
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  }

  /**
   * Calculate success rate
   */
  calculateSuccessRate(patchResults) {
    if (patchResults.results.length === 0) return 0;
    return ((patchResults.successCount / patchResults.results.length) * 100).toFixed(1);
  }

  /**
   * Generate test summary
   */
  generateTestSummary(testResults) {
    return {
      totalSuites: Object.keys(testResults).length,
      passedSuites: Object.values(testResults).filter(r => r.success).length,
      failedSuites: Object.values(testResults).filter(r => !r.success).length,
      totalDuration: Object.values(testResults).reduce((sum, r) => sum + (r.duration || 0), 0)
    };
  }

  /**
   * Read session logs
   */
  readSessionLogs() {
    if (!fs.existsSync(this.sessionLogFile)) {
      return [];
    }

    const content = fs.readFileSync(this.sessionLogFile, 'utf8');
    return content.trim().split('\n').filter(line => line).map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(Boolean);
  }

  /**
   * Get all session files
   */
  getAllSessions() {
    try {
      const files = fs.readdirSync(this.logDir);
      return files
        .filter(f => f.startsWith('session-') && f.endsWith('.log'))
        .map(f => ({
          file: f,
          path: path.join(this.logDir, f),
          sessionId: f.replace('session-', '').replace('.log', ''),
          created: fs.statSync(path.join(this.logDir, f)).mtime
        }))
        .sort((a, b) => b.created - a.created);
    } catch (error) {
      return [];
    }
  }
}

module.exports = Logger;