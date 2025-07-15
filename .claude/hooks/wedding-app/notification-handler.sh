#!/bin/bash
# Notification handler hook for wedding app
# Handles various notification types

set -euo pipefail

# Configuration
LOG_FILE="/tmp/wedding-app-hooks.log"
TIMESTAMP=$(date -Iseconds)

# Logging function
log() {
    echo "[$TIMESTAMP] NOTIFICATION-HANDLER: $1" | tee -a "$LOG_FILE"
}

# Send desktop notification if available
send_desktop_notification() {
    local title="$1"
    local message="$2"
    
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "$title" "$message" 2>/dev/null || true
    fi
}

# Main notification function
main() {
    local notification_type="${1:-info}"
    local title="${2:-Wedding App Notification}"
    local message="${3:-Notification from wedding app hooks}"
    
    log "Processing notification: $notification_type - $title"
    
    # Handle different notification types
    case "$notification_type" in
        "error")
            log "ERROR NOTIFICATION: $message"
            send_desktop_notification "❌ $title" "$message"
            ;;
        "warning")
            log "WARNING NOTIFICATION: $message"
            send_desktop_notification "⚠️ $title" "$message"
            ;;
        "success")
            log "SUCCESS NOTIFICATION: $message"
            send_desktop_notification "✅ $title" "$message"
            ;;
        "info")
            log "INFO NOTIFICATION: $message"
            send_desktop_notification "ℹ️ $title" "$message"
            ;;
        "build")
            log "BUILD NOTIFICATION: $message"
            send_desktop_notification "🔨 $title" "$message"
            ;;
        "security")
            log "SECURITY NOTIFICATION: $message"
            send_desktop_notification "🔒 $title" "$message"
            ;;
        *)
            log "GENERAL NOTIFICATION: $message"
            send_desktop_notification "$title" "$message"
            ;;
    esac
    
    # Frequency limiting - prevent spam
    local rate_limit_file="/tmp/wedding-app-notification-rate-limit"
    local current_time=$(date +%s)
    
    if [[ -f "$rate_limit_file" ]]; then
        local last_notification=$(cat "$rate_limit_file")
        local time_diff=$((current_time - last_notification))
        
        if [[ $time_diff -lt 5 ]]; then
            log "Rate limiting applied - notification suppressed"
            exit 0
        fi
    fi
    
    echo "$current_time" > "$rate_limit_file"
    
    log "Notification processing completed"
    exit 0
}

# Run main function with all arguments
main "$@"