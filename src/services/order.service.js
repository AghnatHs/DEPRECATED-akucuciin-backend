const { v7: uuidV7 } = require("uuid");

const { postOrderSchema } = require("../validators/order.validator");
const validate = require("../validators/validator");
const { OrderQuery } = require("../database/query");

const OrderService = {
  post: async (req) => {
    const newOrder = validate(postOrderSchema, req.body);
    let { laundry_type, laundry_content, code_referral, note, pickup_date, delivery_date } =
      newOrder;

    const id = uuidV7();
    const customer_id = req.user.id;
    pickup_date = new Date().toISOString();
    delivery_date = new Date(delivery_date).toISOString();
    console.log(pickup_date);
    console.log(delivery_date);
    OrderQuery.postOrder.run({
      id,
      customer_id,
      laundry_type,
      laundry_content,
      code_referral,
      note,
      pickup_date,
      delivery_date,
    });

    return {
      id,
      customer_id,
      laundry_type,
      code_referral,
      note,
      pickup_date,
      delivery_date,
    };
  },
};

module.exports = OrderService;
