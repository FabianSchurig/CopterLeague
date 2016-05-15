const express = require('express');

module.exports = function(app) {
    const router = express.Router();
    app.use('/api', router);

    require('./me')(router);
    require('./pilot')(router);
    require('./event')(router);
};
