#!/bin/bash
# Pre-command security hook for wedding app
# Validates command security before execution

set -euo pipefail

# Configuration
LOG_FILE="/tmp/wedding-app-hooks.log"
TIMESTAMP=$(date -Iseconds)

# Dangerous command patterns
DANGEROUS_PATTERNS=(
    "rm -rf /"
    "sudo"
    "curl.*|.*sh"
    "wget.*|.*sh"
    "eval"
    "exec"
    "> /etc/"
    "chmod 777"
    "chown root"
)

# Logging function
log() {
    echo "[$TIMESTAMP] PRE-COMMAND-SECURITY: $1" | tee -a "$LOG_FILE"
}

# Main validation function
main() {
    local command="${1:-}"
    
    log "Validating command security: $command"
    
    # Check for dangerous patterns
    for pattern in "${DANGEROUS_PATTERNS[@]}"; do
        if [[ "$command" =~ $pattern ]]; then
            log "ERROR: Dangerous command pattern detected: $pattern in '$command'"
            exit 1
        fi
    done
    
    # Check for API key exposure
    if [[ "$command" =~ (sk-|ghp_|sb_|bb_live|BSA|nfp_|dtn_|pplx-|sntryu_) ]]; then
        log "ERROR: Potential API key exposure in command: $command"
        exit 1
    fi
    
    # Validate wedding app specific commands
    if [[ "$command" =~ ^npm ]] || [[ "$command" =~ ^vite ]] || [[ "$command" =~ ^supabase ]]; then
        log "Wedding app build/deploy command detected: $command"
        
        # Ensure we're in the right directory
        if [[ ! -f "package.json" ]] || [[ ! -d "src" ]]; then
            log "ERROR: Not in a valid Node.js project directory"
            exit 1
        fi
    fi
    
    log "Command security validation passed: $command"
    exit 0
}

# Run main function with all arguments
main "$@"