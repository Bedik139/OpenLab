# OpenLab - Computer Lab Reservation System

A full-stack web application for reserving computer lab slots at DLSU, built for CCAPDEV (Web Application Development) Term 1, AY 2023-2024.

## Project Overview

OpenLab allows students to view real-time computer lab availability and reserve seats across multiple DLSU buildings (Gokongwei, Andrew, and Velasco labs). Lab technicians can manage walk-in reservations and handle no-show cases.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Template Engine:** Handlebars (express-handlebars)
- **Database:** MongoDB with Mongoose ODM
- **Session Store:** connect-mongo (MongoDB-backed sessions)
- **Password Hashing:** bcrypt
- **Frontend:** Bootstrap 4.4.1, custom CSS, vanilla JS with fetch API

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd OpenLab-ComputerReservation-Lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/openlab_db
   SESSION_SECRET=your_session_secret_here
   PORT=3000
   ```

4. Seed the database with sample data:
   ```bash
   node seed.js
   ```

5. Start the server:
   ```bash
   npm start
   ```
   Or with auto-reload (nodemon):
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | maria_santos@dlsu.edu.ph | password123 |
| Technician | tech_admin@dlsu.edu.ph | admin123 |

Other student accounts (all use password `password123`):
- jose_rizal@dlsu.edu.ph
- ana_lopez@dlsu.edu.ph
- karl_mendoza@dlsu.edu.ph
- lea_cruz@dlsu.edu.ph

## Features

### For Students
- **Register/Login/Logout** - Secure authentication with bcrypt password hashing
- **Remember Me** - Extends session to 3 weeks
- **Reserve Slots** - Book 30-minute time slots up to 7 days in advance
- **Anonymous Reservations** - Option to hide identity from other users
- **Edit/Cancel Reservations** - Modify or cancel existing bookings
- **View Lab Availability** - Color-coded seat maps showing real-time availability
- **Edit Profile** - Update bio, avatar, and personal information
- **Change Password** - Secure password change with current password verification
- **Search Users** - Find users by name, student ID, or college
- **Delete Account** - Remove account and cascade-delete all reservations

### For Lab Technicians (all student features, plus)
- **Reserve for Walk-ins** - Create reservations on behalf of walk-in students
- **Remove No-shows** - Cancel walk-in reservations after 10-minute window
- **View All Reservations** - See all users' reservations with email labels
- **Admin Dashboard** - View all-user stats and data

## Project Structure

```
OpenLab-ComputerReservation-Lab/
├── index.js                        # Express app entry point (port 3000)
├── package.json                    # Dependencies and scripts
├── seed.js                         # Database seed script
├── .env                            # MONGODB_URI, SESSION_SECRET, PORT
│
├── public/                         # Static assets (express.static)
│   ├── css/style.css               # All styling
│   ├── js/app.js                   # Frontend JS (fetch-based)
│   └── assets/bg.png               # Background image
│
├── src/
│   ├── models/                     # Mongoose schemas
│   │   ├── conn.js                 # MongoDB connection module
│   │   ├── User.js                 # User schema (bcrypt pre-save hook)
│   │   ├── Reservation.js          # Reservation schema (compound index)
│   │   └── Lab.js                  # Lab schema
│   ├── routes/
│   │   └── mainRouter.js           # Single router — all page + API routes
│   ├── controllers/
│   │   ├── authController.js       # Login, register, logout
│   │   ├── labController.js        # Lab data and seat availability
│   │   ├── reservationController.js # Reservation CRUD
│   │   ├── userController.js       # User search, profile, password
│   │   └── walkinController.js     # Walk-in reservation (technician)
│   ├── middleware/
│   │   └── auth.js                 # authMiddleware + techMiddleware
│   ├── helpers/
│   │   └── hbs-helpers.js          # Handlebars helpers (eq, formatDate, etc.)
│   └── views/                      # Handlebars templates
│       ├── layouts/
│       │   ├── auth.hbs            # Layout for public pages
│       │   └── dashboard.hbs       # Layout for authenticated pages
│       ├── partials/
│       │   ├── head.hbs            # Shared <head> partial
│       │   └── navbar.hbs          # Dynamic navbar (role-aware)
│       ├── index.hbs               # Landing page
│       ├── login.hbs               # Login form
│       ├── register.hbs            # Registration form
│       ├── dashboard.hbs           # User dashboard
│       ├── cmpslots.hbs            # Lab availability
│       ├── reserve.hbs             # Seat selection and reservation
│       ├── reservations.hbs        # View/manage reservations
│       ├── profile.hbs             # User profile
│       ├── public-profile.hbs      # Other user's public profile
│       ├── users.hbs               # User search and directory
│       ├── walkin.hbs              # Walk-in reservation (technician)
│       ├── changepassword.hbs      # Change password form
│       ├── adminsignup.hbs         # Technician login
│       └── error.hbs               # Error page (404, 403, 500)
│
└── specs/                          # Project specification PDFs
```

## Sample Data

| Data | Count | Details |
|------|-------|---------|
| Labs | 5 | AG1010 (30 seats), LS313 (25), GK101A (40), GK101B (40), GK304 (20) |
| Users | 6 | 5 students + 1 technician (all passwords hashed with bcrypt) |
| Reservations | 7 | Mix of upcoming, completed, and cancelled |
| Colleges | 8 | CCS, CLA, COB, COE, COS, GCOE, SOE, BAGCED |
| Time Slots | 20 | 30-min intervals from 7:30 AM to 5:30 PM |

## Reservation Rules

- Slots are available in **30-minute intervals** (7:30 AM - 5:30 PM)
- Students can reserve up to **7 days in advance**
- Walk-in no-shows can be removed after **10 minutes**
- **Double-booking prevention** via compound database index
- Students can make **anonymous reservations** to hide their identity

## API Routes

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/login` | Login with email + password |
| POST | `/api/register` | Create new account |
| POST | `/api/logout` | Destroy session and logout |

### Reservations
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/reservations` | Get current user's reservations |
| POST | `/api/reservations` | Create a new reservation |
| PUT | `/api/reservations/:id` | Update a reservation |
| DELETE | `/api/reservations/:id` | Cancel a reservation |

### Labs
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/labs` | Get all labs with availability |
| GET | `/api/labs/:code/seats` | Get seat map for a lab |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users` | Search users by name/ID/college |
| PUT | `/api/profile` | Update current user's profile |
| PUT | `/api/profile/password` | Change password |
| DELETE | `/api/profile` | Delete account |

### Walk-In (Technician Only)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/walkin` | Create walk-in reservation |
| GET | `/api/walkin` | Get today's walk-in reservations |
| PUT | `/api/walkin/:id/remove` | Remove no-show walk-in |

## Development Phases

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 0 | Project Proposal & Specifications | Complete |
| Phase 1 | Front-End Development (HTML, CSS, JS) | Complete |
| Phase 2 | Back-End Development (Node.js, MongoDB, Handlebars) | Complete |
| Phase 3 | Full Application (Sessions, Security, Polish) | Complete |

## Contributors

| Member | Responsibilities |
|--------|-----------------|
| **Benedict** | JSON & Fetch, Handlebars, Cookies & Sessions |
| **Ivan** | Node.js, Express, REST API |
| **Chrisander** | MongoDB, Mongoose, Password Hashing |

CCAPDEV Group Project - De La Salle University
