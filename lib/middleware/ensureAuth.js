const User = require('../models/User');

const usernameAndPasswordGrabber = authorization => {
    const [username, password] = Buffer
    .from(authorization?.split(' ')[1], 'base64')
    .toString()
    .split(':');

    return {
        username,
        password
    };
};

const ensureAuth = (req, res, next) => {
    const { username, password } = usernameAndPasswordGrabber(req.headers.authorization);

    User
     .authorized(username, password)
     .then(user => {
         req.user = user;
         next();
     })
     .catch(next);
};

module.exports = {
    usernameAndPasswordGrabber,
    ensureAuth
};