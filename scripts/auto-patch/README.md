# Auto-Patch System

Automated troubleshooting and patching system that analyzes test failures, generates fixes, and applies them automatically.

## Features

- **Multi-Framework Support**: Jest, Playwright, Storybook tests
- **Intelligent Error Analysis**: Pattern-based error classification
- **Automated Patch Generation**: Smart fixes for common issues
- **Retry Logic**: Up to 3 attempts with progressive refinement
- **Comprehensive Logging**: Detailed reports and session tracking
- **Safe Backup System**: Automatic backups before applying patches
- **Performance Tracking**: Detailed metrics and timing analysis

## Quick Start

```bash
# Run auto-patch cycle
node scripts/auto-patch/index.js

# Watch mode for continuous patching
node scripts/auto-patch/index.js watch

# Clean old backups and logs
node scripts/auto-patch/index.js cleanup
```

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Test Runner   │───▶│ Error Analyzer  │───▶│ Patch Generator │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                                               │
         │                                               ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Patch Cycle   │◀───│ Patch Applier   │◀───│     Logger      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Error Types Handled

### Import/Export Errors
- Missing imports
- Incorrect relative paths
- Typos in module names
- Missing default exports

### TypeScript Errors
- Type assertion issues
- Property access errors
- Null/undefined safety
- Type definition conflicts

### React Errors
- Missing key props
- Hook dependency issues
- Component prop mismatches
- Conditional hook calls

### Database Errors
- Table name mismatches
- Column name errors
- Migration issues

### Syntax Errors
- Missing semicolons
- Bracket mismatches
- Parsing errors

## Configuration

The system uses `config.js` for configuration:

```javascript
const config = {
  maxAttempts: 3,
  timeoutMs: 300000,
  errorAnalysis: {
    confidenceThresholds: {
      critical: 0.9,
      high: 0.8,
      medium: 0.7,
      low: 0.6
    }
  }
};
```

## Patch Strategies

### Import Fixes
- `fixMissingImports`: Add common missing imports
- `fixRelativePaths`: Correct relative path imports
- `fixTypoInImports`: Fix typos in import statements
- `addMissingPackages`: Suggest missing packages

### React Fixes
- `fixPropTypes`: Add missing key props
- `fixHookDependencies`: Fix useEffect dependencies
- `addNullChecks`: Add optional chaining

### TypeScript Fixes
- `addTypeAssertions`: Add type safety
- `fixPropertyAccess`: Safe property access
- `addNullChecks`: Null/undefined guards

## Output Files

### patch_cycle_log.md
Comprehensive markdown report with:
- Session information
- Error analysis
- Patch application results
- Performance metrics
- Manual intervention requirements
- Recommendations

### Session Logs
JSON logs in `.auto-patch/logs/`:
- `session-{timestamp}.log`: Detailed session data
- Individual operation logs
- Performance tracking

### Backups
Automatic backups in `.auto-patch/backups/`:
- Original files before patching
- Timestamped with attempt number
- Automatic cleanup after 7 days

## Example Usage

### Basic Run
```bash
cd /path/to/project
node scripts/auto-patch/index.js
```

### With Custom Configuration
```javascript
const AutoPatchSystem = require('./scripts/auto-patch');

const autoPatch = new AutoPatchSystem({
  maxAttempts: 5,
  timeoutMs: 600000
});

await autoPatch.run();
```

### Watch Mode
```bash
# Continuous monitoring and patching
node scripts/auto-patch/index.js watch
```

## Common Patch Examples

### Import Fix
```javascript
// Before (error)
import { render } from '@testing-libray/react';

// After (patched)
import { render } from '@testing-library/react';
```

### React Key Props
```javascript
// Before (error)
items.map(item => <Item data={item} />)

// After (patched)
items.map((item, index) => <Item key={index} data={item} />)
```

### TypeScript Null Safety
```javascript
// Before (error)
user.profile.name

// After (patched)
user?.profile?.name
```

## Performance Metrics

The system tracks:
- Total execution time
- Test execution time
- Error analysis time
- Patch generation time
- Patch application time
- Success rates by strategy

## Safety Features

### Backup System
- Automatic file backups before changes
- Rollback capability on failures
- Configurable retention policies

### Confidence Thresholds
- Only apply high-confidence patches automatically
- Manual review for low-confidence changes
- Severity-based filtering

### Validation
- Patch validation before application
- File existence checks
- Content verification

## Troubleshooting

### No Patches Applied
- Check confidence thresholds in config
- Review error patterns in logs
- Verify file permissions

### High Memory Usage
- Reduce `maxErrorsPerCycle` in config
- Lower `maxConcurrentPatches`
- Enable cleanup more frequently

### Patch Failures
- Check backup files in `.auto-patch/backups/`
- Review detailed logs
- Run with `DEBUG=1` for verbose output

## Integration

### CI/CD Pipeline
```yaml
- name: Run Auto-Patch
  run: |
    node scripts/auto-patch/index.js
    npm test
```

### Git Hooks
```bash
# pre-commit hook
#!/bin/sh
node scripts/auto-patch/index.js test
```

## Extending the System

### Custom Error Patterns
Add to `error-analyzer.js`:
```javascript
customPattern: {
  patterns: [/your-pattern/],
  severity: 'medium',
  category: 'custom'
}
```

### Custom Patch Strategies
Add to `patch-generator.js`:
```javascript
async customStrategy(error) {
  // Your patch logic
  return patch;
}
```

## License

MIT License - See package.json for details

## Support

For issues and feature requests, check the session logs and generated reports for detailed debugging information.