const { v7: uuidV7 } = require("uuid");

const { postOrderSchema } = require("../validators/order.validator");
const validate = require("../validators/validator");
const { OrderQuery, CustomerQuery } = require("../database/query");
const GoogleAPIService = require("./google_api.service");

const OrderService = {
  post: async (req) => {
    const newOrder = validate(postOrderSchema, req.body);
    let {
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

    const addDaysAndNormalizedToISO = (isoString, days) => {
      const date = new Date(isoString);
      date.setDate(date.getDate() + days);
      date.setHours(0, 0, 0, 0);
      return date.toISOString();
    };

    let dayToAdd = 0;
    if (laundry_type === "Biasa 3 Hari") {
      dayToAdd = 3;
    } else if (laundry_type === "Express 1 Hari") {
      dayToAdd = 1;
    }
    pickup_date = addDaysAndNormalizedToISO(pickup_date, 0);
    const delivery_date = addDaysAndNormalizedToISO(pickup_date, dayToAdd);

    console.log(pickup_date);
    console.log(delivery_date);

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

    const orderToSheets = {
      id,
      customer_id,
      customer_email,
      customer_name,
      customer_address,
      customer_telephone,
      laundry_type,
      laundry_content: laundry_content.sort().join(", "),
      laundry_content_other,
      gmaps_pinpoint,
      code_referral,
      note,
      pickup_date: new Date(pickup_date).toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      delivery_date: new Date(delivery_date).toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
    };

    await GoogleAPIService.sendOrderToSheets(orderToSheets);

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
