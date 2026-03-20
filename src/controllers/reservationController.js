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

// 1. Import models
const Reservation = require('../models/Reservation');
const Lab = require('../models/Lab');
const User = require('../models/User');
const emailService = require('../helpers/emailService');

// 2. getAll(req, res)
const getAll = async (req, res) => {
    try {
        const user = req.session.user;
        let reservations;

        if (user.accountType === 'technician') {
            // Technician sees everything, populated with user info
            reservations = await Reservation.find()
                .populate('user', 'firstName lastName email studentId')
                .sort({ date: -1 });
        } else {
            // Student only sees their own reservations
            reservations = await Reservation.find({ user: user._id })
                .populate('user', 'firstName lastName email studentId')
                .sort({ date: -1 });
        }

        return res.json(reservations);
    } catch (error) {
        console.error('Error in getAll reservations:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// 3. getById(req, res)
const getById = async (req, res) => {
    try {
        const user = req.session.user;
        const reservation = await Reservation.findById(req.params.id)
            .populate('user', 'firstName lastName email studentId');

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Security check: ensure user owns it OR is a technician
        const isOwner = reservation.user._id.toString() === user._id.toString();
        const isTechnician = user.accountType === 'technician';

        if (!isOwner && !isTechnician) {
            return res.status(403).json({ error: 'Forbidden: You do not have access to this reservation' });
        }

        return res.json(reservation);
    } catch (error) {
        console.error(`Error fetching reservation ${req.params.id}:`, error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// 4. create(req, res)
// Creates a single reservation with one or more time slots
const create = async (req, res) => {
    try {
        const { lab, seat, date, timeSlot, timeSlots, anonymous } = req.body;
        const user = req.session.user;

        // Normalize to an array of slots (supports both single and multi)
        const slots = timeSlots && Array.isArray(timeSlots) && timeSlots.length > 0
            ? timeSlots
            : (timeSlot ? [timeSlot] : []);

        // Back-end validation
        if (!lab || !lab.trim()) {
            return res.status(400).json({ error: 'Lab is required.' });
        }
        if (!seat || !seat.trim()) {
            return res.status(400).json({ error: 'Seat is required.' });
        }
        if (!/^[A-Z][0-9]{1,2}$/i.test(seat)) {
            return res.status(400).json({ error: 'Seat must be in format like A1, B5, or C10.' });
        }
        if (!date) {
            return res.status(400).json({ error: 'Date is required.' });
        }
        const reserveDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (reserveDate < today) {
            return res.status(400).json({ error: 'Cannot reserve for a past date.' });
        }
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        maxDate.setHours(23, 59, 59, 999);
        if (reserveDate > maxDate) {
            return res.status(400).json({ error: 'Cannot reserve more than 7 days in advance.' });
        }
        if (slots.length === 0) {
            return res.status(400).json({ error: 'At least one time slot is required.' });
        }

        // Look up lab info to get building name
        const labInfo = await Lab.findOne({ code: lab });
        if (!labInfo) {
            return res.status(404).json({ error: 'Lab not found' });
        }

        // Check for double-booking: find any existing reservation whose timeSlots overlap
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const conflicting = await Reservation.findOne({
            lab,
            seat,
            date: { $gte: startOfDay, $lte: endOfDay },
            timeSlots: { $in: slots },
            status: 'upcoming'
        });

        if (conflicting) {
            const overlap = conflicting.timeSlots.filter(s => slots.includes(s));
            return res.status(400).json({
                error: 'Seat ' + seat + ' is already reserved for "' + overlap[0] + '". Please deselect that slot.'
            });
        }

        // Create ONE reservation with all selected time slots
        const newReservation = new Reservation({
            user: user._id,
            lab: lab,
            building: labInfo.building,
            seat,
            date,
            timeSlots: slots,
            isAnonymous: anonymous || false,
            status: 'upcoming'
        });

        await newReservation.save();

        // Send email notification
        const fullUser = await User.findById(user._id).select('firstName email notifications').lean();
        if (fullUser) {
            emailService.notifyReservationCreated(fullUser, newReservation).catch(() => {});
        }

        return res.status(201).json({ success: true, count: slots.length, reservation: newReservation });
    } catch (error) {
        console.error('Error creating reservation:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// 5. update(req, res)
const update = async (req, res) => {
    try {
        const { seat, date, timeSlot, timeSlots, anonymous } = req.body;
        const user = req.session.user;

        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Security check: owner or technician can update
        const isOwner = reservation.user.toString() === user._id.toString();
        const isTechnician = user.accountType === 'technician';
        if (!isOwner && !isTechnician) {
            return res.status(403).json({ error: 'Forbidden: You do not have permission to edit this reservation' });
        }

        // Update allowed fields
        if (seat) reservation.seat = seat;
        if (date) reservation.date = date;
        // Support both single and array
        if (timeSlots && Array.isArray(timeSlots) && timeSlots.length > 0) {
            reservation.timeSlots = timeSlots;
        } else if (timeSlot) {
            reservation.timeSlots = [timeSlot];
        }
        if (anonymous !== undefined) reservation.isAnonymous = anonymous;

        await reservation.save();

        // Send email notification
        const resOwner = await User.findById(reservation.user).select('firstName email notifications').lean();
        if (resOwner) {
            emailService.notifyReservationUpdated(resOwner, reservation).catch(() => {});
        }

        return res.json({ success: true, reservation });
    } catch (error) {
        console.error(`Error updating reservation ${req.params.id}:`, error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// 6. cancel(req, res)
const cancel = async (req, res) => {
    try {
        const user = req.session.user;
        const reservation = await Reservation.findById(req.params.id);
        
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Security check: owner or technician
        const isOwner = reservation.user.toString() === user._id.toString();
        const isTechnician = user.accountType === 'technician';

        if (!isOwner && !isTechnician) {
            return res.status(403).json({ error: 'Forbidden: You cannot cancel this reservation' });
        }

        // Set status to cancelled
        reservation.status = 'cancelled';
        await reservation.save();

        // Send email notification
        const cancelledOwner = await User.findById(reservation.user).select('firstName email notifications').lean();
        if (cancelledOwner) {
            emailService.notifyReservationCancelled(cancelledOwner, reservation).catch(() => {});
        }

        return res.json({ success: true, reservation });
    } catch (error) {
        console.error(`Error cancelling reservation ${req.params.id}:`, error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// 7. delete(req, res)
const deleteRes = async (req, res) => {
    try {
        const user = req.session.user;
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        const isOwner = reservation.user.toString() === user._id.toString();
        const isTechnician = user.accountType === 'technician';

        if (!isOwner && !isTechnician) {
            return res.status(403).json({ error: 'Forbidden: You cannot delete this reservation' });
        }

        await Reservation.findByIdAndDelete(req.params.id);
        return res.json({ success: true });
    } catch (error) {
        console.error(`Error deleting reservation ${req.params.id}:`, error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// 8. Export all functions
module.exports = { 
    getAll, 
    getById, 
    create, 
    update, 
    cancel, 
    delete: deleteRes 
};