/**
 * Reservation Model (Chrisander)
 *
 * TODO (Chrisander):
 * 1. Import mongoose
 * 2. Define reservationSchema with these fields:
 *    - user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
 *    - lab:       { type: String, required: true }
 *    - seat:      { type: String, required: true }
 *    - building:  { type: String, required: true }
 *    - date:      { type: Date, required: true }
 *    - timeSlot:  { type: String, required: true }
 *    - status:    { type: String, enum: ['upcoming','completed','cancelled'], default: 'upcoming' }
 *    - anonymous: { type: Boolean, default: false }
 *    - isWalkIn:  { type: Boolean, default: false }
 *    - createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
 * 3. Add timestamps: true (createdAt serves as "bookedOn")
 * 4. Add compound index for preventing double-booking:
 *    reservationSchema.index({ lab: 1, seat: 1, date: 1, timeSlot: 1, status: 1 });
 * 5. Add index for fast user lookups:
 *    reservationSchema.index({ user: 1, status: 1 });
 * 6. Export the model: module.exports = mongoose.model('Reservation', reservationSchema);
 */

// TODO: Implement the above
