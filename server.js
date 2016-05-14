const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const compression = require('compression');
const session = require('express-session');
const Store = require('express-sequelize-session')(session.Store);
const passport = require('passport');
const config = require('./config');
const instance = require('./models').instance;
const initPassport = require('./misc/passport.js');
const routes = require('./routes');

initPassport();

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

app.use(compression());
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(session({
    name: 'sid',
    secret: config.sessionSecret,
    store: new Store(instance),
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

routes(app);

instance.sync().then(function() {
    app.listen(process.env.PORT || 8080, function() {
        console.log('Visit %s', config.origin);
    });
});
