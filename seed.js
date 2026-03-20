/**
 * Database Seeder
 *
 * Run: node seed.js
 *
 * Seeds the database with sample data for the MCO spec:
 *   - 5 computer labs across 3 DLSU buildings
 *   - 10 student accounts + 3 technician accounts
 *   - 20+ reservations across multiple users with mixed statuses
 *   - Includes anonymous reservations, multi-slot bookings, and walk-ins
 *
 * Dates are generated relative to today so upcoming reservations
 * are always valid when the seed is run.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Lab = require('./src/models/Lab');
const Reservation = require('./src/models/Reservation');

// Helper: get a date string relative to today
function relativeDate(daysFromNow) {
  var d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d;
}

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    // Clear existing data
    await User.deleteMany({});
    await Lab.deleteMany({});
    await Reservation.deleteMany({});
    console.log("Existing data cleared");

    // =========================================================================
    // 1. SEED LABS (5 labs across 3 buildings)
    // =========================================================================
    await Lab.insertMany([
      { code: "AG1010", building: "Andrew Building",    buildingKey: "andrew",    totalSeats: 30, rows: ["A","B","C"],         cols: 10, hours: "7:30 AM - 6:00 PM" },
      { code: "LS313",  building: "La Salle Hall",      buildingKey: "lasalle",   totalSeats: 25, rows: ["A","B","C","D","E"], cols: 5,  hours: "8:00 AM - 7:00 PM" },
      { code: "GK101A", building: "Gokongwei Building", buildingKey: "gokongwei", totalSeats: 40, rows: ["A","B","C","D"],     cols: 10, hours: "7:00 AM - 9:00 PM" },
      { code: "GK101B", building: "Gokongwei Building", buildingKey: "gokongwei", totalSeats: 40, rows: ["A","B","C","D"],     cols: 10, hours: "7:00 AM - 9:00 PM" },
      { code: "GK304",  building: "Gokongwei Building", buildingKey: "gokongwei", totalSeats: 20, rows: ["A","B","C","D"],     cols: 5,  hours: "8:00 AM - 6:00 PM" }
    ]);
    console.log("Labs seeded (5)");

    // =========================================================================
    // 2. SEED USERS (10 students + 3 technicians = 13 users)
    // =========================================================================
    const userDocs = [
      // --- Students (password: password123) ---
      {
        firstName: "Maria Clara", lastName: "Santos",
        email: "maria_santos@dlsu.edu.ph", studentId: "12340001",
        college: "CCS", accountType: "student", password: "password123",
        avatarClass: "", bio: "CCS sophomore | Usually found at GK101A grinding CCAPDEV projects"
      },
      {
        firstName: "Jose Rizal", lastName: "Jr.",
        email: "jose_rizal@dlsu.edu.ph", studentId: "12340002",
        college: "CLA", accountType: "student", password: "password123",
        avatarClass: "orange", bio: "CLA student | History enthusiast and lab regular"
      },
      {
        firstName: "Ana Garcia", lastName: "Lopez",
        email: "ana_lopez@dlsu.edu.ph", studentId: "12340003",
        college: "GCOE", accountType: "student", password: "password123",
        avatarClass: "purple", bio: "Engineering student | Prefers the quiet hours at GK304"
      },
      {
        firstName: "Karl Reyes", lastName: "Mendoza",
        email: "karl_mendoza@dlsu.edu.ph", studentId: "12340004",
        college: "COB", accountType: "student", password: "password123",
        avatarClass: "teal", bio: "Business student | Uses labs for group projects and presentations"
      },
      {
        firstName: "Lea Domingo", lastName: "Cruz",
        email: "lea_cruz@dlsu.edu.ph", studentId: "12340005",
        college: "COS", accountType: "student", password: "password123",
        avatarClass: "red", bio: "Science major | Data analysis and research computing"
      },
      {
        firstName: "Miguel Angel", lastName: "Reyes",
        email: "miguel_reyes@dlsu.edu.ph", studentId: "12340006",
        college: "CCS", accountType: "student", password: "password123",
        avatarClass: "blue", bio: "CCS junior | Full-stack dev wannabe, always at the lab"
      },
      {
        firstName: "Sofia Isabella", lastName: "Garcia",
        email: "sofia_garcia@dlsu.edu.ph", studentId: "12340007",
        college: "COE", accountType: "student", password: "password123",
        avatarClass: "purple", bio: "Engineering student | CAD modeling requires the big monitors"
      },
      {
        firstName: "Carlos Antonio", lastName: "Tan",
        email: "carlos_tan@dlsu.edu.ph", studentId: "12340008",
        college: "CCS", accountType: "student", password: "password123",
        avatarClass: "orange", bio: "CCS freshman | Still figuring out which lab is which"
      },
      {
        firstName: "Andrea Marie", lastName: "Lim",
        email: "andrea_lim@dlsu.edu.ph", studentId: "12340009",
        college: "SOE", accountType: "student", password: "password123",
        avatarClass: "teal", bio: "Economics student | Spreadsheets and data crunching"
      },
      {
        firstName: "Rafael James", lastName: "Ong",
        email: "rafael_ong@dlsu.edu.ph", studentId: "12340010",
        college: "BAGCED", accountType: "student", password: "password123",
        avatarClass: "red", bio: "Education student | Uses labs for research papers"
      },

      // --- Technicians (password: admin123) ---
      {
        firstName: "Ivan Kenneth", lastName: "Reyes",
        email: "ivan_reyes@dlsu.edu.ph", studentId: "12310001",
        accountType: "technician", password: "admin123",
        avatarClass: "blue", bio: "Lab technician | Managing computer lab reservations and walk-in students"
      },
      {
        firstName: "John Benedict", lastName: "Santos",
        email: "benedict_santos@dlsu.edu.ph", studentId: "12310002",
        accountType: "technician", password: "admin123",
        avatarClass: "green", bio: "Lab technician | System administration and reservation management"
      },
      {
        firstName: "Chrisander Jervin", lastName: "Yu",
        email: "chrisander_yu@dlsu.edu.ph", studentId: "12310003",
        accountType: "technician", password: "admin123",
        avatarClass: "teal", bio: "Lab technician | Database management and lab operations"
      }
    ];

    // Save each user individually to trigger the pre('save') bcrypt hook
    const users = await Promise.all(
      userDocs.map(user => new User(user).save())
    );
    console.log("Users seeded (" + users.length + ")");

    // Get user references by email for convenience
    function getUserId(email) {
      return users.find(u => u.email === email)._id;
    }

    const mariaId   = getUserId("maria_santos@dlsu.edu.ph");
    const joseId    = getUserId("jose_rizal@dlsu.edu.ph");
    const anaId     = getUserId("ana_lopez@dlsu.edu.ph");
    const karlId    = getUserId("karl_mendoza@dlsu.edu.ph");
    const leaId     = getUserId("lea_cruz@dlsu.edu.ph");
    const miguelId  = getUserId("miguel_reyes@dlsu.edu.ph");
    const sofiaId   = getUserId("sofia_garcia@dlsu.edu.ph");
    const carlosId  = getUserId("carlos_tan@dlsu.edu.ph");
    const andreaId  = getUserId("andrea_lim@dlsu.edu.ph");
    const rafaelId  = getUserId("rafael_ong@dlsu.edu.ph");
    const ivanId    = getUserId("ivan_reyes@dlsu.edu.ph");
    const benedictId = getUserId("benedict_santos@dlsu.edu.ph");

    // =========================================================================
    // 3. SEED RESERVATIONS (20+ across multiple users)
    //    Uses relative dates so upcoming ones are always in the future
    // =========================================================================
    await Reservation.insertMany([

      // --- Maria Clara Santos: 5 reservations (mix of statuses) ---
      {
        user: mariaId, lab: "GK101A", seat: "B5", building: "Gokongwei Building",
        date: relativeDate(1), timeSlots: ["9:00 AM - 9:30 AM", "9:30 AM - 10:00 AM"],
        status: "upcoming", isAnonymous: false
      },
      {
        user: mariaId, lab: "LS313", seat: "A3", building: "La Salle Hall",
        date: relativeDate(3), timeSlots: ["2:00 PM - 2:30 PM"],
        status: "upcoming", isAnonymous: false
      },
      {
        user: mariaId, lab: "AG1010", seat: "C3", building: "Andrew Building",
        date: relativeDate(-5), timeSlots: ["11:00 AM - 11:30 AM"],
        status: "completed", isAnonymous: false
      },
      {
        user: mariaId, lab: "GK101A", seat: "D7", building: "Gokongwei Building",
        date: relativeDate(-10), timeSlots: ["3:00 PM - 3:30 PM", "3:30 PM - 4:00 PM"],
        status: "completed", isAnonymous: false
      },
      {
        user: mariaId, lab: "GK304", seat: "A2", building: "Gokongwei Building",
        date: relativeDate(-3), timeSlots: ["10:00 AM - 10:30 AM"],
        status: "cancelled", isAnonymous: false
      },

      // --- Jose Rizal Jr.: 3 reservations ---
      {
        user: joseId, lab: "GK101B", seat: "A1", building: "Gokongwei Building",
        date: relativeDate(2), timeSlots: ["8:00 AM - 8:30 AM", "8:30 AM - 9:00 AM", "9:00 AM - 9:30 AM"],
        status: "upcoming", isAnonymous: false
      },
      {
        user: joseId, lab: "LS313", seat: "B2", building: "La Salle Hall",
        date: relativeDate(-7), timeSlots: ["1:00 PM - 1:30 PM"],
        status: "completed", isAnonymous: false
      },
      {
        user: joseId, lab: "AG1010", seat: "A5", building: "Andrew Building",
        date: relativeDate(-2), timeSlots: ["4:00 PM - 4:30 PM"],
        status: "cancelled", isAnonymous: false
      },

      // --- Ana Garcia Lopez: 3 reservations (includes anonymous) ---
      {
        user: anaId, lab: "GK304", seat: "B3", building: "Gokongwei Building",
        date: relativeDate(1), timeSlots: ["2:00 PM - 2:30 PM", "2:30 PM - 3:00 PM"],
        status: "upcoming", isAnonymous: true
      },
      {
        user: anaId, lab: "GK101A", seat: "C8", building: "Gokongwei Building",
        date: relativeDate(-4), timeSlots: ["10:00 AM - 10:30 AM"],
        status: "completed", isAnonymous: false
      },
      {
        user: anaId, lab: "GK304", seat: "D1", building: "Gokongwei Building",
        date: relativeDate(-12), timeSlots: ["3:00 PM - 3:30 PM"],
        status: "completed", isAnonymous: true
      },

      // --- Karl Reyes Mendoza: 2 reservations ---
      {
        user: karlId, lab: "AG1010", seat: "B8", building: "Andrew Building",
        date: relativeDate(4), timeSlots: ["9:00 AM - 9:30 AM"],
        status: "upcoming", isAnonymous: false
      },
      {
        user: karlId, lab: "GK101B", seat: "C5", building: "Gokongwei Building",
        date: relativeDate(-6), timeSlots: ["11:00 AM - 11:30 AM", "11:30 AM - 12:00 PM"],
        status: "completed", isAnonymous: false
      },

      // --- Lea Domingo Cruz: 2 reservations ---
      {
        user: leaId, lab: "LS313", seat: "C4", building: "La Salle Hall",
        date: relativeDate(5), timeSlots: ["10:00 AM - 10:30 AM", "10:30 AM - 11:00 AM"],
        status: "upcoming", isAnonymous: false
      },
      {
        user: leaId, lab: "GK101A", seat: "A9", building: "Gokongwei Building",
        date: relativeDate(-8), timeSlots: ["1:00 PM - 1:30 PM"],
        status: "completed", isAnonymous: false
      },

      // --- Miguel Angel Reyes: 2 reservations ---
      {
        user: miguelId, lab: "GK101A", seat: "D3", building: "Gokongwei Building",
        date: relativeDate(2), timeSlots: ["4:00 PM - 4:30 PM", "4:30 PM - 5:00 PM"],
        status: "upcoming", isAnonymous: false
      },
      {
        user: miguelId, lab: "GK101B", seat: "B7", building: "Gokongwei Building",
        date: relativeDate(-1), timeSlots: ["8:00 AM - 8:30 AM"],
        status: "completed", isAnonymous: false
      },

      // --- Sofia Isabella Garcia: 2 reservations (one anonymous) ---
      {
        user: sofiaId, lab: "GK304", seat: "C2", building: "Gokongwei Building",
        date: relativeDate(6), timeSlots: ["1:00 PM - 1:30 PM"],
        status: "upcoming", isAnonymous: true
      },
      {
        user: sofiaId, lab: "AG1010", seat: "A10", building: "Andrew Building",
        date: relativeDate(-9), timeSlots: ["2:00 PM - 2:30 PM", "2:30 PM - 3:00 PM"],
        status: "completed", isAnonymous: false
      },

      // --- Carlos Antonio Tan: 1 reservation ---
      {
        user: carlosId, lab: "LS313", seat: "E5", building: "La Salle Hall",
        date: relativeDate(3), timeSlots: ["3:00 PM - 3:30 PM"],
        status: "upcoming", isAnonymous: false
      },

      // --- Andrea Marie Lim: 1 reservation ---
      {
        user: andreaId, lab: "GK101B", seat: "D10", building: "Gokongwei Building",
        date: relativeDate(-3), timeSlots: ["9:00 AM - 9:30 AM", "9:30 AM - 10:00 AM"],
        status: "cancelled", isAnonymous: false
      },

      // --- Walk-in reservations (created by technicians, booked under technician) ---
      {
        user: ivanId, lab: "GK101A", seat: "A2", building: "Gokongwei Building",
        date: relativeDate(1), timeSlots: ["11:00 AM - 11:30 AM"],
        status: "upcoming", isAnonymous: false, isWalkIn: true, createdBy: ivanId
      },
      {
        user: benedictId, lab: "AG1010", seat: "B1", building: "Andrew Building",
        date: relativeDate(2), timeSlots: ["8:00 AM - 8:30 AM", "8:30 AM - 9:00 AM"],
        status: "upcoming", isAnonymous: false, isWalkIn: true, createdBy: benedictId
      },
      {
        user: ivanId, lab: "LS313", seat: "A1", building: "La Salle Hall",
        date: relativeDate(-2), timeSlots: ["9:00 AM - 9:30 AM"],
        status: "completed", isAnonymous: false, isWalkIn: true, createdBy: ivanId
      }
    ]);

    console.log("Reservations seeded (25)");

    await mongoose.disconnect();
    console.log("\nDatabase seeding completed successfully!");
    console.log("----------------------------------------");
    console.log("Students:     10  (password: password123)");
    console.log("Technicians:   3  (password: admin123)");
    console.log("Labs:          5");
    console.log("Reservations: 25  (upcoming/completed/cancelled/walk-in)");
    console.log("----------------------------------------");

  } catch (error) {
    console.error("Seeding error:", error);
    await mongoose.disconnect();
  }
}

seedDatabase();
