const bcrypt = require("bcrypt");
const { v7: uuidV7 } = require("uuid");

const { CustomerQuery } = require("../database/query");
const {
  BadRequestError,
  AuthenticationError,
  TokenInvalidError,
} = require("../errors/customError");
const {
  postCustomerSchema,
  putCustomerSchema,
  postRequestResetPassword,
} = require("../validators/customer.validator");
const validate = require("../validators/validator");
const TokenManager = require("../tokenizer/tokenManager");
const MailerService = require("./mailer.service");

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

    const registerToken = TokenManager.generateRegisterToken(id);
    MailerService.sendVerifyEmail(email, registerToken);

    return { id, email, name, address, telephone };
  },
  verify: async (req) => {
    const { register_token } = req.params;
    const { id } = TokenManager.verifyToken(
      register_token,
      process.env.JWT_REGISTER_SECRET
    );

    const { isActive } = CustomerQuery.getActiveOfCustomer.get(id);
    if (isActive === undefined) throw new TokenInvalidError("Invalid");
    if (isActive === 1) throw new AuthenticationError("Akun sudah diaktivasi");

    CustomerQuery.activateCustomer.run({ id });

    return "Activated";
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
  requestResetPassword: async (req) => {
    const { email } = validate(postRequestResetPassword, req.body);
  },
};

module.exports = CustomerService;
