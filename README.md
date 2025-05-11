# Kanban Board Application

## Table of Contents
1. [Backend Setup](#backend-setup)
2. [Frontend Setup](#frontend-setup)
3. [Environment Variables](#environment-variables)
4. [API Endpoints](#api-endpoints)
5. [Deployment](#deployment)
6. [Technologies Used](#technologies-used)

---

## Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

### Installation
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the required environment variables (see [Environment Variables](#environment-variables) section)

4. Start the development server
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` by default.

---

## Frontend Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Navigate to the frontend directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the required environment variables:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server
   ```bash
   npm start
   ```

The application will open in your default browser at `http://localhost:3000`.

---

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/kanban?retryWrites=true&w=majority
SESSION_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/status` - Check authentication status

### Boards
- `GET /api/boards` - Get all boards for the user
- `POST /api/boards` - Create a new board
- `GET /api/boards/:id` - Get a specific board
- `PUT /api/boards/:id` - Update a board
- `DELETE /api/boards/:id` - Delete a board

### Tasks
- `GET /api/tasks?boardId=<boardId>` - Get all tasks for a board
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PUT /api/tasks/:id/move` - Move task to another status column

---

## Deployment

### Backend Deployment
1. Set up a MongoDB Atlas database
2. Configure production environment variables:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-url.com
   ```
3. Deploy to your preferred hosting platform (Heroku, Render, AWS, etc.)

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to Netlify, Vercel, or your preferred static hosting service

---

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Express-session for authentication
- CORS middleware
- Dotenv for environment variables

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Context API or Redux for state management
- React bootstrap or styled-components for styling
