# Vercel Environment Variable Setup - FIXED GUIDE

## ⚠️ IMPORTANT: The Error You're Seeing

If you see "Incorrect API key provided", follow these steps:

## Step-by-Step Fix

### 1. Go to Vercel Dashboard
- Visit [vercel.com](https://vercel.com)
- Log in and select your project

### 2. Navigate to Environment Variables
- Click on your project name
- Go to **Settings** (gear icon in the top menu)
- Click **Environment Variables** in the left sidebar

### 3. Add/Update the Environment Variable

**Option A: If you already added it**
- Find `OPEN_API` in the list
- Click the **three dots** (⋯) next to it
- Click **Edit**
- Make sure the value is your **FULL API key** (starts with `sk-`)
- Make sure it's enabled for **Production**, **Preview**, and **Development**
- Click **Save**

**Option B: If you need to add it**
- Click **Add New**
- **Key**: `OPEN_API` (exactly like this, case-sensitive)
- **Value**: Your OpenAI API key (starts with `sk-`)
- Select **Production**, **Preview**, and **Development**
- Click **Save**

### 4. ⚠️ CRITICAL: Redeploy Your Project

**You MUST redeploy after adding/changing environment variables!**

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **three dots** (⋯) on the right
4. Click **Redeploy**
5. **IMPORTANT**: Make sure **"Use existing Build Cache"** is **UNCHECKED**
6. Click **Redeploy**

### 5. Verify It's Working

1. Wait for deployment to complete (usually 1-2 minutes)
2. Visit your site: `https://your-project.vercel.app/ai-chat.html`
3. Try sending a message
4. It should work now!

## Common Issues

### Issue 1: "Incorrect API key provided"
**Solution:**
- Make sure the API key value in Vercel is correct (copy-paste it again)
- Make sure it starts with `sk-`
- Make sure you **redeployed** after adding it

### Issue 2: "Missing environment variable"
**Solution:**
- Check that the variable name is exactly `OPEN_API` (case-sensitive)
- Make sure it's enabled for all environments (Production, Preview, Development)
- Redeploy after adding

### Issue 3: Still not working after redeploy
**Solution:**
1. Double-check the API key in Vercel
2. Get a fresh API key from [OpenAI Platform](https://platform.openai.com/api-keys)
3. Delete the old `OPEN_API` variable
4. Add it again with the new key
5. Redeploy (without build cache)

## Quick Checklist

- [ ] Environment variable name is exactly `OPEN_API`
- [ ] API key starts with `sk-`
- [ ] Enabled for Production, Preview, and Development
- [ ] Redeployed after adding/changing
- [ ] Build cache was unchecked during redeploy

## Testing Your API Key

You can test if your API key works by running this in your terminal:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY_HERE"
```

If it returns a list of models, your key is valid!

## Need Help?

If it's still not working:
1. Check Vercel deployment logs (Deployments > Click deployment > Functions tab)
2. Look for any error messages
3. Make sure the API key is valid and has credits
