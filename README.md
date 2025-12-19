# Murmur Application - Twitter-like Social Media Platform

A full-stack social media application built with React, NestJS, and MySQL that allows users to post murmurs (tweets), follow other users, and interact through likes.

## 🚀 Implemented Features

### ✅ Authentication System

- **User Registration & Login** - Complete authentication flow
- **JWT Token Management** - Secure token-based authentication
- **Protected Routes** - Route guards for authenticated users only
- **Local Storage Auth** - Persistent login sessions

### ✅ Timeline Features

- **Murmur Feed** - Display murmurs from followed users
- **Pagination** - 10 murmurs per page with navigation controls
- **Like System** - Optimistic updates for instant feedback
- **Real-time Updates** - Auto-refresh timeline after follow actions
- **Create Murmurs** - Post new murmurs with character validation
- **Loading States** - Professional loading indicators

### ✅ Murmur Detail Page

- **Individual Murmur View** - Dedicated page for each murmur
- **Author Information** - User details and profile links
- **Like Functionality** - Toggle likes with real-time count updates
- **Responsive Design** - Mobile-friendly layout

### ✅ User Profile System

- **Own Profile Management** - View and manage personal profile
- **User Statistics** - Follower/following counts
- **Personal Murmurs** - List of user's own murmurs
- **Delete Functionality** - Remove own murmurs with confirmation
- **Other User Profiles** - View other users' profiles and murmurs

### ✅ Social Features

- **Follow/Unfollow System** - Build social connections
- **User Search** - Smart search with debouncing and caching
- **No-Result Optimization** - Prevent redundant API calls
- **Follow Status Updates** - Real-time follow button states

### ✅ Performance Optimizations

- **Debounced Search** - 300ms delay to reduce API calls
- **Smart Caching** - Cache search results and no-result queries
- **Optimistic Updates** - Instant UI feedback for likes
- **Route-Specific Loading** - Only load necessary data per route
- **Request Cancellation** - Prevent race conditions

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Vite** for build tooling

### Backend

- **NestJS** with TypeScript
- **JWT Authentication**
- **TypeORM** for database operations
- **MySQL 8.x** database

### Development Tools

- **Docker** for database containerization
- **ESLint** for code quality
- **Hot Reload** for development

## 📁 Project Structure

```
├── src/                    # Frontend (React)
│   ├── components/         # Reusable UI components
│   ├── pages/             # Route components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service layer
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript definitions
├── server/                # Backend (NestJS)
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management
│   │   ├── murmurs/       # Murmur operations
│   │   └── database/      # Database configuration
└── db/                    # Database setup
    └── docker-compose.yml # MySQL container
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.x.x)
- npm/yarn
- Docker & Docker Compose

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd murmur-app
   ```

2. **Setup Database**

   ```bash
   cd db
   docker compose build
   docker compose up -d
   ```

3. **Setup Backend**

   ```bash
   cd server
   npm install
   npm run start:dev
   ```

4. **Setup Frontend**

   ```bash
   cd src
   yarn install
   yarn dev
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📋 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Murmurs

- `GET /api/murmurs` - Get timeline murmurs (paginated)
- `GET /api/murmurs/:id` - Get specific murmur
- `POST /api/me/murmurs` - Create new murmur
- `DELETE /api/me/murmurs/:id` - Delete own murmur
- `POST /api/murmurs/:id/like` - Toggle like on murmur

### Users

- `GET /api/users` - Get all users
- `GET /api/users/search` - Search users by name/username
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/murmurs` - Get user's murmurs
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user

## 🎯 Key Features Implemented

### Professional Architecture

- **Service Layer Pattern** - Clean separation of concerns
- **Custom Hooks** - Reusable business logic
- **Route-Specific Data Loading** - Optimized API calls
- **Error Handling** - Comprehensive error management

### User Experience

- **Instant Feedback** - Optimistic updates for likes and follows
- **Smart Search** - Debounced with result caching
- **Responsive Design** - Works on all device sizes
- **Loading States** - Clear feedback during operations

### Performance

- **Minimal API Calls** - Smart caching prevents redundant requests
- **Optimized Rendering** - Efficient React patterns
- **Fast Navigation** - Client-side routing
- **Database Optimization** - Efficient queries with pagination

## 🔧 Development Features

### Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code quality enforcement
- **Component Architecture** - Modular and reusable
- **Clean Code** - Professional patterns and practices

### Developer Experience

- **Hot Reload** - Instant development feedback
- **Error Boundaries** - Graceful error handling
- **Development Tools** - Comprehensive debugging support

## 🎨 UI/UX Features

- **Clean Interface** - Minimalist Twitter-like design
- **Intuitive Navigation** - Easy-to-use routing
- **Visual Feedback** - Loading spinners and state indicators
- **Responsive Layout** - Mobile-first design approach
- **Accessibility** - Keyboard navigation and screen reader support

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Authentication guards
- **Input Validation** - Server-side validation
- **XSS Protection** - Safe content rendering

---

**Status**: ✅ All core features implemented and fully functional
**Last Updated**: December 2024
