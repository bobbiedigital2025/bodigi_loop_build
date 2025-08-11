# BoDiGi™ Platform Setup Guide

## Current Status
✅ Server running on port 5000  
⚠️ Using in-memory storage (development mode)  
⚠️ Missing Supabase Service Role Key  

## Quick Setup Steps

### 1. Get Missing Supabase Credentials
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project `exwngratmprvuqnibtey`
3. Go to Settings → API
4. Copy the `service_role` key (not the `anon` key)
5. Update your `.env` file:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   ```

### 2. Launch Configuration Fixed
✅ Updated `.vscode/launch.json` to use correct port (5000)  
✅ Added development server debug configuration  

### 3. Environment Variables Status
✅ `VITE_STRIPE_PUBLIC_KEY` - Configured  
✅ `STRIPE_SECRET_KEY` - Configured  
✅ `VITE_SUPABASE_URL` - Fixed format  
✅ `SUPABASE_ANON_KEY` - Configured  
⚠️ `SUPABASE_SERVICE_ROLE_KEY` - Needs your actual key  

### 4. Run the Application
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

### 5. Debug Options
- **F5**: Launch Chrome browser at localhost:5000
- **Launch Development Server**: Debug the Node.js server directly

## Next Steps
1. Update the `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file
2. Test the database connection
3. Configure the remaining placeholder keys if needed

## Troubleshooting
- If you see "Missing Supabase environment variables", check your `.env` file
- If payments don't work, verify your Stripe keys are active (not test keys)
- Check the console logs for detailed error messages
