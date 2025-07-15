#!/bin/bash
# Post-build deploy hook for wedding app
# Handles post-build actions and deployment

set -euo pipefail

# Configuration
LOG_FILE="/tmp/wedding-app-hooks.log"
TIMESTAMP=$(date -Iseconds)

# Logging function
log() {
    echo "[$TIMESTAMP] POST-BUILD-DEPLOY: $1" | tee -a "$LOG_FILE"
}

# Main deployment function
main() {
    local command="${1:-}"
    local exit_code="${2:-0}"
    
    log "Starting post-build actions for command: $command (exit: $exit_code)"
    
    # Check if build was successful
    if [[ $exit_code -ne 0 ]]; then
        log "Build failed with exit code: $exit_code"
        # Could trigger notifications here
        exit 0  # Don't block the workflow
    fi
    
    # Handle different build types
    case "$command" in
        *"npm run build"*)
            log "Production build completed successfully"
            
            # Check if dist directory was created
            if [[ -d "dist" ]]; then
                local dist_size=$(du -sh dist | cut -f1)
                log "Build output size: $dist_size"
            fi
            ;;
            
        *"npm run dev"*)
            log "Development server started"
            ;;
            
        *"npm run storybook"*)
            log "Storybook build completed"
            ;;
            
        *"vite"*)
            log "Vite build process completed"
            ;;
            
        *"supabase"*)
            log "Supabase operation completed"
            ;;
    esac
    
    # Performance monitoring
    if [[ -f "dist/index.html" ]]; then
        local html_size=$(stat -c%s "dist/index.html")
        if [[ $html_size -gt 100000 ]]; then
            log "WARNING: Large HTML file detected: ${html_size} bytes"
        fi
    fi
    
    log "Post-build actions completed for: $command"
    exit 0
}

# Run main function with all arguments
main "$@"