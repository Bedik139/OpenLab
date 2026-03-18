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
