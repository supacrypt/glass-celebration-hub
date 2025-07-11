FROM node:20-slim

WORKDIR /app

COPY run_supabase_mcp.sh .

RUN chmod +x run_supabase_mcp.sh

ENTRYPOINT ["/app/run_supabase_mcp.sh"]
