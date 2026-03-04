/**
 * Page Routes (Ivan)
 * GET routes that render Handlebars templates
 *
 * TODO (Ivan):
 * 1. Import express.Router(), authMiddleware, techMiddleware
 * 2. Import Lab model (to pass lab data to certain pages)
 * 3. Import Reservation model (to pass reservation data to dashboard, etc.)
 *
 * 4. Define these routes:
 *
 *    GET /
 *      - render('index', { layout: 'auth', title: 'OpenLab', activePage: 'index' })
 *
 *    GET /login
 *      - If req.session.user, redirect to '/dashboard'
 *      - render('login', { layout: 'auth', title: 'Login - OpenLab', activePage: 'login' })
 *
 *    GET /register
 *      - If req.session.user, redirect to '/dashboard'
 *      - render('register', { layout: 'auth', title: 'Register - OpenLab', activePage: 'register' })
 *
 *    GET /adminsignup
 *      - If req.session.user, redirect to '/dashboard'
 *      - render('adminsignup', { layout: 'auth', title: 'Technician Login - OpenLab', activePage: 'adminsignup' })
 *
 *    GET /changepassword  [authMiddleware]
 *      - render('changepassword', { layout: 'auth', title: 'Change Password - OpenLab', activePage: 'changepassword' })
 *
 *    GET /dashboard  [authMiddleware]
 *      - Fetch user's reservations (or all if technician) from Reservation model
 *      - Calculate stats (upcoming count, completed count, hours, streak)
 *      - render('dashboard', { layout: 'dashboard', title: 'Dashboard - OpenLab', activePage: 'dashboard',
 *               containerClass: 'dashboard-container', stats, upcoming, activities, favoriteLabs })
 *
 *    GET /cmpslots  [authMiddleware]
 *      - Fetch all labs from Lab model
 *      - For each lab, count available/occupied/reserved seats from Reservation model
 *      - render('cmpslots', { layout: 'dashboard', title: 'Computer Lab Availability - OpenLab',
 *               activePage: 'cmpslots', containerClass: 'slots-container', labs })
 *
 *    GET /reserve  [authMiddleware]
 *      - Get ?lab=CODE and optional ?edit=ID from query
 *      - Fetch lab data and seat availability
 *      - If editing, fetch the reservation
 *      - render('reserve', { layout: 'dashboard', title: 'Reserve a Seat - OpenLab',
 *               activePage: 'reserve', containerClass: 'reserve-container', lab, editReservation, ... })
 *
 *    GET /reservations  [authMiddleware]
 *      - Fetch user's reservations (or all if technician)
 *      - render('reservations', { layout: 'dashboard', title: 'My Reservations - OpenLab',
 *               activePage: 'reservations', containerClass: 'reservations-container', reservations })
 *
 *    GET /profile  [authMiddleware]
 *      - Fetch user data and reservation stats
 *      - render('profile', { layout: 'dashboard', title: 'Profile - OpenLab',
 *               activePage: 'profile', containerClass: 'profile-container', profileUser, stats })
 *
 *    GET /profile/:id  [authMiddleware]
 *      - Fetch target user by ID
 *      - render('public-profile', { layout: 'dashboard', title: 'User Profile - OpenLab',
 *               activePage: 'public-profile', containerClass: 'profile-container', profileUser })
 *
 *    GET /users  [authMiddleware]
 *      - Fetch all users (excluding passwords)
 *      - render('users', { layout: 'dashboard', title: 'Find Users - OpenLab',
 *               activePage: 'users', containerClass: 'users-container', users })
 *
 *    GET /walkin  [techMiddleware]
 *      - Fetch labs and current walk-in reservations
 *      - render('walkin', { layout: 'dashboard', title: 'Walk-In Reservation - OpenLab',
 *               activePage: 'walkin', containerClass: 'reserve-container', labs, walkinReservations })
 *
 * 5. Export router
 */

// TODO: Implement the above
