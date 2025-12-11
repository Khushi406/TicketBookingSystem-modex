# Complete Deployment Guide
## Modex Assessment - Ticket Booking System

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Testing Deployed Application](#testing-deployed-application)
5. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Backend
- [ ] PostgreSQL database created (Railway, Supabase, or ElephantSQL)
- [ ] Database initialized with tables (run `node scripts/initDb.js`)
- [ ] Environment variables prepared
- [ ] Code pushed to GitHub repository

### Frontend
- [ ] Backend API URL obtained
- [ ] Environment variables configured
- [ ] Production build tested locally (`npm run build`)
- [ ] Code pushed to GitHub repository

---

## Backend Deployment

### Option 1: Railway (Recommended)

#### Step 1: Create Railway Account
1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create PostgreSQL Database
1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Copy the `DATABASE_URL` from Variables tab

#### Step 3: Deploy Backend
1. Click "New" → "GitHub Repo"
2. Select your backend repository
3. Railway will auto-detect Node.js

#### Step 4: Configure Environment Variables
Add these in Railway dashboard:
```
DATABASE_URL=<your_postgres_url>
PORT=5000
NODE_ENV=production
```

#### Step 5: Initialize Database
In Railway console, run:
```bash
node scripts/initDb.js
```

#### Step 6: Get Backend URL
Copy the URL from Railway dashboard (e.g., `https://your-app.railway.app`)

### Option 2: Render

#### Step 1: Create Account
1. Visit [render.com](https://render.com)
2. Sign up with GitHub

#### Step 2: Create PostgreSQL
1. New → PostgreSQL
2. Copy Internal Database URL

#### Step 3: Create Web Service
1. New → Web Service
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`

#### Step 4: Environment Variables
```
DATABASE_URL=<postgres_url>
PORT=5000
```

#### Step 5: Initialize Database
Use Render Shell to run:
```bash
node scripts/initDb.js
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended for React)

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Navigate to Frontend
```bash
cd ticketBooking-frontend
```

#### Step 3: Update Environment
Create `.env.production`:
```env
REACT_APP_API_BASE_URL=https://your-backend-url.railway.app/api
```

#### Step 4: Deploy
```bash
vercel
```

Follow prompts:
- Setup and deploy? **Y**
- Link to existing project? **N**
- Project name? **ticket-booking-frontend**
- Directory? **./ticketBooking-frontend**

#### Step 5: Set Environment Variables
```bash
vercel env add REACT_APP_API_BASE_URL production
```

#### Step 6: Deploy to Production
```bash
vercel --prod
```

### Option 2: Netlify

#### Step 1: Install Netlify CLI
```bash
npm i -g netlify-cli
```

#### Step 2: Build Project
```bash
cd ticketBooking-frontend
npm run build
```

#### Step 3: Update Environment
Update `.env.production` with backend URL

#### Step 4: Deploy
```bash
netlify deploy --prod --dir=build
```

#### Step 5: Set Environment Variables
In Netlify dashboard:
1. Site settings → Environment variables
2. Add `REACT_APP_API_BASE_URL`

---

## Complete Deployment Flow

### 1. Database Setup (5 minutes)
```bash
# Using Railway PostgreSQL
1. Create new project in Railway
2. Add PostgreSQL service
3. Copy DATABASE_URL
```

### 2. Backend Deployment (10 minutes)
```bash
# Push to GitHub first
cd Railway_backend
git init
git add .
git commit -m "Initial commit"
git push origin main

# Deploy on Railway
1. New project from GitHub repo
2. Add environment variables
3. Run init script
4. Copy backend URL
```

### 3. Frontend Deployment (10 minutes)
```bash
# Update environment
cd ticketBooking-frontend
echo "REACT_APP_API_BASE_URL=https://your-backend.railway.app/api" > .env.production

# Deploy to Vercel
vercel --prod

# Note the frontend URL
```

### 4. CORS Configuration
Update backend `index.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
}));
```

Redeploy backend after CORS update.

---

## Environment Variables Summary

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
PORT=5000
NODE_ENV=production
```

### Frontend (.env.production)
```env
REACT_APP_API_BASE_URL=https://your-backend-url.com/api
```

---

## Testing Deployed Application

### 1. Backend Testing
```bash
# Health check
curl https://your-backend.railway.app

# Get shows
curl https://your-backend.railway.app/api/shows

# Create show (test)
curl -X POST https://your-backend.railway.app/api/shows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Show",
    "start_time": "2025-12-15T18:00:00Z",
    "total_seats": 40
  }'
