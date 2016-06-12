const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const compression = require('compression');
const passport = require('passport');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const config = require('./config');
const instance = require('./models').instance;
const routes = require('./routes');
const jwt = require('jsonwebtoken');
const bluebird = require('bluebird');
const verifyAsync = bluebird.promisify(jwt.verify);
const BearerStrategy = require('passport-http-bearer').Strategy;
const Pilot = instance.model('Pilot');

passport.use(new BearerStrategy(function(token, done) {
    verifyAsync(token, config.sessionSecret, {
        algorithms: ['HS256']
    }).then(function(decoded) {
        return Pilot.findById(decoded.id);
    }).then(function(user) {
        done(null, user);
    }).catch(function(err) {
        done(err);
    });
}));

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

app.use(compression());
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(passport.initialize());

routes(app);

instance.sync().then(function() {
    app.listen(process.env.PORT || 8080, function() {
        console.log('Visit %s', config.origin);
    });
});
