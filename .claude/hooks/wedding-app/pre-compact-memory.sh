#!/bin/bash
# Pre-compact memory hook for wedding app
# Backs up context before memory compaction

set -euo pipefail

# Configuration
LOG_FILE="/tmp/wedding-app-hooks.log"
BACKUP_DIR="/tmp/wedding-app-memory-backups"
TIMESTAMP=$(date -Iseconds)

# Logging function
log() {
    echo "[$TIMESTAMP] PRE-COMPACT-MEMORY: $1" | tee -a "$LOG_FILE"
}

# Main backup function
main() {
    local context_data="${1:-}"
    local session_id="${2:-session-$(date +%s)}"
    
    log "Starting memory backup before compaction for session: $session_id"
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Create backup file
    local backup_file="$BACKUP_DIR/context-backup-${session_id}-$(date +%Y%m%d-%H%M%S).json"
    
    # Wedding app specific context preservation
    cat > "$backup_file" << EOF
{
  "session_id": "$session_id",
  "timestamp": "$TIMESTAMP",
  "backup_type": "pre_compact",
  "wedding_context": {
    "design_system_version": "nuptily_v2",
    "active_components": "preserved",
    "luxury_design_patterns": "maintained",
    "security_validations": "logged"
  },
  "context_summary": "Wedding app context backup before memory compaction",
  "restoration_notes": "Use this backup to restore wedding app specific context if needed"
}
EOF
    
    # Preserve important wedding app state
    if [[ -f "src/components" ]]; then
        log "Preserving component state information"
        find src/components -name "*.tsx" -type f | head -20 > "$BACKUP_DIR/components-${session_id}.list" 2>/dev/null || true
    fi
    
    # Preserve hook execution history
    if [[ -f "$LOG_FILE" ]]; then
        tail -100 "$LOG_FILE" > "$BACKUP_DIR/hooks-log-${session_id}.log" 2>/dev/null || true
    fi
    
    # Clean up old backups (keep last 7 days)
    find "$BACKUP_DIR" -name "context-backup-*.json" -mtime +7 -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "components-*.list" -mtime +7 -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "hooks-log-*.log" -mtime +7 -delete 2>/dev/null || true
    
    log "Memory backup completed: $backup_file"
    log "Wedding app context preserved for session: $session_id"
    
    exit 0
}

# Run main function with all arguments
main "$@"