# 🚀 FlowAI – AI-Based Productivity Enhancer

An AI-powered productivity management application that helps users organize tasks, analyze productivity patterns, and receive intelligent insights using Google Gemini AI.

🌐 **Live Demo:** https://ai-based-productivity-enhancer-i73c.vercel.app

⚙️ **Backend API:** https://flowai-87hz.onrender.com

---

## 📌 Features

### 🔐 Authentication
- User Registration
- Secure Login
- JWT Authentication
- Protected Routes

### ✅ Task Management
- Create Tasks
- Edit Tasks
- Delete Tasks
- Mark Tasks as Complete
- Task Prioritization

### 🤖 AI Analytics
- AI-generated Productivity Insights
- Productivity Score
- Task Prioritization Suggestions
- Personalized Recommendations
- Daily Productivity Analysis

### 📊 Dashboard
- Total Tasks
- Completed Tasks
- Pending Tasks
- Completion Percentage
- AI Analytics Dashboard

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MongoDB Atlas
- Mongoose

### AI
- Google Gemini API

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 📁 Project Structure

```
AI_Based_Productivity_Enhancer
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/AI_Based_Productivity_Enhancer.git
```

```bash
cd AI_Based_Productivity_Enhancer
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000
```

Run backend:

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
REACT_APP_API_URL=http://localhost:5000
```

Run frontend

```bash
npm start
```

---

## 🌍 Deployment

### Frontend
- Vercel

### Backend
- Render

### Database
- MongoDB Atlas

---

## API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | /auth/register |
| POST | /auth/login |

### Tasks

| Method | Endpoint |
|---------|----------|
| GET | /tasks |
| POST | /tasks |
| PUT | /tasks/:id |
| DELETE | /tasks/:id |

### Analytics

| Method | Endpoint |
|---------|----------|
| GET | /analytics |

---

## Screenshots

### Login Page

_Add Screenshot_

### Dashboard

_Add Screenshot_

### AI Analytics

_Add Screenshot_

---

## Future Improvements

- Email Verification
- Forgot Password
- OAuth Login (Google/GitHub)
- Dark Mode
- Task Reminders
- Calendar Integration
- Drag & Drop Task Board
- Team Collaboration
- Notifications
- Mobile Responsive UI Improvements

---

## Author

**Ayush Kumar Yadav**

- GitHub: https://github.com/ayush-kumar-yadav
- LinkedIn: https://linkedin.com/in/ayush-kumar-yadav-188442326

---

## License

This project is licensed under the MIT License.
