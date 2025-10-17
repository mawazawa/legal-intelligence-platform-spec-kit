#!/bin/bash

# Strict Port 3000 Enforcement Script
# Ensures only ONE dev server runs on port 3000 at a time
# Kills any existing Next.js dev servers before starting a new one

set -e

PORT=3000
PROJECT_NAME="legal-intelligence-platform"

echo "= Checking for existing dev servers..."

# Kill any process using port 3000
PORT_PID=$(lsof -ti:$PORT 2>/dev/null || true)
if [ ! -z "$PORT_PID" ]; then
  echo "   Port $PORT is in use by PID $PORT_PID"
  echo "=* Killing process on port $PORT..."
  kill -9 $PORT_PID 2>/dev/null || true
  sleep 1
  echo " Port $PORT is now free"
fi

# Kill any existing Next.js dev processes (safety measure)
echo "= Searching for zombie Next.js processes..."
NEXT_PIDS=$(pgrep -f "next dev" 2>/dev/null || true)
if [ ! -z "$NEXT_PIDS" ]; then
  echo "   Found existing Next.js dev processes: $NEXT_PIDS"
  echo "=* Killing all Next.js dev processes..."
  pkill -9 -f "next dev" 2>/dev/null || true
  sleep 1
  echo " All zombie processes killed"
fi

# Verify port is free
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "L ERROR: Port $PORT is still in use after cleanup!"
  echo "L Cannot start dev server. Please manually kill the process:"
  echo "   lsof -ti:$PORT | xargs kill -9"
  exit 1
fi

echo ""
echo " Port $PORT is available"
echo "=€ Starting dev server on http://localhost:$PORT"
echo ""
echo ""

# Start Next.js dev server on port 3000 ONLY
PORT=$PORT next dev --turbopack
