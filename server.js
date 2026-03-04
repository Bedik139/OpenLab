/**
 * Express Server (Ivan)
 *
 * TODO (Ivan):
 * 1. Import required modules:
 *    - express, express-handlebars, express-session, connect-mongo, mongoose, dotenv, path
 * 2. Load .env: require('dotenv').config();
 * 3. Import route files:
 *    - pageRoutes   from './routes/pageRoutes'
 *    - authRoutes   from './routes/authRoutes'
 *    - reservationRoutes from './routes/reservationRoutes'
 *    - userRoutes   from './routes/userRoutes'
 *    - labRoutes    from './routes/labRoutes'
 *    - walkinRoutes from './routes/walkinRoutes'
 * 4. Import Handlebars helpers from './helpers/hbs-helpers'
 * 5. Create Express app: const app = express();
 * 6. Connect to MongoDB:
 *    mongoose.connect(process.env.MONGODB_URI)
 *      .then(() => console.log('MongoDB connected'))
 *      .catch(err => console.error('MongoDB connection error:', err));
 * 7. Configure Handlebars engine:
 *    const hbs = create({
 *      extname: '.hbs',
 *      defaultLayout: 'dashboard',
 *      layoutsDir: path.join(__dirname, 'views/layouts'),
 *      partialsDir: path.join(__dirname, 'views/partials'),
 *      helpers: require('./helpers/hbs-helpers')
 *    });
 *    app.engine('.hbs', hbs.engine);
 *    app.set('view engine', '.hbs');
 *    app.set('views', path.join(__dirname, 'views'));
 * 8. Middleware:
 *    app.use(express.json());
 *    app.use(express.urlencoded({ extended: true }));
 *    app.use(express.static(path.join(__dirname, 'public')));
 * 9. Session configuration:
 *    app.use(session({
 *      secret: process.env.SESSION_SECRET,
 *      resave: false,
 *      saveUninitialized: false,
 *      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
 *      cookie: { maxAge: 1000 * 60 * 60 * 24 }  // 24 hours
 *    }));
 * 10. Make session user available to all templates:
 *     app.use((req, res, next) => {
 *       res.locals.user = req.session.user || null;
 *       next();
 *     });
 * 11. Mount routes:
 *     app.use('/', pageRoutes);
 *     app.use('/api', authRoutes);
 *     app.use('/api', reservationRoutes);
 *     app.use('/api', userRoutes);
 *     app.use('/api', labRoutes);
 *     app.use('/api', walkinRoutes);
 * 12. 404 handler:
 *     app.use((req, res) => {
 *       res.status(404).render('error', { layout: 'dashboard', title: 'Not Found', errorCode: 404, errorMessage: 'Page not found' });
 *     });
 * 13. Start server:
 *     const PORT = process.env.PORT || 3000;
 *     app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
 */

// TODO: Implement the above
