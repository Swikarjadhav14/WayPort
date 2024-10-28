const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure session with a timeout of 1 minute
const sessionSecret = 'your-secret-key'; // Session secret
const jwtSecret = 'your_jwt_secret'; // JWT secret
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1 * 60 * 1000 // Set session timeout to 1 minute (in milliseconds)
    }
}));

// Dummy user data (can be replaced with a database)
const users = [
    { id: 1, username: 'user1', name: 'John Doe', password: 'password1' }, // Example user
    { id: 2, username: 'user2', name: 'Jane Smith', password: 'password2' } 
];

// Function to generate JWT
const generateAccessToken = (user) => {
    return jwt.sign(user, jwtSecret, { expiresIn: '1h' });
};

app.post('/verify-otp', (req, res) => {
    const { otp, id } = req.body;
    
    console.log(`Received OTP: ${otp} for ID: ${id}`);
    
    if (otp === '1234') {
        const user = users.find(u => u.id === id);
        if (user) {
            const token = generateAccessToken({ id: user.id, username: user.username });
            req.session.userId = user.id; // Save user session
            
            console.log(`Session created for User ID: ${user.id}`);
            console.log(`Session Secret: ${sessionSecret}`);
            console.log(`JWT Secret: ${jwtSecret}`); // Log JWT secret
            console.log(`Login Time: ${new Date().toISOString()}`); // Log login time
            
            // Set a timer to log session expiration after 1 minute
            setTimeout(() => {
                console.log(`Session expired for User ID: ${user.id} at ${new Date().toISOString()}`);
                req.session.destroy(); // Destroy the session
            }, 1 * 60 * 1000); // 1 minute in milliseconds
            
            return res.json({ success: true, message: 'OTP verified!', token, user });
        } else {
            console.log(`User not found for ID: ${id}`);
            return res.status(400).json({ success: false, message: 'User not found' });
        }
    } else {
        console.log(`Invalid OTP entered: ${otp}`);
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
});

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (token) {
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                console.log(`JWT verification failed: ${err.message}`);
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        console.log('No token provided');
        res.sendStatus(401);
    }
};

app.get('/user', authenticateJWT, (req, res) => {
    const userId = req.user.id; // Get user ID from JWT
    const user = users.find(u => u.id === userId);
    if (user) {
        console.log(`User data retrieved for ID: ${userId}`);
        res.json({ id: user.id, username: user.username, name: user.name });
    } else {
        console.log(`User not found for ID: ${userId}`);
        res.sendStatus(404);
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});