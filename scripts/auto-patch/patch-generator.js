/**
 * Patch Generator - Creates automated fixes for common test failures
 */

const fs = require('fs');
const path = require('path');

class PatchGenerator {
  constructor() {
    this.patchStrategies = {
      import: [
        'fixMissingImports',
        'fixRelativePaths', 
        'fixTypoInImports',
        'addMissingPackages'
      ],
      export: [
        'fixDefaultExports',
        'fixNamedExports',
        'addMissingExports'
      ],
      typescript: [
        'addTypeAssertions',
        'fixPropertyAccess',
        'addNullChecks',
        'fixTypeDefinitions'
      ],
      database: [
        'fixTableNames',
        'fixColumnNames',
        'updateMigrations'
      ],
      react: [
        'fixPropTypes',
        'addKeys',
        'fixHookDependencies',
        'addNullChecks'
      ],
      syntax: [
        'fixSyntaxErrors',
        'addMissingSemicolons',
        'fixBraces'
      ]
    };

    this.commonImports = {
      'react': "import React from 'react';",
      '@testing-library/react': "import { render, screen, fireEvent } from '@testing-library/react';",
      '@testing-library/jest-dom': "import '@testing-library/jest-dom';",
      'jest': "import { jest } from '@jest/globals';",
      '@storybook/react': "import type { Meta, StoryObj } from '@storybook/react';"
    };

    this.typeDefinitions = {
      'NuptilyCoreProps': `interface NuptilyCoreProps {
  variant?: 'glass' | 'neumorphic' | 'hybrid';
  auroraIntensity?: 'none' | 'subtle' | 'medium' | 'intense';
  elevation?: 'flat' | 'raised' | 'sunken' | 'hovering' | 'floating';
  theme?: 'light' | 'dark' | 'auto';
  interactive?: boolean;
  goldAccent?: boolean;
  performanceLevel?: 'lite' | 'balanced' | 'full';
  className?: string;
  children?: React.ReactNode;
}`,
      'StoryConfig': `type StoryConfig = {
  title: string;
  component: React.ComponentType<any>;
  parameters?: any;
  argTypes?: any;
}`
    };
  }

  /**
   * Generate patches for detected errors
   */
  async generatePatches(errors) {
    const patches = [];

    for (const error of errors) {
      const strategies = this.patchStrategies[error.type] || [];
      
      for (const strategy of strategies) {
        try {
          const patch = await this[strategy](error);
          if (patch) {
            patches.push({
              error,
              strategy,
              patch,
              confidence: patch.confidence || 0.5
            });
            break; // Use first successful strategy
          }
        } catch (e) {
          console.warn(`Strategy ${strategy} failed for error:`, e.message);
        }
      }
    }

    return this.prioritizePatches(patches);
  }

