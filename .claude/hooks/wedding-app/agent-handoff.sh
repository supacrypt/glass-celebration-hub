#!/bin/bash
# Agent handoff hook for wedding app
# Handles agent completion and handoff

set -euo pipefail

# Configuration
LOG_FILE="/tmp/wedding-app-hooks.log"
AGENT_LOCK_DIR="/tmp/wedding-app-agents"
TIMESTAMP=$(date -Iseconds)

# Logging function
log() {
    echo "[$TIMESTAMP] AGENT-HANDOFF: $1" | tee -a "$LOG_FILE"
}

# Main handoff function
main() {
    local agent_id="${1:-}"
    local task_result="${2:-completed}"
    
    log "Processing agent handoff for: $agent_id (result: $task_result)"
    
    # Remove agent lock file
    if [[ -n "$agent_id" ]] && [[ -f "$AGENT_LOCK_DIR/${agent_id}.lock" ]]; then
        rm -f "$AGENT_LOCK_DIR/${agent_id}.lock"
        log "Removed lock file for agent: $agent_id"
    fi
    
    # Log task completion
    case "$task_result" in
        "completed")
            log "Agent $agent_id completed successfully"
            ;;
        "failed")
            log "Agent $agent_id failed - may need retry"
            ;;
        "timeout")
            log "Agent $agent_id timed out"
            ;;
        *)
            log "Agent $agent_id finished with result: $task_result"
            ;;
    esac
    
    # Check remaining active agents
    local remaining_agents=$(find "$AGENT_LOCK_DIR" -name "*.lock" -mmin -10 2>/dev/null | wc -l)
    log "Remaining active agents: $remaining_agents"
    
    # If this was the last agent, trigger cleanup
    if [[ $remaining_agents -eq 0 ]]; then
        log "All agents completed - triggering final cleanup"
        # Could trigger additional cleanup or reporting here
    fi
    
    log "Agent handoff completed for: $agent_id"
    exit 0
}

# Run main function with all arguments
main "$@"