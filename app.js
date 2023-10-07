require('dotenv').config();
require('express-async-errors');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const logger = require('./middleware/logger');
const productsRouter = require('./routes/products');
const connectDB = require('./db/connect');
const checkLogDirectoryExistance = require('./utils');

const express = require('express');
const app = express();

// middleware
app.use(express.json());
const mongoURI =
  process.env[
    process.env.NODE_ENV === 'local' ? 'MONGO_URI_LOCAL' : 'MONGO_URI_DEV'
  ];
app.use(logger);

// routes
app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

// products route
app.use('/api/v1/products', productsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
(async () => {
  try {
    const startTime = new Date();
    console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    const connection = await connectDB(mongoURI);
    console.log(`\thost: ${connection.connection.host}`);
    console.log(`\tDB name: ${connection.connection.name}`);
    console.log(`---> DB connected(${new Date() - startTime}ms)`);
    console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    await checkLogDirectoryExistance('./logs/logs.json');
    app.listen(port, console.log(`Server is running on port ${port}\n\n`));
  } catch (error) {
    console.log(error);
  }
})();
