const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication Middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if a session exists and if it contains a token
    if (req.session && req.session.accessToken) {
        const token = req.session.accessToken;

        try {
            // Verify the token
            const decoded = jwt.verify(token, "your_jwt_secret"); // Replace "your_jwt_secret" with your secret key
            req.user = decoded; // Attach the decoded user info to the request object
            next(); // Allow the request to proceed
        } catch (err) {
            // If token verification fails
            res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    } else {
        // If no token is present
        res.status(401).json({ message: "Unauthorized: No token provided" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));