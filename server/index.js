
require('dotenv').config();
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const authController = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController');
const { usersOnly } = require('./middleware/authMiddleware');
const auth = require('./middleware/authMiddleware')

const PORT = 4000
const { SESSION_SECRET, CONNECTION_STRING } = process.env;

const app = express();
app.use(express.json());

// the massive invocation was below this line
massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false,
    }
}).then(db => {
    app.set('db',db);
    console.log('db connected');
});

// app.use was below this line
app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
    }))

// end points
app.post('/auth/register',authController.register)
app.post('/auth/login', authController.login)
app.get('/auth/logout', authController.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)
    
app.listen(PORT, () => console.log(`server ready on ${PORT}`));