  /**
   * Fix missing imports
   */
  async fixMissingImports(error) {
    if (!error.file || !fs.existsSync(error.file)) return null;

    const content = fs.readFileSync(error.file, 'utf8');
    const lines = content.split('\n');
    
    // Extract missing module from error
    const moduleMatch = error.message.match(/Cannot resolve module ['"`]([^'"`]+)['"`]/) ||
                       error.message.match(/Module not found.*['"`]([^'"`]+)['"`]/) ||
                       error.message.match(/Cannot find module ['"`]([^'"`]+)['"`]/);
    
    if (!moduleMatch) return null;
    
    const missingModule = moduleMatch[1];
    
    // Check if it's a known common import
    if (this.commonImports[missingModule]) {
      const importLine = this.commonImports[missingModule];
      
      // Find where to insert the import
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          insertIndex = i + 1;
        } else if (lines[i].trim() === '' && insertIndex > 0) {
          break;
        }
      }
      
      lines.splice(insertIndex, 0, importLine);
      
      return {
        type: 'import',
        description: `Add missing import for ${missingModule}`,
        changes: [{
          file: error.file,
          content: lines.join('\n')
        }],
        confidence: 0.9
      };
    }

    // Try to fix relative path imports
    if (missingModule.startsWith('./') || missingModule.startsWith('../')) {
      return this.fixRelativePathImport(error, missingModule);
    }

    return null;
  }

  /**
   * Fix relative path imports
   */
  async fixRelativePathImport(error, modulePath) {
    const basePath = path.dirname(error.file);
    const targetPath = path.resolve(basePath, modulePath);
    
    // Try different extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
    let foundPath = null;
    
    for (const ext of extensions) {
      const testPath = targetPath + ext;
      if (fs.existsSync(testPath)) {
        foundPath = testPath;
        break;
      }
    }
    
    // Try index files
    if (!foundPath) {
      for (const ext of extensions) {
        const indexPath = path.join(targetPath, `index${ext}`);
        if (fs.existsSync(indexPath)) {
          foundPath = indexPath;
          break;
        }
      }
    }
    
    if (foundPath) {
      const relativePath = path.relative(basePath, foundPath).replace(/\\/g, '/');
      const correctedPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
      
      const content = fs.readFileSync(error.file, 'utf8');
      const newContent = content.replace(
        new RegExp(`['"\`]${modulePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`, 'g'),
        `'${correctedPath.replace(/\.(ts|tsx|js|jsx)$/, '')}'`
      );
      
      return {
        type: 'import',
        description: `Fix relative path ${modulePath} to ${correctedPath}`,
        changes: [{
          file: error.file,
          content: newContent
        }],
        confidence: 0.8
      };
    }
    
    return null;
  }

  /**
   * Fix typos in imports
   */
  async fixTypoInImports(error) {
    if (!error.file || !fs.existsSync(error.file)) return null;
    
    const content = fs.readFileSync(error.file, 'utf8');
    const typoFixes = {
      'react-dom': 'react-dom',
      'reac': 'react',
      '@testing-libray': '@testing-library',
      'jest-dom': '@testing-library/jest-dom',
      'storyboo': '@storybook'
    };
    
    let hasChanges = false;
    let newContent = content;
    
    for (const [typo, correct] of Object.entries(typoFixes)) {
      const regex = new RegExp(`['"\`]${typo}['"\`]`, 'g');
      if (regex.test(newContent)) {
        newContent = newContent.replace(regex, `'${correct}'`);
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      return {
        type: 'import',
        description: 'Fix import typos',
        changes: [{
          file: error.file,
          content: newContent
        }],
        confidence: 0.7
      };
    }
    
    return null;
  }

  /**
   * Fix default exports
   */
  async fixDefaultExports(error) {
    if (!error.file || !fs.existsSync(error.file)) return null;
    
    const content = fs.readFileSync(error.file, 'utf8');
    
    // Check if the file has a component but no default export
    const componentMatch = content.match(/(?:function|const|class)\s+([A-Z][a-zA-Z0-9]*)/);
    if (componentMatch && !content.includes('export default')) {
      const componentName = componentMatch[1];
      const lines = content.split('\n');
      
      // Add default export at the end
      lines.push('', `export default ${componentName};`);
      
      return {
        type: 'export',
        description: `Add default export for ${componentName}`,
        changes: [{
          file: error.file,
          content: lines.join('\n')
        }],
        confidence: 0.8
      };
    }
    
    return null;
  }

  /**
   * Fix named exports
   */
  async fixNamedExports(error) {
    if (!error.matches || !error.file) return null;
    
    const exportName = error.matches[1];
    const content = fs.readFileSync(error.file, 'utf8');
    
    // Check if the export exists but with different name
    const similarExports = content.match(/export\s+(?:const|function|class)\s+([a-zA-Z0-9_]+)/g);
    if (similarExports) {
      for (const exp of similarExports) {
        const match = exp.match(/export\s+(?:const|function|class)\s+([a-zA-Z0-9_]+)/);
        if (match && this.calculateSimilarity(match[1], exportName) > 0.8) {
          // Suggest the similar export
          return {
            type: 'export',
            description: `Suggest using ${match[1]} instead of ${exportName}`,
            changes: [], // This requires manual review
            confidence: 0.6,
            suggestion: `Consider using '${match[1]}' instead of '${exportName}'`
          };
        }
      }
    }
    
    return null;
  }

  /**
   * Add type assertions
   */
  async addTypeAssertions(error) {
    if (!error.file || !fs.existsSync(error.file)) return null;
    
    const content = fs.readFileSync(error.file, 'utf8');
    
    // Fix "Object is possibly 'null'" or 'undefined'
    if (error.message.includes("Object is possibly 'null'") || 
        error.message.includes("Object is possibly 'undefined'")) {
      
      const lines = content.split('\n');
      if (error.lineNumber && lines[error.lineNumber - 1]) {
        const line = lines[error.lineNumber - 1];
        
        // Add null check
        const nullCheckPatterns = [
          { pattern: /(\w+)\.(\w+)/, replacement: '$1?.$2' },
          { pattern: /(\w+)\[(\w+)\]/, replacement: '$1?.[$2]' }
        ];
        
        let newLine = line;
        let hasChanges = false;
        
        for (const {pattern, replacement} of nullCheckPatterns) {
          if (pattern.test(newLine)) {
            newLine = newLine.replace(pattern, replacement);
            hasChanges = true;
            break;
          }
        }
        
        if (hasChanges) {
          lines[error.lineNumber - 1] = newLine;
          
          return {
            type: 'typescript',
            description: 'Add optional chaining for null safety',
            changes: [{
              file: error.file,
              content: lines.join('\n')
            }],
            confidence: 0.7
          };
        }
      }
    }
    
    return null;
  }

  /**
   * Fix table names (database errors)
   */
  async fixTableNames(error) {
    if (!error.matches) return null;
    
    const tableName = error.matches[1];
    
    // Common table name corrections
    const tableCorrections = {
      'user': 'users',
      'wedding': 'weddings',
      'vendor': 'vendors',
      'guest': 'guests',
      'venue': 'venues'
    };
    
    const correction = tableCorrections[tableName.toLowerCase()];
    if (correction) {
      return {
        type: 'database',
        description: `Suggest changing table name from '${tableName}' to '${correction}'`,
        changes: [],
        confidence: 0.6,
        suggestion: `Consider using table name '${correction}' instead of '${tableName}'`
      };
    }
    
    return null;
  }

  /**
   * Fix React prop types
   */
  async fixPropTypes(error) {
    if (!error.file || !fs.existsSync(error.file)) return null;
    
    const content = fs.readFileSync(error.file, 'utf8');
    
    // Fix missing key props
    if (error.message.includes('unique "key" prop')) {
      const lines = content.split('\n');
      let hasChanges = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Look for .map without key prop
        if (line.includes('.map(') && !line.includes('key=')) {
          const mapMatch = line.match(/(\w+)\.map\(\((\w+)(?:,\s*(\w+))?\)\s*=>/);
          if (mapMatch) {
            const [, arrayName, itemName, indexName] = mapMatch;
            const keyValue = indexName || 'index';
            
            // Add key prop to the JSX element
            const jsxPattern = /<(\w+)([^>]*)>/;
            const jsxMatch = line.match(jsxPattern);
            if (jsxMatch) {
              const [fullMatch, tagName, props] = jsxMatch;
              const newElement = `<${tagName} key={${keyValue}}${props}>`;
              lines[i] = line.replace(fullMatch, newElement);
              hasChanges = true;
            }
          }
        }
      }
      
      if (hasChanges) {
        return {
          type: 'react',
          description: 'Add missing key props to list items',
          changes: [{
            file: error.file,
            content: lines.join('\n')
          }],
          confidence: 0.8
        };
      }
    }
    
    return null;
  }

  /**
   * Fix hook dependencies
   */
  async fixHookDependencies(error) {
    if (!error.file || !fs.existsSync(error.file)) return null;
    
    const content = fs.readFileSync(error.file, 'utf8');
    const lines = content.split('\n');
    
    // Find useEffect with missing dependencies
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('useEffect(') && i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        
        // Check if dependency array is empty but function uses variables
        if (nextLine.includes('[]') || nextLine.includes('}, [])')) {
          const effectBody = this.extractEffectBody(lines, i);
          const dependencies = this.extractDependencies(effectBody);
          
          if (dependencies.length > 0) {
            lines[i + 1] = nextLine.replace('[]', `[${dependencies.join(', ')}]`)
                                   .replace('}, [])', `}, [${dependencies.join(', ')}])`);
            
            return {
              type: 'react',
              description: 'Add missing useEffect dependencies',
              changes: [{
                file: error.file,
                content: lines.join('\n')
              }],
              confidence: 0.7
            };
          }
        }
      }
    }
    
    return null;
  }

  /**
   * Calculate string similarity
   */
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Extract useEffect body
   */
  extractEffectBody(lines, startIndex) {
    let body = '';
    let braceCount = 0;
    let started = false;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('useEffect(')) {
        started = true;
      }
      
      if (started) {
        body += line + '\n';
        
        for (const char of line) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }
        
        if (braceCount === 0 && started) {
          break;
        }
      }
    }
    
    return body;
  }

  /**
   * Extract dependencies from effect body
   */
  extractDependencies(effectBody) {
    const dependencies = new Set();
    
    // Look for variable usage (simplified)
    const variablePattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
    let match;
    
    while ((match = variablePattern.exec(effectBody)) !== null) {
      const variable = match[1];
      
      // Skip common keywords and built-ins
      const skip = ['const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 
                   'return', 'console', 'document', 'window', 'setTimeout', 'setInterval'];
      
      if (!skip.includes(variable) && !variable.startsWith('use')) {
        dependencies.add(variable);
      }
    }
    
    return Array.from(dependencies);
  }

  /**
   * Prioritize patches by confidence and impact
   */
  prioritizePatches(patches) {
    return patches.sort((a, b) => {
      // Sort by confidence first, then by severity
      const confidenceDiff = b.patch.confidence - a.patch.confidence;
      if (Math.abs(confidenceDiff) > 0.1) {
        return confidenceDiff;
      }
      
      const severityWeight = {
        critical: 3,
        high: 2,
        medium: 1,
        low: 0
      };
      
      return severityWeight[b.error.severity] - severityWeight[a.error.severity];
    });
  }
}

module.exports = PatchGenerator;