require('dotenv').config();
const connectDB = require('./db/connect');
const Product = require('./models/product');

const jsonProducts = require('./products.json'); //require is a way to read json files. but it cached data

const mongoURI =
  process.env[
    process.env.NODE_ENV === 'local' ? 'MONGO_URI_LOCAL' : 'MONGO_URI_DEV'
  ];

(async () => {
  try {
    await connectDB(mongoURI);
    await Product.deleteMany();
    // await Product.create(jsonProducts);
    await Product.insertMany(jsonProducts);
    console.log('Products inserted successfully');
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
})();
