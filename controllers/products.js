const Product = require('../models/product');

const getAllProductsStatic = async (req, res, next) => {
  const queryObject = {};
  const { name } = req.query;
  if (name) {
    queryObject.name = { $regex: req.query.name, $options: 'i' };
  }
  const products = await Product.find(queryObject);
  res.status(200).json({ products, nbHits: products.length });
};
const getAllProducts = async (req, res, next) => {
  const { featured, company, name } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = new RegExp(name, 'igm');
  }
  const projection = {
    name: 1,
    price: 1,
    company: 1,
    featured: 1,
    _id: -1,
  };
  const products = await Product.find(queryObject, projection);
  res.json({ nbHits: products.length, products });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
