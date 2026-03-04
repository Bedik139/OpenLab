/**
 * User Controller (Ivan)
 *
 * TODO (Ivan):
 * 1. Import User model, Reservation model
 *
 * 2. search(req, res):
 *    - Extract ?q=searchTerm&college=CCS from req.query
 *    - Build query: if q, match firstName/lastName/studentId with regex (case-insensitive)
 *    - If college, add { college: college } to filter
 *    - Exclude password field: .select('-password')
 *    - Return res.json(users);
 *
 * 3. getById(req, res):
 *    - Find user by _id, exclude password
 *    - Also fetch their upcoming reservations (non-anonymous only)
 *    - Return res.json({ user, reservations });
 *
 * 4. updateProfile(req, res):
 *    - Extract { firstName, lastName, college, bio } from req.body
 *    - Find user by req.session.user._id and update
 *    - Update session data to match
 *    - Return res.json({ success: true, user: req.session.user });
 *
 * 5. changePassword(req, res):
 *    - Extract { currentPassword, newPassword } from req.body
 *    - Find user and verify current password with user.comparePassword()
 *    - Set user.password = newPassword (pre-save hook will hash)
 *    - Save and return res.json({ success: true });
 *
 * 6. deleteAccount(req, res):
 *    - Delete user document
 *    - Delete all user's reservations
 *    - Destroy session
 *    - Return res.json({ success: true });
 *
 * 7. Export all functions
 */

// TODO: Implement the above
