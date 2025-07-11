#!/bin/sh

# This script starts the Supabase MCP server with the required arguments.
# The SUPABASE_ACCESS_TOKEN is passed in from the docker-compose.yml file.

exec npx -y @supabase/mcp-server-supabase@latest \
    --read-only \
    --project-ref=iwmfxcrzzwpmxomydmuq
