/**
 * Patch Applier - Applies generated patches and tracks results
 */

const fs = require('fs');
const path = require('path');

class PatchApplier {
  constructor() {
    this.backupDir = path.join(process.cwd(), '.auto-patch', 'backups');
    this.logFile = path.join(process.cwd(), '.auto-patch', 'patch.log');
    this.maxAttempts = 3;
    
    this.ensureDirectories();
  }

  /**
   * Ensure backup and log directories exist
   */
  ensureDirectories() {
    if (!fs.existsSync(path.dirname(this.backupDir))) {
      fs.mkdirSync(path.dirname(this.backupDir), { recursive: true });
    }
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    if (!fs.existsSync(path.dirname(this.logFile))) {
      fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
    }
  }

  /**
   * Apply patches with retry logic
   */
  async applyPatches(patches, attempt = 1) {
    const results = [];
    const appliedPatches = [];
    
    console.log(`🔧 Applying ${patches.length} patches (attempt ${attempt}/${this.maxAttempts})`);
    
    for (const patchGroup of patches) {
      try {
        const result = await this.applySinglePatch(patchGroup, attempt);
        results.push(result);
        
        if (result.success) {
          appliedPatches.push(patchGroup);
        }
        
      } catch (error) {
        results.push({
          success: false,
          patch: patchGroup,
          error: error.message,
          attempt
        });
      }
    }
    
    this.logPatchResults(results, attempt);
    
    return {
      results,
      appliedPatches,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length
    };
  }

  /**
   * Apply a single patch
   */
  async applySinglePatch(patchGroup, attempt) {
    const { error, strategy, patch } = patchGroup;
    
    console.log(`  📝 Applying ${strategy} for ${error.type} error in ${error.file}`);
    
    if (!patch.changes || patch.changes.length === 0) {
      // This is a suggestion-only patch
      return {
        success: true,
        patch: patchGroup,
        type: 'suggestion',
        message: patch.suggestion || patch.description,
        attempt
      };
    }
    
    const backups = [];
    
    try {
      // Create backups before applying changes
      for (const change of patch.changes) {
        if (fs.existsSync(change.file)) {
          const backup = await this.createBackup(change.file, attempt);
          backups.push(backup);
        }
      }
      
      // Apply changes
      for (const change of patch.changes) {
        if (change.content) {
          // Write new content
          fs.writeFileSync(change.file, change.content, 'utf8');
        } else if (change.insertAt !== undefined) {
          // Insert content at specific location
          await this.insertContent(change.file, change.insertAt, change.insertContent);
        } else if (change.replace) {
          // Replace specific content
          await this.replaceContent(change.file, change.replace.from, change.replace.to);
        }
      }
      
      return {
        success: true,
        patch: patchGroup,
        type: 'applied',
        backups,
        changes: patch.changes.length,
        attempt
      };
      
    } catch (error) {
      // Restore backups on failure
      for (const backup of backups) {
        try {
          fs.copyFileSync(backup.backupPath, backup.originalPath);
        } catch (restoreError) {
          console.error(`Failed to restore backup ${backup.backupPath}:`, restoreError.message);
        }
      }
      
      throw error;
    }
  }

  /**
   * Create backup of file
   */
  async createBackup(filePath, attempt) {
    const fileName = path.basename(filePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `${fileName}.${timestamp}.attempt-${attempt}.backup`;
    const backupPath = path.join(this.backupDir, backupFileName);
    
    fs.copyFileSync(filePath, backupPath);
    
    return {
      originalPath: filePath,
      backupPath,
      timestamp,
      attempt
    };
  }

  /**
   * Insert content at specific line
   */
  async insertContent(filePath, lineNumber, content) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    
    lines.splice(lineNumber, 0, content);
    
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  }

  /**
   * Replace content in file
   */
  async replaceContent(filePath, fromPattern, toContent) {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    
    if (typeof fromPattern === 'string') {
      fileContent = fileContent.replace(fromPattern, toContent);
    } else if (fromPattern instanceof RegExp) {
      fileContent = fileContent.replace(fromPattern, toContent);
    }
    
    fs.writeFileSync(filePath, fileContent, 'utf8');
  }

