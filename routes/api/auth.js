module.exports = function(callback) {
    return function(req, res, next) {
        if(req.user && callback(req, res)) {
            next();
        } else {
            res.status(403).end();
        }
    };
};
