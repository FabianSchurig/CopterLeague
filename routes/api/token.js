const jwt = require('jsonwebtoken');
const bluebird = require('bluebird');
const signAsync = bluebird.promisify(jwt.sign);
const verifyAsync = bluebird.promisify(jwt.verify);
const config = require('../../config');
const uuid = require('node-uuid');
const ms = require('ms');

module.exports = {generate, check, login};

/**
 * Generate an Authorization Token of a User ID.
 * Returns a Promise with the token.
 *
 * id: User ID
 * permanent: if true the expiration date will be delayed
 */
function generate(id, permanent, xssToken) {
    return signAsync({id, xss: xssToken}, config.sessionSecret, {
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
function check(token, xssToken) {
    return verifyAsync(token, config.sessionSecret, {
        algorithms: ['HS256']
    }).then(function(decoded) {
        if(decoded.xss !== xssToken) {
            return bluebird.reject('Wrong XSS Token');
        }
        return bluebird.resolve(decoded.id);
    });
}

function login(userId, res) {
    const xssToken = uuid.v4();
    return generate(userId, false, xssToken).then(function(token) {
        res.cookie('xss', xssToken, {signed: true, httpOnly: true, maxAge: ms('14d') });
        res.json({
            status: 'success',
            data: {token, id: userId}
        });
    });
}
