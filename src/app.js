const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./.swagger-output.json');
const cors = require('cors')
const {errorHandler} = require("./exception/handler/errorHandler");


const usersRouter = require('./routes/users');
const productGroupsRouter = require('./routes/product-groups');
const productsRouter = require('./routes/product');
const customerGroupsRouter = require('./routes/customer-groups');
const customersRouter = require('./routes/customer');
const ordersRouter = require('./routes/order');

const app = express();

//cors
// enabling CORS for some specific origins only.
let corsOptions = {
    origin : ['http://localhost:4200'],
}

app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', indexRouter);

app.use('/users', usersRouter);
app.use('/product-groups', productGroupsRouter);
app.use('/products', productsRouter);
app.use('/customer-groups', customerGroupsRouter);
app.use('/customers', customersRouter);
app.use('/orders', ordersRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(errorHandler);

const db = require("./dto");
/**
 * In development, you may need to drop existing tables and re-sync database. Just use force: true as following code:
 */
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
//   });
db.sequelize.sync();

module.exports = app;
