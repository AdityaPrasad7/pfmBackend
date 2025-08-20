# 🚀 Vercel Deployment Guide for Priya Fresh Meat Backend

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Git Repository**: Your code should be in a Git repository

## 🔧 Setup Steps

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**
```bash
vercel login
```

### **Step 3: Navigate to Backend Directory**
```bash
cd PriyaFreshMeatBackend
```

### **Step 4: Deploy to Vercel**
```bash
vercel
```

### **Step 5: Follow the Prompts**
- **Set up and deploy**: Choose `Y`
- **Which scope**: Select your account
- **Link to existing project**: Choose `N` (create new)
- **Project name**: Enter `pfm-backend` or your preferred name
- **In which directory**: Press Enter (current directory)
- **Want to override the settings**: Choose `N`

## 🌍 Environment Variables Setup

### **In Vercel Dashboard:**

1. Go to your project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add the following variables:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://Aditya:uZhmOeQ3lbypVfYS@cluster0.pqlywhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=PFM

# JWT Secrets
ACCESS_TOKEN_SECRET=7b9e8d4a3c2f1b0e9d8c7a6b5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7
REFRESH_TOKEN_SECRET=4e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2

# Token Expiry
ACCESS_TOKEN_VALIDITY=1d
REFRESH_TOKEN_VALIDITY=7d

# Node Environment
NODE_ENV=production
```

### **Or via CLI:**
```bash
vercel env add MONGODB_URI
vercel env add MONGODB_DB_NAME
vercel env add ACCESS_TOKEN_SECRET
vercel env add REFRESH_TOKEN_SECRET
vercel env add ACCESS_TOKEN_VALIDITY
vercel env add REFRESH_TOKEN_VALIDITY
vercel env add NODE_ENV
```

## 📁 Project Structure for Vercel

```
PriyaFreshMeatBackend/
├── api/
│   └── index.js          # Vercel serverless entry point
├── src/
│   ├── app.js            # Main Express app
│   ├── server.js         # Server startup
│   ├── controllers/      # API controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── validations/     # Validation schemas
│   └── utils/           # Utility functions
├── vercel.json           # Vercel configuration
├── .vercelignore         # Files to exclude
├── package.json          # Dependencies
└── VERCEL_DEPLOYMENT.md  # This guide
```

## 🔄 Deployment Commands

### **Deploy to Production:**
```bash
vercel --prod
```

### **Deploy to Preview:**
```bash
vercel
```

### **List Deployments:**
```bash
vercel ls
```

### **Remove Project:**
```bash
vercel remove
```

## 🌐 API Endpoints After Deployment

Your API will be available at:
```
https://your-project-name.vercel.app/api/...

Examples:
- https://pfm-backend.vercel.app/api/admin/login
- https://pfm-backend.vercel.app/api/manager/send-otp
- https://pfm-backend.vercel.app/api/customer/send-otp
- https://pfm-backend.vercel.app/api/deliveryPartner/send-otp
```

## ⚠️ Important Notes

### **1. Database Connection:**
- Ensure your MongoDB Atlas cluster allows connections from Vercel's IP ranges
- Add `0.0.0.0/0` to IP whitelist for testing (not recommended for production)

### **2. Environment Variables:**
- Never commit `.env` files to Git
- Use Vercel's environment variables for sensitive data
- Redeploy after adding new environment variables

### **3. Cold Starts:**
- Vercel functions have cold start delays
- Consider using Vercel Pro for better performance

### **4. File Uploads:**
- Vercel has limitations for file uploads
- Consider using cloud storage (AWS S3, Cloudinary) for file uploads

## 🚨 Troubleshooting

### **Common Issues:**

1. **Module not found errors**: Ensure all imports use `.js` extensions
2. **Environment variables not working**: Redeploy after adding them
3. **Database connection failed**: Check MongoDB Atlas IP whitelist
4. **Function timeout**: Increase `maxDuration` in `vercel.json`

### **Debug Commands:**
```bash
# Check Vercel logs
vercel logs

# Check function status
vercel functions ls

# Redeploy with debug info
vercel --debug
```

## 🎉 Success!

After successful deployment, you'll get:
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: For each deployment
- **Analytics**: Performance and usage data
- **Logs**: Function execution logs

## 🔗 Next Steps

1. **Update Frontend**: Change API base URLs to Vercel URLs
2. **Test APIs**: Verify all endpoints work on Vercel
3. **Monitor**: Check Vercel dashboard for performance
4. **Scale**: Upgrade to Vercel Pro if needed

---

**Happy Deploying! 🚀**
