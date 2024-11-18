const Joi = require("joi");

const postOrderSchema = Joi.object({
    laundry_type: Joi.string().required(),
    laundry_content: Joi.array().items(Joi.string()).required(),
    laundry_content_other: Joi.string().allow(""),
    gmaps_pinpoint: Joi.string().required(),
    code_referral: Joi.string().allow(""),
    note: Joi.string().allow(""),
    pickup_date: Joi.string().required()
});

module.exports = { postOrderSchema };
