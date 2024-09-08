// Middleware function to check if user is logged in
exports.isLogging = function (req, res, next) {
    if (req.isAuthenticated()) { // Use req.isAuthenticated() provided by Passport.js
        return next();
    } else {
        res.status(401).send(' <h1 style=" center;color: red; text-align: center;margin-top:10%">Access Blocked</h1>');
    }
};
