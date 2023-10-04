const getAllProductsStatic = async (req, res, next) => {
  res.status(200).json({ msg: 'get all products statics' });
};
const getAllProducts = async (req, res, next) => {
  res.json({ msg: `get all product` });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
