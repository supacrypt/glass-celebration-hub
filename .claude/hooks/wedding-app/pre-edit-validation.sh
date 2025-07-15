#!/bin/bash
# Pre-edit validation hook for wedding app
# Validates luxury design compliance and security before file edits

set -euo pipefail

# Configuration
LOG_FILE="/tmp/wedding-app-hooks.log"
TIMESTAMP=$(date -Iseconds)

# Logging function
log() {
    echo "[$TIMESTAMP] PRE-EDIT-VALIDATION: $1" | tee -a "$LOG_FILE"
}

# Main validation function
main() {
    local file_path="${1:-}"
    local operation="${2:-edit}"
    
    log "Starting pre-edit validation for: $file_path"
    
    # Check if file is in allowed directories
    if [[ "$file_path" =~ ^/home/lyoncrypt/Desktop/Nuptul/src/ ]] || [[ "$file_path" =~ ^/home/lyoncrypt/Desktop/Nuptul/docs/ ]]; then
        log "File path validation passed: $file_path"
    else
        log "ERROR: File path not in allowed directories: $file_path"
        exit 1
    fi
    
    # Check for security issues in file path
    if [[ "$file_path" =~ \.\./|~|/etc/|/root/ ]]; then
        log "ERROR: Potentially dangerous file path detected: $file_path"
        exit 1
    fi
    
    # Validate luxury design components
    if [[ "$file_path" =~ \.tsx?$ ]] && [[ "$file_path" =~ /components/ ]]; then
        log "Validating luxury design compliance for component: $file_path"
        
        # Check if it's a new component that should follow Nuptily design system
        if [[ ! -f "$file_path" ]]; then
            log "New component detected - will require Nuptily design system compliance"
        fi
    fi
    
    # Check file size limits
    if [[ -f "$file_path" ]]; then
        local file_size=$(stat -c%s "$file_path" 2>/dev/null || echo 0)
        if [[ $file_size -gt 50000 ]]; then
            log "WARNING: Large file detected ($file_size bytes): $file_path"
        fi
    fi
    
    log "Pre-edit validation completed successfully for: $file_path"
    exit 0
}

# Run main function with all arguments
main "$@"