const { v7: uuidV7 } = require("uuid");

const { postOrderSchema } = require("../validators/order.validator");
const validate = require("../validators/validator");
const { OrderQuery, CustomerQuery } = require("../database/query");
const GoogleAPIService = require("./google_api.service");

const OrderService = {
  post: async (req) => {
    const newOrder = validate(postOrderSchema, req.body);
    const {
      laundry_type,
      laundry_content,
      laundry_content_other,
      gmaps_pinpoint,
      code_referral,
      note,
      pickup_date,
    } = newOrder;

    const id = uuidV7();
    const {
      id: customer_id,
      email: customer_email,
      name: customer_name,
      address: customer_address,
      telephone: customer_telephone,
    } = CustomerQuery.getCustomerById.get(req.user.id);

    const addDaysToISO = (isoString, days) => {
      const date = new Date(isoString);
      date.setDate(date.getDate() + days);
      return date.toISOString();
    };

    let dayToAdd = 0;
    if (laundry_type === "Biasa 3 Hari") {
      dayToAdd = 3;
    } else if (laundry_type === "Express 1 Hari") {
      dayToAdd = 1;
    }
    const delivery_date = addDaysToISO(pickup_date, dayToAdd);

    OrderQuery.postOrder.run({
      id,
      customer_id,
      laundry_type,
      laundry_content: laundry_content.join(", "),
      laundry_content_other,
      gmaps_pinpoint,
      code_referral,
      note,
      pickup_date,
      delivery_date,
    });

    const order = {
      id,
      customer_id,
      customer_email,
      customer_name,
      customer_address,
      customer_telephone,
      laundry_type,
      laundry_content: laundry_content.join(", "),
      laundry_content_other,
      gmaps_pinpoint,
      code_referral,
      note,
      pickup_date,
      delivery_date,
    };

    GoogleAPIService.sendOrderToSheets(order);

    return {
      id,
      customer_id,
      customer_email,
      customer_name,
      customer_address,
      customer_telephone,
      laundry_type,
      laundry_content: laundry_content.join(", "),
      laundry_content_other,
      gmaps_pinpoint,
      code_referral,
      note,
      pickup_date,
      delivery_date,
    };
  },
};

module.exports = OrderService;
