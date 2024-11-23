const db = require("../database/db");

const CustomerQuery = {
  isEmailExists: db.prepare(
    `SELECT count(email) as count FROM Customer WHERE email = ?`
  ),
  activateCustomer: db.prepare(
    `UPDATE Customer
    SET isActive = 1
    WHERE id = @id`
  ),
  deleteCustomer: db.prepare(
    ` DELETE FROM Customer
     WHERE id = ?
    `
  ),
  deleteCustomerByEmail: db.prepare(
    ` DELETE FROM Customer
     WHERE email = ?
    `
  ),
  getActiveOfCustomer: db.prepare(`SELECT isActive FROM Customer WHERE id = ?`),
  getActiveOfCustomerByEmail: db.prepare(
    `SELECT isActive FROM Customer WHERE email = ?`
  ),
  getCustomerForAuth: db.prepare(`
    SELECT
        id 
        , email
        , password
        , isActive
    FROM Customer WHERE email = ?`),
  getCustomerById: db.prepare(`
    SELECT 
        id
        , email
        , name
        , address
        , telephone
    FROM Customer WHERE id = ?
  `),
  postCustomer: db.prepare(`
    INSERT INTO Customer(
    id
    , email
    , password
    , name
    , address
    , telephone
    ) VALUES (
        @id
        , @email
        , @password
        , @name
        , @address
        , @telephone
    )
  `),
  putPassword: db.prepare(
    `
      UPDATE Customer SET password = @newPassword WHERE email = @email
    `
  ),
  putCustomer: db.prepare(`
    UPDATE Customer 
    SET name = @name, address = @address, telephone = @telephone
    WHERE id = @id
  `),
};

const AuthenticationQuery = {
  postRefreshToken: db.prepare(`
    INSERT INTO Authentication(
    customer_id
    , refresh_token
    ) VALUES (
        @id,
        @refreshToken
    )
  `),
  putRefreshTokenLogin: db.prepare(`
    UPDATE Authentication SET refresh_token = @newRefreshToken WHERE customer_id = @id
  `), // put new refresh token when already logged in another device
  putRefreshToken: db.prepare(`
    UPDATE Authentication SET refresh_token = @newRefreshToken WHERE refresh_token = @refreshToken
  `),
  deleteRefreshToken: db.prepare(
    `DELETE FROM Authentication WHERE refresh_token = @refreshToken`
  ),
  isRefreshTokenExists: db.prepare(
    `SELECT count(refresh_token) as count FROM Authentication WHERE refresh_token = ?`
  ),
};

const OrderQuery = {
  getOrderByCustomerId: db.prepare(`
    SELECT 
        *
    FROM LaundryOrder WHERE customer_id = ?
  `),
  postOrder: db.prepare(`
  INSERT INTO LaundryOrder(
    id
    , customer_id
    , laundry_type
    , laundry_content
    , laundry_content_other
    , gmaps_pinpoint
    , code_referral
    , note
    , pickup_date
    , delivery_date
  ) VALUES (
    @id
    , @customer_id
    , @laundry_type
    , @laundry_content
    , @laundry_content_other
    , @gmaps_pinpoint
    , @code_referral
    , @note
    , @pickup_date
    , @delivery_date
  )
  `),
};

module.exports = {
  AuthenticationQuery,
  CustomerQuery,
  OrderQuery,
};
