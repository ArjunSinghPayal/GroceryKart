const Joi = require("joi");

module.exports.farmSchema = Joi.object({
  name: Joi.string().required(),
  city: Joi.string().required(),
  email: Joi.string().required(),
});

module.exports.productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
});
