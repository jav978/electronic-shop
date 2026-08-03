#!/usr/bin/env bash

# ==============================================================================
# Electronic Shop - Master Dev Launcher Script
# Starts both Backend (FeathersJS/Prisma) and Frontend (Nuxt 3) concurrently
# ==============================================================================

# Terminal Colors
BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
MAGENTA='\033[0;35m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
RESET='\033[0m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BOLD}${CYAN}=====================================================${RESET}"
echo -e "${BOLD}${CYAN}     ⚡ Electronic Shop - System Development ⚡     ${RESET}"
echo -e "${BOLD}${CYAN}=====================================================${RESET}"

# Check for node/npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: 'npm' could not be found. Please install Node.js.${RESET}"
    exit 1
fi

# Cleanup on exit (Ctrl+C)
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down Backend and Frontend services...${RESET}"
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null
    fi
    echo -e "${GREEN}✅ All services stopped safely.${RESET}"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# ------------------------------------------------------------------------------
# 1. Backend Setup & Start
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${MAGENTA}[1/2] Checking Backend dependencies & Prisma...${RESET}"
cd "$ROOT_DIR/backend" || exit 1

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Backend dependencies...${RESET}"
    npm install
fi

echo -e "${MAGENTA}Generating Prisma Client...${RESET}"
npx prisma generate > /dev/null 2>&1

echo -e "${BOLD}${GREEN}🚀 Starting Backend server (Port 3030)...${RESET}"
npm run dev 2>&1 | sed "s/^/$(echo -e "${MAGENTA}[BACKEND]${RESET}") /" &
BACKEND_PID=$!

# ------------------------------------------------------------------------------
# 2. Frontend Setup & Start
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${CYAN}[2/2] Checking Frontend dependencies...${RESET}"
cd "$ROOT_DIR/frontend" || exit 1

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Frontend dependencies...${RESET}"
    npm install
fi

echo -e "${BOLD}${GREEN}🚀 Starting Frontend App (Port 3000)...${RESET}"
npm run dev 2>&1 | sed "s/^/$(echo -e "${CYAN}[FRONTEND]${RESET}") /" &
FRONTEND_PID=$!

# ------------------------------------------------------------------------------
# 3. Status Summary
# ------------------------------------------------------------------------------
cd "$ROOT_DIR" || exit 1

sleep 2

echo -e "\n${BOLD}${GREEN}=====================================================${RESET}"
echo -e "${BOLD}${GREEN}  ✨ System active and running locally:             ${RESET}"
echo -e "  - ⚡ Backend API & WebSockets: ${BOLD}http://localhost:3030${RESET}"
echo -e "  - 🎨 Frontend Nuxt 3 App:     ${BOLD}http://localhost:3000${RESET}"
echo -e "${BOLD}${GREEN}=====================================================${RESET}"
echo -e "${YELLOW}Press [Ctrl+C] at any time to stop all services.${RESET}\n"

# Wait for background jobs
wait
