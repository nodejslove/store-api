require('dotenv').config();
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const logger = require('./middleware/logger');
const connectDB = require('./db/connect');

const express = require('express');
const app = express();

// middleware
app.use(express.json());
if (process.env.DEV || true) {
  app.use(logger);
}

//rootes
app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

// products route

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;
(async () => {
  try {
    const startTime = new Date();
    console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    await connectDB(process.env.MONGO_URI);
    console.log(`---> DB connected(${new Date() - startTime}ms)`);
    console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    app.listen(port, console.log(`Server is running on port ${port}\n\n`));
  } catch (error) {
    console.log(error);
  }
})();
