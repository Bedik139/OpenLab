/**
 * Main Router (Ivan)
 *
 * Single router file that defines all routes for the application.
 * Following the mc3-debttracker pattern, we use "just one" router
 * for the meantime. This can be broken into sub-files later.
 *
 * TODO (Ivan):
 * 1. Import express.Router()
 * 2. Import controllers:
 *    - authController   from '../controllers/authController'
 *    - labController    from '../controllers/labController'
 *    - reservationController from '../controllers/reservationController'
 *    - userController   from '../controllers/userController'
 *    - walkinController from '../controllers/walkinController'
 * 3. Import middleware:
 *    - { authMiddleware, techMiddleware } from '../middleware/auth'
 * 4. Import models (for page routes that need data):
 *    - Lab              from '../models/Lab'
 *    - Reservation      from '../models/Reservation'
 *
 * 5. Define PAGE routes (render Handlebars views):
 *    GET /                  → render('index', { layout: 'auth', title: 'OpenLab', activePage: 'index' })
 *    GET /login             → if session, redirect /dashboard; else render('login', { layout: 'auth', ... })
 *    GET /register          → if session, redirect /dashboard; else render('register', { layout: 'auth', ... })
 *    GET /adminsignup       → if session, redirect /dashboard; else render('adminsignup', { layout: 'auth', ... })
 *    GET /changepassword    → [authMiddleware] render('changepassword', { layout: 'auth', ... })
 *    GET /dashboard         → [authMiddleware] fetch stats, render('dashboard', { layout: 'dashboard', ... })
 *    GET /cmpslots          → [authMiddleware] fetch labs, render('cmpslots', { layout: 'dashboard', ... })
 *    GET /reserve           → [authMiddleware] fetch lab/seats, render('reserve', { layout: 'dashboard', ... })
 *    GET /reservations      → [authMiddleware] fetch reservations, render('reservations', { layout: 'dashboard', ... })
 *    GET /profile           → [authMiddleware] fetch user data, render('profile', { layout: 'dashboard', ... })
 *    GET /profile/:id       → [authMiddleware] fetch target user, render('public-profile', { layout: 'dashboard', ... })
 *    GET /users             → [authMiddleware] fetch users, render('users', { layout: 'dashboard', ... })
 *    GET /walkin            → [techMiddleware] fetch labs/walkins, render('walkin', { layout: 'dashboard', ... })
 *
 * 6. Define AUTH API routes:
 *    POST /api/login        → authController.login
 *    POST /api/register     → authController.register
 *    POST /api/logout       → authController.logout
 *
 * 7. Define RESERVATION API routes (all require authMiddleware):
 *    GET    /api/reservations          → reservationController.getAll
 *    GET    /api/reservations/:id      → reservationController.getById
 *    POST   /api/reservations          → reservationController.create
 *    PUT    /api/reservations/:id      → reservationController.update
 *    PUT    /api/reservations/:id/cancel → reservationController.cancel
 *    DELETE /api/reservations/:id      → reservationController.delete
 *
 * 8. Define LAB API routes:
 *    GET /api/labs                     → labController.getAll
 *    GET /api/labs/:code               → labController.getByCode
 *    GET /api/labs/:code/seats         → labController.getSeats
 *
 * 9. Define USER API routes (all require authMiddleware):
 *    GET    /api/users                 → userController.search
 *    GET    /api/users/:id             → userController.getById
 *    PUT    /api/profile               → userController.updateProfile
 *    PUT    /api/profile/password      → userController.changePassword
 *    DELETE /api/profile               → userController.deleteAccount
 *
 * 10. Define WALK-IN API routes (all require techMiddleware):
 *    GET    /api/walkin                → walkinController.getAll
 *    POST   /api/walkin                → walkinController.create
 *    PUT    /api/walkin/:id/remove     → walkinController.removeNoShow
 *
 * 11. Export router
 */

// TODO: Implement the above

// 1. Import express.Router()
const express = require('express');
const router = express.Router();

// 2. Import controllers
const authController = require('../controllers/authController');
const labController = require('../controllers/labController');
const reservationController = require('../controllers/reservationController');
const userController = require('../controllers/userController');
const walkinController = require('../controllers/walkinController');

// 3. Import middleware
const { authMiddleware, techMiddleware } = require('../middleware/auth');

