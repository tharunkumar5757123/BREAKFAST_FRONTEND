# 🍳 Breakfast Booking Platform

A full-stack **Breakfast Booking Platform** built using the MERN stack. The application allows users to browse breakfast menus, manage bookings, and interact with the platform through a responsive React interface. It includes secure authentication and RESTful APIs for managing users, menus, and bookings.

## 🚀 Live Demo

**Live Application:**
https://69183513f40f0a00080ead29--inquisitive-pie-7209e0.netlify.app/login

---

## 📌 Features

* 🔐 Secure user authentication using JWT
* 👤 User authentication and authorization
* 🍳 Breakfast menu display and management
* 📅 Breakfast booking functionality
* 🛒 Cart functionality
* 📍 Location-based booking support
* 💳 Payment integration
* 🔄 Dynamic data updates using React Hooks
* 📡 RESTful APIs for frontend-backend communication
* 📱 Responsive user interface
* 🗄️ MongoDB database for storing application data
* 👨‍💼 Role-based functionality for users and administrators

---

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* Tailwind CSS
* React Hooks
* Axios

### Backend

* Node.js
* Express.js
* RESTful APIs
* JWT Authentication
* bcrypt

### Database

* MongoDB

### Other Technologies

* Stripe
* Git & GitHub
* Netlify

---

## 🏗️ Project Architecture

```text
Breakfast Booking Platform
│
├── Frontend
│   ├── React.js
│   ├── React Hooks
│   ├── Axios
│   └── Tailwind CSS
│
├── Backend
│   ├── Node.js
│   ├── Express.js
│   ├── JWT Authentication
│   └── REST APIs
│
└── Database
    └── MongoDB
```

---

## 🔐 Authentication

The application uses **JWT (JSON Web Token)** based authentication.

### Authentication Flow

```text
User
  ↓
Login / Register
  ↓
Backend Authentication
  ↓
JWT Token Generated
  ↓
Token Stored on Client
  ↓
Authenticated API Requests
  ↓
Protected Resources
```

Passwords are securely handled using **bcrypt** hashing before being stored in the database.

---

## 📋 Main Functionalities

### 👤 User Management

Users can:

* Register an account
* Login securely
* Access authenticated features
* Manage their booking-related activities

### 🍳 Menu Management

The platform provides breakfast menu information dynamically through the backend API.

Administrators can manage menu-related data through the application.

### 📅 Booking Management

Users can:

* Browse available breakfast options
* Select required items
* Create bookings
* Manage their booking information

### 🛒 Cart

The platform provides cart functionality for managing selected breakfast items before completing the booking process.

### 💳 Payments

The application integrates **Stripe** for handling online payment functionality.

---

## 🔌 API Communication

The React frontend communicates with the Express.js backend through RESTful APIs.

**Example flow:**

```text
React Frontend
      ↓
     Axios
      ↓
Express.js API
      ↓
Controllers
      ↓
MongoDB
```

Axios is used to send HTTP requests such as:

```text
GET     → Fetch menu / booking data
POST    → Create users / bookings
PUT     → Update data
DELETE  → Remove data
```

---

## 🗄️ Database

The application uses **MongoDB** to store application data.

Example data areas include:

* Users
* Menu items
* Bookings
* Cart information
* Locations
* Payment-related information

---

## 🔒 Security

The application implements several security-related practices:

* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Role-based access control
* Authenticated requests for protected resources

---

## 📱 User Flow

```text
Open Application
       ↓
Login / Register
       ↓
Browse Breakfast Menu
       ↓
Select Items
       ↓
Add to Cart
       ↓
Choose Booking / Location Details
       ↓
Complete Payment
       ↓
Booking Created
```

---

## 💻 Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Navigate to the project

```bash
cd breakfast-booking-platform
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Install backend dependencies

```bash
cd ../backend
npm install
```

### 5. Configure environment variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 6. Start the backend

```bash
npm start
```

### 7. Start the frontend

```bash
npm run dev
```

---

## 🌐 Deployment

The frontend is deployed using **Netlify**.

**Live Application:**

https://69183513f40f0a00080ead29--inquisitive-pie-7209e0.netlify.app/login

The backend can be deployed separately using a Node.js-compatible hosting platform.

---

## 🎯 Project Highlights

* Developed a complete **full-stack MERN application**
* Implemented secure authentication using **JWT and bcrypt**
* Designed RESTful APIs using **Express.js**
* Integrated **MongoDB** for persistent data storage
* Built a responsive React frontend
* Used **Axios** for API communication
* Implemented booking, menu, cart, location, and payment functionality
* Applied role-based access control for different users

Full Stack Developer | MERN Stack

### Connect

* GitHub: https://github.com/tharunkumar5757123
* LinkedIn: https://www.linkedin.com/in/tharun-kumar-08716a281/
* Portfolio: https://portfolio-app-blond-seven.vercel.app/

---

## 📄 License

This project is created for educational and portfolio purposes.
