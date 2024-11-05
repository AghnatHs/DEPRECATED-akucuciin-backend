const bcrypt = require("bcrypt");
const { v7: uuidV7 } = require("uuid");

const { CustomerQuery } = require("../database/query");
const { BadRequestError } = require("../errors/customError");
const {
  postCustomerSchema,
  putCustomerSchema,
} = require("../validators/customer.validator");
const validate = require("../validators/validator");

const CustomerService = {
  get: async (req) => {
    const customer = CustomerQuery.getCustomerById.get(req.id); // customer is guaranteed to be found if authenticated
    return customer;
  },
  register: async (req) => {
    const newCustomer = validate(postCustomerSchema, req);

    const isEmailExists = CustomerQuery.isEmailExists.get(
      newCustomer.email
    ).count;
    if (isEmailExists) throw new BadRequestError("Email sudah terdaftar");

    newCustomer.id = uuidV7();
    newCustomer.password = await bcrypt.hash(newCustomer.password, 10);

    CustomerQuery.postCustomer.run(newCustomer);
    const { id, email, name, address, telephone } = newCustomer;
    return { id, email, name, address, telephone, id };
  },
  put: async (req) => {
    const customerUpdated = validate(putCustomerSchema, req.body);

    const customer = CustomerQuery.getCustomerById.get(req.user.id); // customer is guaranteed to be found if authenticated

    const queryValues = {
      id: req.user.id,
      name: customerUpdated.name || customer.name,
      address: customerUpdated.address || customer.address,
      telephone: customerUpdated.telephone || customer.telephone,
    };
    CustomerQuery.putCustomer.run(queryValues);
    return "Customer data updated succesfully";
  },
};

module.exports = CustomerService;
