# GitHub Codespaces Quick Start Guide

Welcome to the Bodigi Loop Build project in GitHub Codespaces! 🚀

## What's Already Set Up

✅ **Node.js 20** environment  
✅ **Dependencies** automatically installed  
✅ **VS Code extensions** for React, TypeScript, and Tailwind CSS  
✅ **Port forwarding** for frontend (5173) and backend (5000)  
✅ **Environment variables** template (.env created from .env.example)  

## Getting Started

### 1. Start the Development Servers

Open the integrated terminal (`Ctrl/Cmd + `` ` ``) and run:

```bash
npm run dev
```

This starts both the frontend (Vite) and backend (Express) servers.

### 2. Access Your Application

Once the servers are running:

- **Frontend**: Click on the "Open in Browser" popup for port 5173, or go to the Ports tab
- **Backend API**: Available at the forwarded port 5000

### 3. Alternative Commands

```bash
# Start only the frontend (React + Vite)
npm run dev:client

# Start only the backend (Express API)
npm run dev:server

# Build for production
npm run build

# Type checking
npm run check
```

## Project Structure

```
├── client/          # React frontend (Vite)
├── server/          # Express backend
├── shared/          # Shared types and utilities
├── .devcontainer/   # Codespace configuration
└── .vscode/         # VS Code settings and tasks
```

## Environment Variables

The `.env` file has been created from `.env.example`. You'll need to add your actual values for:

- **Supabase**: Database connection
- **Stripe**: Payment processing
- **Other API keys**: As needed

## VS Code Features

- **Tasks**: Use `Ctrl/Cmd + Shift + P` → "Tasks: Run Task" to run predefined tasks
- **Debug**: Launch configurations are available for both frontend and backend
- **Extensions**: Pre-installed extensions for the best development experience

## Need Help?

- Check the main [README.md](./README.md) for detailed setup instructions
- Review the [COMPLETE_README.md](./COMPLETE_README.md) for comprehensive documentation
- Use the integrated terminal to run any npm commands

Happy coding! 🎉