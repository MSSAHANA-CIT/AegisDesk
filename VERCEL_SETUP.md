# Vercel Setup Guide for AegisDesk AI

## Step-by-Step Instructions

### 1. Add Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Click on your project (AegisDesk)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add the following:
   - **Key**: `OPENAI_API_KEY` (or `OPEN_API` - both work)
   - **Value**: Your OpenAI API key (starts with `sk-`)
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**

### 2. Redeploy Your Project

After adding the environment variable:
1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on your latest deployment
3. Click **Redeploy**
4. Make sure to check **Use existing Build Cache** is unchecked (to ensure new env vars are loaded)

OR

1. Push a new commit to trigger a new deployment
2. The new deployment will include your environment variable

### 3. Verify It's Working

1. Open your deployed site: `https://your-project.vercel.app/ai-chat.html`
2. Try sending a message in the AI chat
3. It should work without asking for an API key!

## Important Notes

- ✅ The API key is stored **securely on Vercel's servers** - never exposed to the client
- ✅ The frontend no longer needs the API key modal
- ✅ All API calls go through `/api/chat` endpoint
- ✅ The endpoint supports both `OPENAI_API_KEY` and `OPEN_API` environment variable names

## Troubleshooting

### If AI chat still doesn't work:

1. **Check Environment Variable**:
   - Make sure it's named exactly `OPENAI_API_KEY` or `OPEN_API`
   - Make sure the value is your full API key (starts with `sk-`)
   - Make sure it's enabled for all environments

2. **Check Deployment**:
   - Make sure you redeployed after adding the env var
   - Check the deployment logs for any errors

3. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for any error messages
   - Check Network tab to see if `/api/chat` requests are failing

4. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Check the logs for `/api/chat`
   - Look for any error messages

## API Endpoint

The API endpoint is located at: `/api/chat.js`

It:
- Accepts POST requests with `messages` array
- Uses environment variable `OPENAI_API_KEY` or `OPEN_API`
- Returns OpenAI API responses
- Handles errors gracefully

## Security

✅ **API key is NEVER exposed to the client**
✅ **All requests go through Vercel serverless function**
✅ **CORS is properly configured**
✅ **No API key stored in browser localStorage**
