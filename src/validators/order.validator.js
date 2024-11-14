const Joi = require("joi");

const postOrderSchema = Joi.object({
    laundry_type: Joi.string().required(),
    laundry_content: Joi.string().required(),
    code_referral: Joi.string().optional(),
    note: Joi.string().optional(),/* ,
    pickup_date: Joi.date().iso().required(), */
    delivery_date: Joi.date().iso().required()
});

module.exports = { postOrderSchema };
