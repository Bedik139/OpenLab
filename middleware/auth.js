/**
 * Authentication Middleware (Ivan)
 *
 * TODO (Ivan):
 * 1. authMiddleware(req, res, next):
 *    - Check if req.session.user exists
 *    - If yes, call next()
 *    - If no, redirect to '/login' for page requests (req.accepts('html'))
 *      or return res.status(401).json({ error: 'Not authenticated' }) for API requests
 *
 * 2. techMiddleware(req, res, next):
 *    - First call authMiddleware logic (or chain it)
 *    - Then check if req.session.user.accountType === 'technician'
 *    - If yes, call next()
 *    - If no, redirect to '/dashboard' for page requests
 *      or return res.status(403).json({ error: 'Technicians only' }) for API requests
 *
 * 3. Export both: module.exports = { authMiddleware, techMiddleware };
 */

// TODO: Implement the above
