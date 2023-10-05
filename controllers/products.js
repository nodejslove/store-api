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
  const { featured, company, name, sort, fields } = req.query;
  const queryObject = {};
  //#region filter
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = new RegExp(name, 'igm');
  }
  //#endregion filter
  let result = Product.find(queryObject);
  //#region sort
  if (sort) {
    const sortList = sort
      .split(',')
      .map((sortItem) => sortItem.trim())
      .join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }
  //#endregion sort
  //#region fields
  if (fields) {
    const fieldsList = fields
      .split(',')
      .map((field) => field.trim())
      .join(' ');
    result = result.select(fieldsList);
  }
  //#endregion fields
  const products = await result;
  res.json({ nbHits: products.length, products });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
