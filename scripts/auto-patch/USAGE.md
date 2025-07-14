# Auto-Patch System Usage Guide

## Quick Start

```bash
# Run auto-patch system
npm run auto-patch

# Watch mode for continuous patching
npm run auto-patch:watch

# Clean old backups and logs
npm run auto-patch:cleanup

# Run demo to see example output
npm run auto-patch:demo
```

## Advanced Usage

```bash
# Direct script execution
node scripts/auto-patch/index.js [command]

# Commands:
# run    - Execute auto-patch cycle (default)
# watch  - Start watch mode for continuous patching
# cleanup - Clean old backup and log files
# test   - Run single attempt for testing
```

## Example Output

```
🚀 Starting Auto-Patch System...
📋 Max attempts: 3
⏱️  Timeout: 300000ms

📊 Running initial test suite...
🔍 Found 5 errors across 5 files

🔄 Starting patch cycle 1/3
📋 Processing 5 errors
🔧 Generating patches...
📝 Applying 4 patches...
  📝 Applying fixTypoInImports for import error in src/components/LuxuryButton.test.tsx
  ✅ Patch application logged: 2/4 successful

🧪 Re-testing 5 files...
📊 2 errors remaining

📋 Auto-Patch Summary:
   Cycles Executed: 1
   Total Patches: 4
   Successful Patches: 2
   Final Status: ⚠️  PARTIALLY FIXED
   Report: .auto-patch/logs/patch_cycle_log.md
```

## Generated Files

### Reports
- `.auto-patch/logs/patch_cycle_log.md` - Comprehensive markdown report
- `.auto-patch/logs/session-*.log` - Detailed JSON session logs

### Backups
- `.auto-patch/backups/*.backup` - Original files before patching
- Automatic cleanup after 7 days

## Error Types Handled

✅ **Import/Export Errors**
- Missing imports (`@testing-libray` → `@testing-library`)
- Incorrect relative paths
- Missing default exports

✅ **React Errors**
- Missing key props in lists
- Hook dependency issues
- Component prop mismatches

✅ **TypeScript Errors**
- Property access errors (`obj.prop` → `obj?.prop`)
- Type assertion issues
- Null/undefined safety

✅ **Database Errors**
- Table name mismatches (`user` → `users`)
- Column name errors

✅ **Syntax Errors**
- Missing semicolons
- Bracket mismatches

## Patch Confidence Levels

- **Critical (90%+)**: Applied automatically for critical errors
- **High (80%+)**: Applied automatically for high severity
- **Medium (70%+)**: Applied automatically for medium severity
- **Low (60%+)**: Applied automatically for low severity
- **Below 60%**: Suggestions only, manual review required

## Safety Features

🔒 **Automatic Backups**: Files backed up before any changes
🔄 **Rollback Capability**: Can restore original files
⚡ **Confidence Thresholds**: Only high-confidence patches applied
📊 **Detailed Logging**: Complete audit trail of all operations

## Integration Examples

### CI/CD Pipeline
```yaml
- name: Auto-patch and test
  run: |
    npm run auto-patch
    npm test
```

### Pre-commit Hook
```bash
#!/bin/sh
npm run auto-patch:test && npm test
```

### Development Workflow
```bash
# Run tests, auto-patch failures, re-run tests
npm test && npm run auto-patch && npm test
```

## Configuration

Customize behavior in `scripts/auto-patch/config.js`:

```javascript
{
  maxAttempts: 3,          // Max patch cycles
  timeoutMs: 300000,       // 5 minute timeout
  confidenceThresholds: {
    critical: 0.9,         // 90% confidence for critical
    high: 0.8,            // 80% confidence for high
    medium: 0.7,          // 70% confidence for medium
    low: 0.6              // 60% confidence for low
  }
}
```

## Troubleshooting

### No Patches Applied
- Check confidence thresholds in config
- Review error patterns in logs
- Verify file permissions

### Low Success Rate
- Errors may be too complex for auto-patching
- Check manual intervention section in report
- Consider improving error patterns

### Performance Issues
- Reduce `maxErrorsPerCycle` in config
- Lower `maxConcurrentPatches`
- Run cleanup more frequently

## Best Practices

1. **Run regularly** - Catch issues early
2. **Review reports** - Understand what was changed
3. **Check backups** - Verify changes before committing
4. **Use watch mode** - For active development
5. **Test after patching** - Always verify fixes work
6. **Manual review** - Check low-confidence suggestions

## Support

- Check session logs in `.auto-patch/logs/`
- Review generated reports for detailed analysis
- Enable debug mode with `DEBUG=1` environment variable