# Ticket Management System

A web-based Ticket Management System built with Node.js, Express, MongoDB, and  JavaScript.  
This system allows users to create, view, update, and delete support tickets, with role-based access for users, agents, and admins.

## Features

- User registration and login with JWT authentication (stored in HTTP-only cookies)
- Role-based access: User, Agent, Admin
- Users can create, view, edit, and delete their own tickets
- Agents and Admins can view and manage all tickets
- Ticket status and priority management
- Search, filter, and pagination for tickets
- Responsive UI with  JS and CSS

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** HTML, CSS, JavaScript
- **Authentication:** JWT, HTTP-only cookies
- **Other:** CORS, cookie-parser, bcrypt

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB



 **Set up environment variables**

   Create a `.env` file in the `backend` folder:

   ```
   MONGO_URI=mongodb://localhost:27017/ticket-management
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
**Start the backend server**
   ```bash
   npm start
   ```

 **Open the frontend**

   Open `views/login.html` or `views/index.html` in your browser (you can use Live Server or serve the `views` folder with any static server).

## Folder Structure

```
backend/
  controllers/
  middleware/
  models/
  routes/
  .env
  server.js
views/
  css/
    styles.css
  js/
    auth.js
    dashboard.js
  login.html
  dashboard.html
  ...
```

## Usage

- Register as a new user or login.
- Users can create and manage their own tickets.
- Agents/Admins can view and manage all tickets.
- Use the dashboard to filter, search, and paginate tickets.

## License

This project is licensed under the MIT
