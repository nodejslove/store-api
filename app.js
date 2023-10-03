require('dotenv').config();
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const logger = require('./middleware/logger');
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
  const startTime = new Date();
  //connect DB

  console.log(`---> DB connected(${new Date() - startTime}ms)`);
  app.listen(port, console.log(`Server is running on port ${port}`));
})();
