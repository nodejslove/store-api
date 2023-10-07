const Product = require('../models/product');

const getAllProductsStatic = async (req, res, next) => {
  const products = await Product.find({})
    .sort('name price')
    .select('name price')
    .skip(req.query.skip)
    .limit(10);
  res.status(200).json({ nbHits: products.length, products });
};
const getAllProducts = async (req, res, next) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
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

  //#region numericFilter
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '=': '$eq',
      '!=': '$ne',
    };
    const filterList = numericFilters.split(',');
    const options = ['price', 'rating']; //just accept numeric fields
    filterList.forEach((filter) => {
      const [field, operator, value] = filter
        .match(/(.*?)([<>=]+)(.*)/)
        .slice(1);
      if (!options.includes(field)) return;

      if (!queryObject[field]) {
        queryObject[field] = {};
      }
      const mongoOperator = operatorMap[operator];
      if (mongoOperator) {
        queryObject[field][mongoOperator] = value;
      }
    });
  }
  //#endregion numericFilter

  //#endregion filter

  let result = Product.find(queryObject);

  //#region fields
  if (fields) {
    const fieldsList = fields
      .split(',')
      .map((field) => field.trim())
      .join(' ');
    result = result.select(fieldsList);
  }
  //#endregion fields

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

  //#region pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  result = result.skip((page - 1) * limit).limit(limit);
  //#endregion pagination

  const products = await result;
  res.json({ nbHits: products.length, products });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
