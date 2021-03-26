/* ---------- MODULES ---------- */
const bodyParser = require('body-parser');
const chalk = require('chalk');
const compression = require('compression');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const morgan = require('morgan');
// const passport = require('passport');
const path = require('path');
const session = require('express-session');

/* ---------- CLASSES & INSTANCES ---------- */
const app = express();
// const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

/* ---------- CONSTANTS ---------- */
const DB_NAME = 'thinkcorpDB';
const DOTENV_RESULT = dotenv.config();
const MONGO_URI = process.env.MONGO_URI || `mongodb://localhost:27017/${DB_NAME}`;
const PORT = process.env.PORT || 4000;

/* ---------- FUNCTIONS ---------- */
// const passportInit = require('./auth/init');

/* ---------- INITIALIZATION ---------- */
/* ----- Dotenv ----- */
if (DOTENV_RESULT.error) {
    console.error(chalk.red(`${DOTENV_RESULT.error}`)); // Create a .env file to stop this error.
}

/* ----- Express ----- */
app.use(express.static(path.join(__dirname, 'client/build'))); // Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Middleware
app.use(bodyParser.urlencoded({extended: false})); // Parse application/x-www-form-urlencoded.
app.use(bodyParser.json()); // Parse application/json.
app.use(cors());
app.use(compression()); // Compress all responses.
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(methodOverride('_method')); // Process POST request suffixed with ?_method=DELETE or ?_method=PUT.
app.use(morgan('dev'));
/*
app.use(passport.initialize());
app.use(passport.session());
*/
app.use(session({
    name: 'qid',
    secret: process.env.SESSION_SECRET || 'dQw4w9WgXcQ', // run `node -e "console.log(crypto.randomBytes(32).toString('hex'))"` in console to generate secret.
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 2 * 365 // 2 years
    }
}));

/* ----- Mongoose ----- */
mongoose.connect(MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch((err) => console.log(err));

/* ----- Passport ----- */
/*
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function (email, password, done) {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!user.verifyPassword(password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));
passportInit();
*/

/* ---------- ROUTES ---------- */
app.use('/users', require('./routes/users'));

/* ---------- LAUNCH ---------- */
app.listen(PORT, () => {
    console.log(chalk.blue(`🚀 Server running at http://localhost:${PORT}/`));
    console.log(chalk.green('📝 Setup and details for developing this project: https://github.com/alectrify/starter-mern-stack-chakra-ui\n'));
});