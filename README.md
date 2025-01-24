# Project Description

A full-stack web application enabling user authentication, task management, and content sharing through a feed system.
working link - [https://frontend-igyp.onrender.com](https://frontend-4ghd.onrender.com/)

## Features Implemented

### 1. User Authentication
- Login with email/password
- Logout via profile icon
- User registration
- Forgot password functionality

### 2. Task Management
- Task creation (logged-in users only)
- Drag and drop task status updates
- Task deletion with confirmation

### 3. Feed Management
- Public feed visibility
- Post creation for logged-in users
- Image and caption upload
- Automatic feed update
- Refresh button for feed loading

## Technical Implementation

### Database Models
1. **User Model**: 
   - Stores user details
   - Tracks associated tasks and feeds

2. **Feed Model**:
   - Stores image (using Multer)
   - Includes caption
   - Tracks creator via user ID

3. **Task Model**:
   - Stores task name, description
   - Tracks status and creator

### Architecture
- Backend APIs with controllers for each feature
- Dedicated route files
- Authentication middleware
- Server handles database connection and API routing

### Frontend-Backend Connection

#### Context Provider
- Created to manage global state
- Handles authentication state
- Provides login, logout, and registration methods
- Manages user token and authentication status
- Facilitates secure API calls with token management

#### API Integration
- Uses Axios for HTTP requests
- Implements interceptors for token handling
- Creates separate service files for different API types:
  - Authentication services
  - Task management services
  - Feed management services

#### Authentication Flow
- Store authentication token in localStorage
- Implement protected routes
- Use context to control access to authenticated sections
- Automatic token verification on app load
- Redirect unauthenticated users to login page

#### Error Handling
- Centralized error management
- Display user-friendly error messages
- Handle network and server-side errors
- Implement retry mechanisms for failed requests

#### Security Considerations
- Secure token storage
- HTTPS for all API communications
- Implement refresh token mechanism
- Client-side route protection

## Technology Stack
- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: Custom + potential Google OAuth
