#!/bin/bash
# Post-edit quality hook for wedding app
# Validates quality after file edits

set -euo pipefail

# Configuration
LOG_FILE="/tmp/wedding-app-hooks.log"
TIMESTAMP=$(date -Iseconds)

# Logging function
log() {
    echo "[$TIMESTAMP] POST-EDIT-QUALITY: $1" | tee -a "$LOG_FILE"
}

# Main quality check function
main() {
    local file_path="${1:-}"
    local operation="${2:-edit}"
    
    log "Starting post-edit quality check for: $file_path"
    
    # Check if file exists and is readable
    if [[ ! -f "$file_path" ]]; then
        log "ERROR: File does not exist after edit: $file_path"
        exit 1
    fi
    
    # TypeScript/TSX file checks
    if [[ "$file_path" =~ \.tsx?$ ]]; then
        log "Checking TypeScript file: $file_path"
        
        # Basic syntax check using Node.js
        if command -v node >/dev/null 2>&1; then
            if ! node -c "$file_path" 2>/dev/null; then
                log "WARNING: JavaScript syntax issues detected in: $file_path"
            fi
        fi
        
        # Check for Nuptily design system compliance in components
        if [[ "$file_path" =~ /components/ ]]; then
            if grep -q "NuptilyCoreProps\|glassmorphism\|neumorphism\|aurora" "$file_path"; then
                log "Nuptily design system patterns found in: $file_path"
            else
                log "WARNING: Component may not follow Nuptily design system: $file_path"
            fi
        fi
        
        # Check for security issues
        if grep -E "(innerHTML|dangerouslySetInnerHTML|eval|Function)" "$file_path" >/dev/null; then
            log "WARNING: Potentially unsafe patterns detected in: $file_path"
        fi
    fi
    
    # Check file size
    local file_size=$(stat -c%s "$file_path")
    if [[ $file_size -gt 50000 ]]; then
        log "WARNING: Large file created/modified ($file_size bytes): $file_path"
    fi
    
    # Check for API keys or secrets
    if grep -E "(sk-|ghp_|sb_|bb_live|BSA|nfp_|dtn_|pplx-|sntryu_)" "$file_path" >/dev/null; then
        log "ERROR: Potential API key or secret found in file: $file_path"
        exit 1
    fi
    
    log "Post-edit quality check completed for: $file_path"
    exit 0
}

# Run main function with all arguments
main "$@"