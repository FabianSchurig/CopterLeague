const express = require('express');

module.exports = function(app) {
    const router = express.Router();
    app.use('/api', router);

    require('./me')(router);
    require('./login')(router);
    require('./pilot')(router);
    require('./event')(router);
    require('./image')(router);
};
