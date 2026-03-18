/**
 * Walk-In Controller (Ivan)
 *
 * TODO (Ivan):
 * 1. Import models:
 *    const Reservation = require('../models/Reservation');
 *    const User = require('../models/User');
 *    const Lab = require('../models/Lab');
 *
 * 2. getAll(req, res):
 *    - Fetch all upcoming walk-in reservations:
 *      Reservation.find({ isWalkIn: true, status: 'upcoming' })
 *        .populate('user', 'firstName lastName studentId')
 *        .sort({ createdAt: -1 })
 *    - Return res.json(walkinReservations);
 *
 * 3. create(req, res):
 *    - Extract { studentId, lab, seat, date, timeSlot } from req.body
 *    - Look up student by studentId: User.findOne({ studentId })
 *      If not found, return 404 (or create a temp record—your call)
 *    - Look up lab from Lab model to get building name
 *    - Create reservation with isWalkIn: true, createdBy: req.session.user._id
 *    - Return res.json({ success: true, reservation });
 *
 * 4. removeNoShow(req, res):
 *    - Find reservation by ID
 *    - Verify it's a walk-in: if (!reservation.isWalkIn) return 400
 *    - Set status to 'cancelled'
 *    - Save and return res.json({ success: true });
 *
 * 5. Export all functions
 */

// TODO: Implement the above
