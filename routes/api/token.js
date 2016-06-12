const jwt = require('jsonwebtoken');
const bluebird = require('bluebird');
const signAsync = bluebird.promisify(jwt.sign);
const verifyAsync = bluebird.promisify(jwt.verify);
const config = require('../../config');

module.exports = {generate, check};

/**
 * Generate an Authorization Token of a User ID.
 * Returns a Promise with the token.
 *
 * id: User ID
 * permanent: if true the expiration date will be delayed
 */
function generate(id, permanent) {
    return signAsync({id}, config.sessionSecret, {
        algorithm: 'HS256',
        expiresIn: permanent ? '14d' : '1d'
    });
}

/**
 * Check and decode a token.
 * Returns a Promise with the User ID.
 *
 * token: Authorization Token
 */
function check(token) {
    return verifyAsync(token, config.sessionSecret, {
        algorithms: ['HS256']
    }).then(function(decoded) {
        return bluebird.resolve(decoded.id);
    });
}