```

### 2. Frontend Testing
1. Visit deployed frontend URL
2. Check Home page loads
3. Navigate to Admin dashboard
4. Create a test show
5. Book seats
6. Verify toast notifications work
7. Test on mobile device

### 3. Integration Testing
- [ ] Frontend can fetch shows from backend
- [ ] Can create show from frontend
- [ ] Can book seats
- [ ] Toast notifications appear
- [ ] Auto-refresh works
- [ ] Mobile responsive works

---

## Troubleshooting

### Issue: Backend not responding
**Symptoms**: Frontend shows network error  
**Solutions**:
1. Check backend URL is correct in frontend env
2. Verify backend is running (check Railway logs)
3. Check database connection
4. Verify CORS settings

### Issue: CORS Error
**Symptoms**: Browser console shows CORS error  
**Solutions**:
```javascript
// Update backend index.js
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

### Issue: Database connection failed
**Symptoms**: Backend crashes on startup  
**Solutions**:
1. Check DATABASE_URL is correct
2. Verify database is running
3. Check database initialization ran
4. Test connection in Railway console

### Issue: Frontend build fails
**Symptoms**: Deployment error during build  
**Solutions**:
```bash
# Clear cache and rebuild
rm -rf node_modules build
npm install
npm run build
```

### Issue: Environment variables not working
**Symptoms**: Default values being used  
**Solutions**:
1. Ensure variables start with `REACT_APP_`
2. Restart development server after changes
3. Rebuild for production
4. Check deployment platform settings

---

## Production Monitoring

### Backend Monitoring
- Use Railway/Render logs
- Monitor database connections
- Track API response times
- Set up error alerts

### Frontend Monitoring
- Check Vercel/Netlify analytics
- Monitor Core Web Vitals
- Track user errors
- Set up uptime monitoring

---

## Scaling Considerations

### When traffic increases:
1. **Database**: Upgrade to larger instance
2. **Backend**: Enable auto-scaling
3. **Frontend**: Use CDN (automatic with Vercel)
4. **Caching**: Add Redis for sessions

---

## Security Checklist

- [ ] Environment variables not in code
- [ ] CORS configured properly
- [ ] Database credentials secure
- [ ] HTTPS enabled (automatic)
- [ ] Rate limiting implemented (future)
- [ ] Input validation on backend

---

## Cost Estimates

### Free Tier (Development)
- **Railway**: $5 credit/month (database + backend)
- **Vercel**: Unlimited deployments
- **Total**: ~$0-5/month

### Paid Tier (Production)
- **Railway**: $10-20/month
- **Vercel Pro**: $20/month (optional)
- **Total**: $10-40/month

---

## Post-Deployment Checklist

- [ ] Both services deployed and accessible
- [ ] All features working end-to-end
- [ ] Mobile responsiveness verified
- [ ] Performance acceptable (< 3s load)
- [ ] Error handling working
- [ ] Toast notifications appearing
- [ ] Auto-refresh functioning
- [ ] Documentation updated with URLs

---

## Video Recording Guide

### Part 1: Deployment Explanation (10-15 minutes)

#### A. Database Setup
- Show Railway dashboard
- Explain PostgreSQL creation
- Show DATABASE_URL configuration
- Demonstrate table initialization

#### B. Backend Deployment
- Show GitHub repository
- Explain Railway deployment
- Configure environment variables
- Run initialization script
- Test API endpoints with Postman

#### C. Frontend Deployment
- Show environment configuration
- Explain build process
- Deploy to Vercel
- Set environment variables
- Show successful deployment

#### D. Integration Testing
- Visit deployed frontend
- Create a show
- Book seats
- Show real-time updates
- Demonstrate mobile responsiveness

### Part 2: Feature Walkthrough (10-15 minutes)

#### A. Product Objective
- Explain ticket booking problem
- Target users (customers + admins)
- Solution overview

#### B. Architecture
- Show tech stack
- Explain frontend-backend connection
- Database design
- Concurrency handling

