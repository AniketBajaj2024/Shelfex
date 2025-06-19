
# Job Application Tracker

A full-stack job application tracking system where:
- **Admins** can post jobs, view applicants, update application statuses, and delete jobs.
- **Applicants** can view jobs, apply, and track the status of their applications.

## Features

### 🔐 Authentication
- JWT-based login and signup for Admin and Applicants

### 👨‍💼 Admin Panel
- Post new job listings
- View applicants per job with filter/sort
- Update application statuses (e.g., Interview, Offer)
- Delete jobs (applicants will see "Job Closed")

### 🙋‍♂️ Applicant Panel
- View available jobs
- Apply to jobs (once per job)
- View your application status

### ✉️ Email Notifications
- Applicants receive an email after applying
- Applicants receive an email when status is updated

## Tech Stack

- **Frontend:** React, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Email Service:** Nodemailer (Gmail SMTP)

## Setup Instructions

### Backend (Render or Local)
1. Clone the repo and navigate to `/backend`
2. Create a `.env` file:
   ```env
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   ```
3. Run the server:
   ```bash
   npm install
   node index.js
   ```

### Frontend (Vercel or Local)
1. Navigate to `/frontend`
2. Create a `.env` file:
   ```env
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```
3. Start the frontend:
   ```bash
   npm install
   npm start
   ```

## Live Demo
- Frontend: https://shelfex-omega.vercel.app/
- Backend: https://shelfex-cjs0.onrender.com

## Author
Aniket Bajaj