// 4. Import models (for page routes that need initial data)
const mongoose = require('mongoose');
const Lab = require('../models/Lab');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

// Shared time slots (30-minute intervals, 7 AM - 9 PM)
const TIME_SLOTS = [
    { value: '07:00 - 07:30', label: '7:00 AM - 7:30 AM' },
    { value: '07:30 - 08:00', label: '7:30 AM - 8:00 AM' },
    { value: '08:00 - 08:30', label: '8:00 AM - 8:30 AM' },
    { value: '08:30 - 09:00', label: '8:30 AM - 9:00 AM' },
    { value: '09:00 - 09:30', label: '9:00 AM - 9:30 AM' },
    { value: '09:30 - 10:00', label: '9:30 AM - 10:00 AM' },
    { value: '10:00 - 10:30', label: '10:00 AM - 10:30 AM' },
    { value: '10:30 - 11:00', label: '10:30 AM - 11:00 AM' },
    { value: '11:00 - 11:30', label: '11:00 AM - 11:30 AM' },
    { value: '11:30 - 12:00', label: '11:30 AM - 12:00 PM' },
    { value: '12:00 - 12:30', label: '12:00 PM - 12:30 PM' },
    { value: '12:30 - 13:00', label: '12:30 PM - 1:00 PM' },
    { value: '13:00 - 13:30', label: '1:00 PM - 1:30 PM' },
    { value: '13:30 - 14:00', label: '1:30 PM - 2:00 PM' },
    { value: '14:00 - 14:30', label: '2:00 PM - 2:30 PM' },
    { value: '14:30 - 15:00', label: '2:30 PM - 3:00 PM' },
    { value: '15:00 - 15:30', label: '3:00 PM - 3:30 PM' },
    { value: '15:30 - 16:00', label: '3:30 PM - 4:00 PM' },
    { value: '16:00 - 16:30', label: '4:00 PM - 4:30 PM' },
    { value: '16:30 - 17:00', label: '4:30 PM - 5:00 PM' },
    { value: '17:00 - 17:30', label: '5:00 PM - 5:30 PM' },
    { value: '17:30 - 18:00', label: '5:30 PM - 6:00 PM' },
    { value: '18:00 - 18:30', label: '6:00 PM - 6:30 PM' },
    { value: '18:30 - 19:00', label: '6:30 PM - 7:00 PM' },
    { value: '19:00 - 19:30', label: '7:00 PM - 7:30 PM' },
    { value: '19:30 - 20:00', label: '7:30 PM - 8:00 PM' },
    { value: '20:00 - 20:30', label: '8:00 PM - 8:30 PM' },
    { value: '20:30 - 21:00', label: '8:30 PM - 9:00 PM' }
];

// ==========================================
// 5. PAGE ROUTES (Render Handlebars Views)
// ==========================================

// Public Pages
router.get('/', (req, res) => {
    res.render('index', {
        layout: 'auth',
        title: 'OpenLab',
        activePage: 'index',
        showFeatures: true,
        features: [
            { title: 'Real-Time Availability', desc: 'Check which computer lab seats are open right now across all DLSU buildings.' },
            { title: 'Quick Reservations', desc: 'Reserve your preferred seat in seconds with our streamlined booking system.' },
            { title: 'Smart Management', desc: 'View, edit, or cancel your reservations anytime from any device.' }
        ]
    });
});

router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('login', { layout: 'auth', title: 'Login', activePage: 'login' });
});

router.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('register', { layout: 'auth', title: 'Register', activePage: 'register' });
});

router.get('/adminsignup', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('adminsignup', { layout: 'auth', title: 'Admin Signup', activePage: 'adminsignup' });
});

router.get('/about', (req, res) => {
    res.render('about', { layout: 'dashboard', title: 'About OpenLab', activePage: 'about', containerClass: 'dashboard-container' });
});

// Protected Pages (Require Authentication)
router.get('/changepassword', authMiddleware, (req, res) => {
    res.render('changepassword', { layout: 'auth', title: 'Change Password' });
});