#### C. Feature Demo
- **User Flow**: Browse → Select → Book
- **Admin Flow**: Create show → Manage
- **Real-time Updates**: Auto-refresh demo
- **Error Handling**: Show validation
- **Responsive Design**: Mobile demo

#### D. Innovation Highlights
- Toast notification system
- Skeleton loading
- Auto-refresh mechanism
- Form validation
- Modern UI/UX

---

## Final URLs to Submit

```
Frontend: https://your-app.vercel.app
Backend: https://your-app.railway.app
GitHub: https://github.com/yourusername/ticket-booking
Video: https://youtu.be/your-video-id or gdrive link
```

---

**Deployment Complete! 🚀**

Your application is now live and ready for assessment.

---

# Deployment Guide

This guide provides instructions for deploying the ticket booking application.

## Backend Deployment (Render)

The backend is a Node.js application that will be deployed as a Web Service on Render.

### Prerequisites

1.  A Render account.
2.  A GitHub repository containing the project code.

### Step 1: Create a PostgreSQL Database on Render

1.  From your Render dashboard, click the **New +** button and select **PostgreSQL**.
2.  Give your database a unique **Name**.
3.  You can leave the other settings like **Database**, **User**, and **Region** as they are, or change them if you need to.
4.  Select a **Plan**. The `Free` plan is a good option for development and small projects.
5.  Click **Create Database**.
6.  Once the database is created, go to its "Info" section and copy the **Internal Connection String**. You will need this for your backend's environment variables.

### Step 2: Deploy the Backend Web Service
    *   Go to your Render Dashboard.
    *   Click on "New +" and select "Web Service".
    *   Connect your GitHub account and select the repository for this project.

2.  **Configure the Web Service:**
    *   **Name:** Give your service a name (e.g., `ticket-booking-backend`).
    *   **Region:** Choose a region close to you or your users.
    *   **Branch:** Select the branch you want to deploy (e.g., `main`).
    *   **Root Directory:** `ticket_backend`
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node index.js`
    *   **Instance Type:** `Free` (or a paid plan if you need more resources).

3.  **Add Environment Variables:**
    *   Under "Environment", click "Add Environment Variable". You will need to add the following:
        *   `MONGO_URI`: The connection string for your MongoDB database.
        *   `PORT`: Render sets this automatically, but if your app needs it, it's usually `10000`. The current backend code uses port 5000, so you might need to update the code to use `process.env.PORT` or set this variable.
        *   `JWT_SECRET`: A secret key for signing JWTs.

4.  **Deploy:**
    *   Click "Create Web Service". Render will start building and deploying your application.
    *   Once the deployment is complete, you will get a URL for your backend API (e.g., `https://ticket-booking-backend.onrender.com`). You will need this for your frontend configuration.

## Frontend Deployment (Vercel)

The frontend is a React (Vite) application that will be deployed on Vercel.

### Prerequisites

1.  A Vercel account.
2.  A GitHub repository containing the project code.

### Deployment Steps

1.  **Create a new Project on Vercel:**
    *   Go to your Vercel Dashboard.
    *   Click on "Add New..." and select "Project".
    *   Import the Git Repository from your GitHub account.

2.  **Configure the Project:**
    *   **Framework Preset:** Vercel should automatically detect it as a `Vite` project.
    *   **Root Directory:** `ticketBooking-frontend`

3.  **Add Environment Variables:**
    *   In the project settings, go to "Environment Variables".
    *   Add the following environment variable:
        *   `VITE_API_BASE_URL`: The URL of your deployed backend on Render (e.g., `https://ticket-booking-backend.onrender.com`). The `VITE_` prefix is important for Vite projects to expose the variable to the client-side code.

4.  **Deploy:**
    *   Click "Deploy". Vercel will build and deploy your frontend.
    *   After deployment, you will get a URL for your live frontend.

### Important Notes

*   **CORS:** Ensure your backend allows requests from your Vercel frontend's domain. You may need to configure CORS in your `index.js` on the backend.
*   **Database IP Whitelist:** If you are using MongoDB Atlas, make sure to add `0.0.0.0/0` to the IP access list to allow connections from Render.

This guide should help you get your application deployed. Let me know if you have any questions!