  /**
   * Rollback patches
   */
  async rollbackPatches(results) {
    console.log('🔄 Rolling back patches...');
    
    const rollbackResults = [];
    
    for (const result of results) {
      if (result.success && result.backups) {
        for (const backup of result.backups) {
          try {
            fs.copyFileSync(backup.backupPath, backup.originalPath);
            rollbackResults.push({
              success: true,
              file: backup.originalPath,
              backup: backup.backupPath
            });
          } catch (error) {
            rollbackResults.push({
              success: false,
              file: backup.originalPath,
              error: error.message
            });
          }
        }
      }
    }
    
    return rollbackResults;
  }

  /**
   * Clean old backups
   */
  async cleanBackups(olderThanDays = 7) {
    const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
    
    try {
      const files = fs.readdirSync(this.backupDir);
      let cleaned = 0;
      
      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
          cleaned++;
        }
      }
      
      console.log(`🧹 Cleaned ${cleaned} old backup files`);
      return cleaned;
    } catch (error) {
      console.warn('Failed to clean backups:', error.message);
      return 0;
    }
  }

  /**
   * Log patch results
   */
  logPatchResults(results, attempt) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      attempt,
      results: results.map(r => ({
        success: r.success,
        type: r.type || 'applied',
        error: r.patch?.error?.type,
        strategy: r.patch?.strategy,
        file: r.patch?.error?.file,
        message: r.message || r.error,
        changes: r.changes
      }))
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(this.logFile, logLine);
  }

  /**
   * Get patch statistics
   */
  async getPatchStatistics() {
    if (!fs.existsSync(this.logFile)) {
      return {
        totalAttempts: 0,
        successfulPatches: 0,
        failedPatches: 0,
        byErrorType: {},
        byStrategy: {},
        recentActivity: []
      };
    }
    
    const logContent = fs.readFileSync(this.logFile, 'utf8');
    const entries = logContent.trim().split('\n').filter(line => line).map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(Boolean);
    
    const stats = {
      totalAttempts: entries.length,
      successfulPatches: 0,
      failedPatches: 0,
      byErrorType: {},
      byStrategy: {},
      recentActivity: entries.slice(-10)
    };
    
    entries.forEach(entry => {
      entry.results.forEach(result => {
        if (result.success) {
          stats.successfulPatches++;
        } else {
          stats.failedPatches++;
        }
        
        // Count by error type
        if (result.error) {
          stats.byErrorType[result.error] = (stats.byErrorType[result.error] || 0) + 1;
        }
        
        // Count by strategy
        if (result.strategy) {
          stats.byStrategy[result.strategy] = (stats.byStrategy[result.strategy] || 0) + 1;
        }
      });
    });
    
    return stats;
  }

  /**
   * Validate patch before applying
   */
  validatePatch(patch) {
    const errors = [];
    
    if (!patch.changes || !Array.isArray(patch.changes)) {
      errors.push('Patch must have changes array');
    }
    
    for (const change of patch.changes || []) {
      if (!change.file) {
        errors.push('Change must specify file path');
      }
      
      if (!change.content && !change.insertContent && !change.replace) {
        errors.push('Change must specify content, insertContent, or replace');
      }
      
      if (change.file && !fs.existsSync(change.file)) {
        errors.push(`File does not exist: ${change.file}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get backup information
   */
  getBackupInfo() {
    try {
      const files = fs.readdirSync(this.backupDir);
      const backups = files.map(file => {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          file,
          path: filePath,
          size: stats.size,
          created: stats.mtime,
          originalFile: file.split('.')[0]
        };
      });
      
      return {
        count: backups.length,
        totalSize: backups.reduce((sum, b) => sum + b.size, 0),
        backups: backups.sort((a, b) => b.created - a.created)
      };
    } catch (error) {
      return {
        count: 0,
        totalSize: 0,
        backups: [],
        error: error.message
      };
    }
  }
}

module.exports = PatchApplier;