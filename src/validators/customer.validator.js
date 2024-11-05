const Joi = require("joi");

const postCustomerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(new RegExp(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,255}$/))
    .required(),
  confirm_password: Joi.ref("password"),
  name: Joi.string().min(1).max(120).required(),
  address: Joi.string().min(1).max(255).required(),
  telephone: Joi.string().pattern(new RegExp(/^\d+$/)).required(),
}).with("password", "confirm_password");

const putCustomerSchema = Joi.object({
  name: Joi.string().min(1).max(120).optional(),
  address: Joi.string().min(1).max(255).optional(),
  telephone: Joi.string().pattern(new RegExp(/^\d+$/)).optional(),
})

module.exports = {
  postCustomerSchema,
  putCustomerSchema
};
