/**
 * Reservation Controller (Ivan)
 *
 * TODO (Ivan):
 * 1. Import models:
 *    const Reservation = require('../models/Reservation');
 *    const Lab = require('../models/Lab');
 *
 * 2. getAll(req, res):
 *    - If technician: Reservation.find().populate('user', 'firstName lastName email studentId').sort({ date: -1 })
 *    - Else: Reservation.find({ user: req.session.user._id }).sort({ date: -1 })
 *    - Return res.json(reservations);
 *
 * 3. getById(req, res):
 *    - Find by ID, ensure user owns it (or is technician)
 *    - Return res.json(reservation);
 *
 * 4. create(req, res):
 *    - Extract { lab, seat, date, timeSlot, anonymous } from req.body
 *    - Look up lab info from Lab model to get building name
 *    - Check for double-booking: existing upcoming reservation for same lab+seat+date+timeSlot
 *    - Create new Reservation with user: req.session.user._id
 *    - Return res.json({ success: true, reservation });
 *
 * 5. update(req, res):
 *    - Find reservation by ID, ensure user owns it
 *    - Update allowed fields: seat, date, timeSlot, anonymous
 *    - Save and return updated reservation
 *
 * 6. cancel(req, res):
 *    - Find reservation by ID, ensure user owns it (or is technician)
 *    - Set status to 'cancelled'
 *    - Save and return res.json({ success: true });
 *
 * 7. delete(req, res):
 *    - Find and delete reservation (technician only, or user owns it)
 *    - Return res.json({ success: true });
 *
 * 8. Export all functions
 */

// TODO: Implement the above
