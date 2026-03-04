/**
 * User Model (Chrisander)
 *
 * TODO (Chrisander):
 * 1. Import mongoose
 * 2. Define userSchema with these fields:
 *    - firstName: { type: String, required: true, trim: true }
 *    - lastName:  { type: String, required: true, trim: true }
 *    - email:     { type: String, required: true, unique: true, lowercase: true, trim: true }
 *    - studentId: { type: String, required: true, unique: true }
 *    - college:   { type: String, required: true, enum: ['CCS','CLA','COB','COE','COS','GCOE','SOE','BAGCED'] }
 *    - accountType: { type: String, enum: ['student','technician'], default: 'student' }
 *    - password:  { type: String, required: true }
 *    - bio:       { type: String, default: '' }
 *    - avatarUrl: { type: String, default: null }
 *    - avatarClass: { type: String, default: '' }
 * 3. Add timestamps: true to schema options
 * 4. Add a pre('save') hook that hashes the password with bcrypt (saltRounds = 10)
 *    - Only hash if password field is modified: if (!this.isModified('password')) return next();
 * 5. Add an instance method: userSchema.methods.comparePassword = async function(candidatePassword) { ... }
 *    - Use bcrypt.compare(candidatePassword, this.password)
 * 6. Export the model: module.exports = mongoose.model('User', userSchema);
 */

// TODO: Implement the above
