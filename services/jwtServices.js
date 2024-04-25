const jwt = require("jsonwebtoken");
const config = require('../config/config');

exports.createJwtToken = (user, role) => {
    return jwt.sign(
            {
                user: {id:user.id, email:user.email},
                role: role
            },
            config.jwt_secret_key,
            {
                expiresIn: config.jwt_expiration_time
            }
        );
}

exports.decodeToken = (token, secret = config.jwt_secret_key) => {
    const decoded = jwt.verify(token, secret);
    return decoded
}