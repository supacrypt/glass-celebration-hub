#!/bin/bash
# Pre-agent coordination hook for wedding app
# Coordinates agent tasks and prevents conflicts

set -euo pipefail

# Configuration
LOG_FILE="/tmp/wedding-app-hooks.log"
AGENT_LOCK_DIR="/tmp/wedding-app-agents"
TIMESTAMP=$(date -Iseconds)
MAX_AGENTS=5

# Logging function
log() {
    echo "[$TIMESTAMP] PRE-AGENT-COORDINATION: $1" | tee -a "$LOG_FILE"
}

# Main coordination function
main() {
    local agent_id="${1:-agent-$(date +%s)}"
    local task_type="${2:-general}"
    
    log "Starting agent coordination for: $agent_id (task: $task_type)"
    
    # Create agent lock directory
    mkdir -p "$AGENT_LOCK_DIR"
    
    # Count active agents
    local active_agents=$(find "$AGENT_LOCK_DIR" -name "*.lock" -mmin -10 | wc -l)
    
    if [[ $active_agents -ge $MAX_AGENTS ]]; then
        log "WARNING: Maximum agents ($MAX_AGENTS) already active. Current: $active_agents"
        # Don't block, just warn
    fi
    
    # Create agent lock file
    local lock_file="$AGENT_LOCK_DIR/${agent_id}.lock"
    echo "$task_type" > "$lock_file"
    
    # Check for conflicting tasks
    case "$task_type" in
        "component-generation")
            # Check if another agent is doing the same
            if find "$AGENT_LOCK_DIR" -name "*.lock" -exec grep -l "component-generation" {} \; | grep -v "$lock_file" > /dev/null; then
                log "WARNING: Another agent is already generating components"
            fi
            ;;
        "file-edit")
            log "File edit task - checking for conflicts"
            ;;
        *)
            log "General task type: $task_type"
            ;;
    esac
    
    log "Agent coordination completed for: $agent_id"
    exit 0
}

# Cleanup function
cleanup() {
    local agent_id="${1:-}"
    if [[ -n "$agent_id" ]]; then
        rm -f "$AGENT_LOCK_DIR/${agent_id}.lock"
    fi
}

# Run main function with all arguments
main "$@"