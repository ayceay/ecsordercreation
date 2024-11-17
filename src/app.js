var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./.swagger-output.json');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeesRouter = require('./routes/employees');

const DatabaseSchema = require('./database/databaseSchema')
const databasePool = require('./database/databasePool');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/employees', employeesRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

var databaseSchema = new DatabaseSchema(databasePool);
databaseSchema.initialize();

module.exports = app;
