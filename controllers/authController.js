/**
 * Auth Controller (Ivan)
 *
 * TODO (Ivan):
 * 1. Import User model
 *
 * 2. login(req, res):
 *    - Extract { email, password } from req.body
 *    - Find user by email: const user = await User.findOne({ email: email.toLowerCase() });
 *    - If not found, return res.status(401).json({ error: 'Invalid email or password' });
 *    - Compare password: const match = await user.comparePassword(password);
 *    - If no match, return 401
 *    - If technician-only login (req.body.techOnly) and user.accountType !== 'technician', return 403
 *    - Set session:
 *      req.session.user = {
 *        _id: user._id,
 *        firstName: user.firstName,
 *        lastName: user.lastName,
 *        email: user.email,
 *        studentId: user.studentId,
 *        college: user.college,
 *        accountType: user.accountType,
 *        bio: user.bio,
 *        avatarUrl: user.avatarUrl,
 *        avatarClass: user.avatarClass
 *      };
 *    - Return res.json({ success: true, user: req.session.user });
 *
 * 3. register(req, res):
 *    - Extract { firstName, lastName, studentId, email, college, accountType, password } from req.body
 *    - Check if email already exists
 *    - Check if studentId already exists
 *    - Create new User document
 *    - Set session (same shape as login)
 *    - Return res.json({ success: true, user: req.session.user });
 *
 * 4. logout(req, res):
 *    - req.session.destroy()
 *    - Return res.json({ success: true });
 *
 * 5. Export: module.exports = { login, register, logout };
 */

// TODO: Implement the above