router.get('/dashboard', authMiddleware, async (req, res) => {
    const userId = req.session.user._id;
    const isTechnician = req.session.user.accountType === 'technician';
    const userQuery = isTechnician ? {} : { user: userId };

    // Auto-complete past "upcoming" reservations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completeQuery = isTechnician
        ? { status: 'upcoming', date: { $lt: today } }
        : { user: userId, status: 'upcoming', date: { $lt: today } };
    await Reservation.updateMany(completeQuery, { $set: { status: 'completed' } });

    // Upcoming reservations (limit 5, soonest first)
    const upcoming = await Reservation.find({ ...userQuery, status: 'upcoming' })
        .populate('user', 'firstName lastName email')
        .sort({ date: 1 })
        .limit(5)
        .lean();

    if (isTechnician) {
        upcoming.forEach(r => { if (r.user) r.userEmail = r.user.email; });
    }

    // Recent activity: last 10 reservations of any status, newest first
    const recentReservations = await Reservation.find(userQuery)
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean();

    const activities = recentReservations.map(r => {
        let type, text;
        if (r.status === 'cancelled') {
            type = 'cancelled';
            text = 'Cancelled reservation at <strong>' + r.lab + ' - Seat ' + r.seat + '</strong>';
        } else if (r.status === 'completed') {
            type = 'completed';
            text = 'Completed session at <strong>' + r.lab + ' - Seat ' + r.seat + '</strong>';
        } else {
            type = 'booked';
            const slotText = r.timeSlots && r.timeSlots.length > 1
                ? r.timeSlots[0].split(' - ')[0] + ' - ' + r.timeSlots[r.timeSlots.length - 1].split(' - ')[1] + ' (' + r.timeSlots.length + ' slots)'
                : (r.timeSlots && r.timeSlots[0] ? r.timeSlots[0] : '');
            text = 'Booked <strong>' + r.lab + ' - Seat ' + r.seat + '</strong> for ' + slotText;
        }
        const diffMs = Date.now() - new Date(r.updatedAt).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        let time;
        if (diffMins < 1) time = 'Just now';
        else if (diffMins < 60) time = diffMins + ' min ago';
        else if (diffMins < 1440) time = Math.floor(diffMins / 60) + ' hr ago';
        else time = Math.floor(diffMins / 1440) + ' day(s) ago';
        return { type, text, time };
    });

    // Frequently used labs: top 5
    const favoritePipeline = [
        { $match: isTechnician ? {} : { user: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$lab', visits: { $sum: 1 } } },
        { $sort: { visits: -1 } },
        { $limit: 5 }
    ];
    const labAgg = await Reservation.aggregate(favoritePipeline);
    const favoriteLabs = [];
    for (const entry of labAgg) {
        const labDoc = await Lab.findOne({ code: entry._id }).lean();
        favoriteLabs.push({ code: entry._id, building: labDoc ? labDoc.building : 'Unknown', visits: entry.visits });
    }

    res.render('dashboard', {
        layout: 'dashboard',
        title: 'Dashboard',
        activePage: 'dashboard',
        containerClass: 'dashboard-container',
        isTechnician,
        upcoming,
        activities,
        favoriteLabs
    });
});

router.get('/cmpslots', async (req, res) => {
    const labs = await Lab.find().lean();

    // Compute available/occupied counts for each lab
    const today = new Date().toISOString().split('T')[0];
    for (const lab of labs) {
        const occupiedCount = await Reservation.countDocuments({
            lab: lab.code,
            date: today,
            status: 'upcoming'
        });
        lab.occupied = occupiedCount;
        lab.available = lab.totalSeats - occupiedCount;
    }

    const maxDateObj = new Date();
    maxDateObj.setDate(maxDateObj.getDate() + 7);
    const maxDate = maxDateObj.toISOString().split('T')[0];

    res.render('cmpslots', { layout: 'dashboard', title: 'Computer Slots', activePage: 'cmpslots', containerClass: 'slots-container', labs, timeSlots: TIME_SLOTS, today, maxDate });
});

router.get('/reserve', async (req, res) => {
    const labCode = req.query.lab;
    const editId = req.query.edit;

    if (!labCode) {
        return res.redirect('/cmpslots');
    }

    const lab = await Lab.findOne({ code: labCode }).lean();
    if (!lab) {
        return res.redirect('/cmpslots');
    }

    // Copy time slots so we can safely mutate (mark selected for edit mode)
    const timeSlots = TIME_SLOTS.map(ts => ({ ...ts }));

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const maxDateObj = new Date();
    maxDateObj.setDate(maxDateObj.getDate() + 7);
    const maxDate = maxDateObj.toISOString().split('T')[0];

    // Disable timeslots that have already passed when the date is today
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    timeSlots.forEach(ts => {
        // Parse the end time from the value (e.g. "07:00 - 07:30")
        const endTimePart = ts.value.split(' - ')[1]; // "07:30"
        const [endH, endM] = endTimePart.split(':').map(Number);
        const endTotalMinutes = endH * 60 + endM;
        if (currentTotalMinutes >= endTotalMinutes) {
            ts.disabled = true;
        }
    });

    // Build seat grid — on initial load show all seats as available (no slot selected yet)
    const seats = [];
    for (let r = 0; r < lab.rows.length; r++) {
        const rowLetter = lab.rows[r];
        for (let c = 1; c <= lab.cols; c++) {
            const seatId = `${rowLetter}${c}`;
            seats.push({ id: seatId, status: 'available', tooltip: seatId + ' - Available' });
        }
    }
    lab.available = seats.length;

    // Handle edit mode
    let editReservation = null;
    if (editId) {
        const editRes = await Reservation.findById(editId).lean();
        if (editRes) {
            editReservation = {
                _id: editRes._id,
                seat: editRes.seat,
                dateStr: editRes.date ? new Date(editRes.date).toISOString().split('T')[0] : today,
                timeSlots: editRes.timeSlots || [],
                anonymous: editRes.isAnonymous
            };
            // Mark matching time slots as selected
            const editSlotSet = new Set(editRes.timeSlots || []);
            timeSlots.forEach(ts => {
                ts.selected = editSlotSet.has(ts.label);
            });
        }
    }

    // Summary defaults
    const summaryDate = editReservation
        ? new Date(editReservation.dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date(today).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    res.render('reserve', {
        layout: 'dashboard',
        title: 'Reserve a Slot',
        activePage: 'reserve',
        containerClass: 'reserve-container',
        lab,
        seats,
        timeSlots,
        today,
        maxDate,
        summaryDate,
        editReservation
    });
});

router.get('/reservations', authMiddleware, async (req, res) => {
    const userId = req.session.user._id;
    const isTechnician = req.session.user.accountType === 'technician';
    const query = isTechnician ? {} : { user: userId };

    const reservations = await Reservation.find(query)
        .populate('user', 'firstName lastName email')
        .sort({ date: -1 })
        .lean();

    // Add userEmail for technician view
    if (isTechnician) {
        reservations.forEach(r => {
            if (r.user) r.userEmail = r.user.email;
        });
    }

    res.render('reservations', {
        layout: 'dashboard',
        title: isTechnician ? 'All Reservations' : 'My Reservations',
        activePage: 'reservations',
        containerClass: 'reservations-container',
        isTechnician,
        reservations
    });
});

router.get('/profile', authMiddleware, async (req, res) => {
    const upcoming = await Reservation.find({ user: req.session.user._id, status: 'upcoming' })
        .sort({ date: 1 })
        .lean();
    res.render('profile', { layout: 'dashboard', title: 'My Profile', activePage: 'profile', containerClass: 'profile-container', upcoming });
});

router.get('/profile/:id', authMiddleware, async (req, res) => {
    const profileUser = await User.findById(req.params.id).select('-password').lean();

    let reservations = [];
    if (profileUser) {
        // Only show future upcoming, non-anonymous reservations
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        reservations = await Reservation.find({
            user: profileUser._id,
            status: 'upcoming',
            isAnonymous: false,
            date: { $gte: now }
        }).sort({ date: 1 }).lean();
    }

    res.render('public-profile', {
        layout: 'dashboard',
        title: profileUser ? `${profileUser.firstName}'s Profile` : 'User Not Found',
        containerClass: 'profile-container',
        profileUser,
        reservations
    });
});

router.get('/users', authMiddleware, async (req, res) => {
    // Exclude the currently logged-in user and all technician accounts from the list
    const currentUserId = req.session.user._id;
    const users = await User.find({ _id: { $ne: currentUserId }, accountType: { $ne: 'technician' } }).select('-password').lean();

    // Count completed reservations per user for the "Sessions" stat
    for (const u of users) {
        const count = await Reservation.countDocuments({ user: u._id, status: { $in: ['upcoming', 'completed'] } });
        u.totalSessions = count;
    }

    res.render('users', { layout: 'dashboard', title: 'Find Users', activePage: 'users', containerClass: 'users-container', users });
});

// Technician Pages (Require Technician Account)
router.get('/walkin', techMiddleware, async (req, res) => {
    const labCode = req.query.lab;

    // If no lab selected, show lab selection (cmpslots-style)
    if (!labCode) {
        const labs = await Lab.find().lean();
        const today = new Date().toISOString().split('T')[0];
        for (const lab of labs) {
            const occupiedCount = await Reservation.countDocuments({
                lab: lab.code,
                date: today,
                status: 'upcoming'
            });
            lab.occupied = occupiedCount;
            lab.available = lab.totalSeats - occupiedCount;
        }
        return res.render('walkin-labs', { layout: 'dashboard', title: 'Walk-In - Select Lab', activePage: 'walkin', containerClass: 'slots-container', labs });
    }

    const lab = await Lab.findOne({ code: labCode }).lean();
    if (!lab) {
        return res.redirect('/walkin');
    }

    // Copy time slots and disable past ones for today
    const timeSlots = TIME_SLOTS.map(ts => ({ ...ts }));
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const maxDateObj = new Date();
    maxDateObj.setDate(maxDateObj.getDate() + 7);
    const maxDate = maxDateObj.toISOString().split('T')[0];

    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
    timeSlots.forEach(ts => {
        const endTimePart = ts.value.split(' - ')[1];
        const [endH, endM] = endTimePart.split(':').map(Number);
        if (currentTotalMinutes >= endH * 60 + endM) {
            ts.disabled = true;
        }
    });

    // Build seat grid
    const seats = [];
    for (let r = 0; r < lab.rows.length; r++) {
        const rowLetter = lab.rows[r];
        for (let c = 1; c <= lab.cols; c++) {
            const seatId = `${rowLetter}${c}`;
            seats.push({ id: seatId, status: 'available', tooltip: seatId + ' - Available' });
        }
    }
    lab.available = seats.length;

    const summaryDate = new Date(today).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    res.render('walkin', {
        layout: 'dashboard',
        title: 'Walk-In Reservation',
        activePage: 'walkin',
        containerClass: 'reserve-container',
        lab,
        seats,
        timeSlots,
        today,
        maxDate,
        summaryDate
    });
});


// ==========================================
// 6. AUTH API ROUTES
// ==========================================
router.post('/api/login', authController.login);
router.post('/api/register', authController.register);
router.post('/api/logout', authController.logout);


// ==========================================
// 7. RESERVATION API ROUTES
// ==========================================
router.get('/api/reservations', authMiddleware, reservationController.getAll);
router.get('/api/reservations/:id', authMiddleware, reservationController.getById);
router.post('/api/reservations', authMiddleware, reservationController.create);
router.put('/api/reservations/:id', authMiddleware, reservationController.update);
router.put('/api/reservations/:id/cancel', authMiddleware, reservationController.cancel);
router.delete('/api/reservations/:id', authMiddleware, reservationController.delete);


// ==========================================
// 8. LAB API ROUTES
// ==========================================
router.get('/api/labs', labController.getAll);
router.get('/api/labs/:code', labController.getByCode);
router.get('/api/labs/:code/seats', labController.getSeats);


// ==========================================
// 9. USER API ROUTES
// ==========================================
router.get('/api/users', authMiddleware, userController.search);
router.get('/api/users/:id', authMiddleware, userController.getById);
router.put('/api/profile', authMiddleware, userController.updateProfile);
router.put('/api/profile/avatar', authMiddleware, userController.uploadAvatar);
router.put('/api/profile/notifications', authMiddleware, userController.updateNotifications);
router.put('/api/profile/password', authMiddleware, userController.changePassword);
router.delete('/api/profile', authMiddleware, userController.deleteAccount);


// ==========================================
// 10. WALK-IN API ROUTES (Technicians Only)
// ==========================================
router.get('/api/walkin', techMiddleware, walkinController.getAll);
router.post('/api/walkin', techMiddleware, walkinController.create);
router.put('/api/walkin/:id/remove', techMiddleware, walkinController.removeNoShow);


// 11. Export router
module.exports = router;
