/**
 * Lab Controller (Ivan)
 *
 * TODO (Ivan):
 * 1. Import Lab model, Reservation model
 *
 * 2. getAll(req, res):
 *    - Fetch all labs from Lab model
 *    - For each lab, count upcoming reservations to determine occupied/reserved seats
 *    - Return labs with availability: { ...lab, available, occupied, reserved }
 *    - Return res.json(labs);
 *
 * 3. getByCode(req, res):
 *    - Find lab by code: Lab.findOne({ code: req.params.code })
 *    - Return res.json(lab);
 *
 * 4. getSeats(req, res):
 *    - Get lab by code
 *    - Get date and timeSlot from query params (optional filters)
 *    - Fetch all upcoming reservations for that lab (+ date + timeSlot if provided)
 *    - Build seat map: for each row+col, determine status (available/occupied/reserved)
 *      and include occupant info (name or "Anonymous") for tooltips
 *    - Return res.json({ lab, seats: [ { id: "A1", status: "available", occupant: null }, ... ] });
 *
 * 5. Export all functions
 */

// TODO: Implement the above
