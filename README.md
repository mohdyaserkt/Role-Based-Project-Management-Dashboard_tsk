# Project Management Dashboard - README

## Overview

A full-stack project management dashboard with role-based access control (admin, manager, employee) built with:
- Frontend: React Vite + material/ui
- Backend: Node.js/Express + MongoDB
- State Management: Redux Toolkit
- Authentication: JWT

## Live Demo

[View Live Demo](https://role-based-project-management-dashb.vercel.app/)

## Features

- **Role-based authentication**
- **Admin dashboard**: Manage all users, projects, and tasks
- **Manager dashboard**: Create projects and assign tasks
- **Employee dashboard**: View assigned projects and update task status
- **Responsive design** with material/ui components

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mohdyaserkt/Role-Based-Project-Management-Dashboard_tsk
   cd Role-Based-Project-Management-Dashboard_tsk/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. (Optional) Seed the database with test users:
   ```bash
   node utils/seed.js
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to:
   ```
   http://localhost:5173
   ```

## Test Credentials

The seed script creates the following test users:

| Role     | Email                     | Password |
|----------|---------------------------|----------|
| Admin    | superadmin@gmail.com      | 123456   |
| Manager  | manager@gmail.com         | 123456   |
| Employee | testemployee1@gmail.com   | 123456   |
| Employee | testemployee2@gmail.com   | 123456   |

## Database Seeding

The `seed.js` script in the server directory:

1. Creates test users for all roles

To run the seed script:
```bash
node utils/seed.js
```

## Deployment

The application is deployed on Vercel:
- Frontend: [Live Demo](https://role-based-project-management-dashb.vercel.app/)
- Backend: Deployed on Render/Railway (update with your backend URL)

## Technologies Used

### Frontend
- React Vite
- material/ui + Tailwind CSS
- Redux Toolkit
- Axios
- React Router

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

## Project Structure

```
project-management-dashboard/
├── client/                 # Frontend code
│   ├── src/                # Source files
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
└── server/                 # Backend code
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    ├── utils/              # Utility functions
    └── package.json        # Backend dependencies
```

## License

This project is licensed under the MIT License.
