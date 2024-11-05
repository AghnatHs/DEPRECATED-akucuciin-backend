const Joi = require("joi");

const postAuthenticationSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const putAuthenticationSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

const deleteAuthenticationSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

module.exports = {
  postAuthenticationSchema,
  putAuthenticationSchema,
  deleteAuthenticationSchema,
};
