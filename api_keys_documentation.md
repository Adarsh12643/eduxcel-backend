# EduXcel AI - Required API Keys & Environment Variables

This document outlines all the environment variables and API keys required to run the full EduXcel platform (Frontend, Backend, and ML Engine).

## 1. Node Backend (`backend/.env`)

The backend coordinates authentication, MongoDB routing, and interactions with the ML Engine and Gemini. Create a `.env` file in the `backend/` directory with the following variables:

```env
# MongoDB Connection String (Required)
# Maps the 'users.EduXcel' collection
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/eduxcel"

# JWT Secret for Session Management (Required)
# Used to encode the auth streak and user roles
JWT_SECRET="your_super_secret_jwt_string"

# Google OAuth Credentials (Required)
# Used for standard Single Sign-On (SSO) login
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Gemini API Key (Required)
# Powers the XceloChatbot contextual responses across Student/Faculty/Admin views
GEMINI_API_KEY="your_gemini_api_key_here"

# ML Engine Service Link (Required)
# Used to bridge Express.js to the Python FastAPI microservice
ML_SERVICE_URL="https://eduxcel-backend-ml-service.onrender.com"
PORT=5000
```

## 2. React Frontend (`frontend/.env`)

The frontend utilizes standard Vite environment variables for routing API queries and mounting Google OAuth buttons. Create a `.env` file in the `frontend/` directory with the following variables:

```env
# Backend Node Server URL
VITE_API_URL="https://eduxcel-backend-1.onrender.com/api"

# Google OAuth Public Client ID
VITE_GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
```

## 3. Python ML Engine (`ml-engine/.env`)

*Note: The ML Engine handles the `predict()` and `recommend()` routes for Recovery Hub.* 

Currently, the ML engine utilizes the `youtubesearchpython` library to dynamically scrape YouTube, meaning it **does not** require an explicit YouTube Data API Key. It also does not invoke Gemini natively (that is handled entirely by the Express backend). Therefore, the ML Engine currently requires zero explicit API keys other than defining its host port.

```env
PORT=8000
```

