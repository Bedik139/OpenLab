/**
 * Database Seeder (Chrisander)
 *
 * Run: node seed.js
 *
 * TODO (Chrisander):
 * 1. Import mongoose, dotenv, and the three models (User, Lab, Reservation)
 * 2. Load .env: require('dotenv').config();
 * 3. Connect to MongoDB using process.env.MONGODB_URI
 * 4. Clear existing data: await User.deleteMany({}); await Lab.deleteMany({}); await Reservation.deleteMany({});
 * 5. Seed Labs — create these 5 labs:
 *    { code: "AG1010", building: "Andrew Building",     buildingKey: "andrew",    totalSeats: 30, rows: ["A","B","C"],         cols: 10, hours: "7:30 AM - 6:00 PM" }
 *    { code: "LS313",  building: "La Salle Hall",       buildingKey: "lasalle",   totalSeats: 25, rows: ["A","B","C","D","E"], cols: 5,  hours: "8:00 AM - 7:00 PM" }
 *    { code: "GK101A", building: "Gokongwei Building",  buildingKey: "gokongwei", totalSeats: 40, rows: ["A","B","C","D"],     cols: 10, hours: "7:00 AM - 9:00 PM" }
 *    { code: "GK101B", building: "Gokongwei Building",  buildingKey: "gokongwei", totalSeats: 40, rows: ["A","B","C","D"],     cols: 10, hours: "7:00 AM - 9:00 PM" }
 *    { code: "GK304",  building: "Gokongwei Building",  buildingKey: "gokongwei", totalSeats: 20, rows: ["A","B","C","D"],     cols: 5,  hours: "8:00 AM - 6:00 PM" }
 *
 * 6. Seed Users — create these 6 users (passwords will be hashed by User pre-save hook):
 *    { firstName: "Maria Clara", lastName: "Santos",     email: "maria_santos@dlsu.edu.ph",  studentId: "12340001", college: "CCS",  accountType: "student",    password: "password123", avatarClass: "",       bio: "CCS sophomore | Usually found at GK101A grinding CCAPDEV projects" }
 *    { firstName: "Jose Rizal",  lastName: "Jr.",        email: "jose_rizal@dlsu.edu.ph",    studentId: "12340002", college: "CLA",  accountType: "student",    password: "password123", avatarClass: "orange", bio: "CLA student | History enthusiast and lab regular" }
 *    { firstName: "Ana Garcia",  lastName: "Lopez",      email: "ana_lopez@dlsu.edu.ph",     studentId: "12340003", college: "GCOE", accountType: "student",    password: "password123", avatarClass: "purple", bio: "Engineering student | Prefers the quiet hours at GK304" }
 *    { firstName: "Karl Reyes",  lastName: "Mendoza",    email: "karl_mendoza@dlsu.edu.ph",  studentId: "12340004", college: "COB",  accountType: "student",    password: "password123", avatarClass: "teal",   bio: "Business student | Uses labs for group projects and presentations" }
 *    { firstName: "Lea Domingo", lastName: "Cruz",       email: "lea_cruz@dlsu.edu.ph",      studentId: "12340005", college: "COS",  accountType: "student",    password: "password123", avatarClass: "red",    bio: "Science major | Data analysis and research computing" }
 *    { firstName: "Admin",       lastName: "Technician", email: "tech_admin@dlsu.edu.ph",    studentId: "99999999", college: "CCS",  accountType: "technician", password: "admin123",    avatarClass: "blue",   bio: "Lab technician | Managing computer lab reservations and walk-in students" }
 *
 * 7. Seed Reservations — create 7 reservations for the first user (Maria Clara Santos):
 *    Use the user._id from the created Maria Clara document.
 *    { user: mariaId, lab: "GK101A", seat: "B5",  building: "Gokongwei Building", date: new Date("2025-02-10"), timeSlot: "09:00 AM - 09:30 AM", status: "upcoming",   anonymous: false }
 *    { user: mariaId, lab: "LS313",  seat: "A8",  building: "La Salle Hall",      date: new Date("2025-02-12"), timeSlot: "02:00 PM - 02:30 PM", status: "upcoming",   anonymous: false }
 *    { user: mariaId, lab: "AG1010", seat: "C3",  building: "Andrew Building",    date: new Date("2025-02-08"), timeSlot: "11:00 AM - 11:30 AM", status: "completed",  anonymous: false }
 *    { user: mariaId, lab: "GK101A", seat: "D7",  building: "Gokongwei Building", date: new Date("2025-02-07"), timeSlot: "03:00 PM - 03:30 PM", status: "completed",  anonymous: false }
 *    { user: mariaId, lab: "GK304",  seat: "A2",  building: "Gokongwei Building", date: new Date("2025-02-06"), timeSlot: "10:00 AM - 10:30 AM", status: "cancelled",  anonymous: false }
 *    { user: mariaId, lab: "GK101B", seat: "B3",  building: "Gokongwei Building", date: new Date("2025-02-05"), timeSlot: "01:00 PM - 01:30 PM", status: "completed",  anonymous: true  }
 *    { user: mariaId, lab: "LS313",  seat: "D1",  building: "La Salle Hall",      date: new Date("2025-02-04"), timeSlot: "09:30 AM - 10:00 AM", status: "completed",  anonymous: false }
 *
 * 8. Log success message and disconnect: await mongoose.disconnect();
 */

// TODO: Implement the above
