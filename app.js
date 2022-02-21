const
    express = require('express'),
    path = require('path'),
    config = require('config'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    cors = require("cors")

const app = express();

if ( config.get('deployment') !== 'production'){
    app.use(logger('dev'));
}
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// const indexRouter = require('./routes/index');
// app.use('/', indexRouter);

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

module.exports = app;
