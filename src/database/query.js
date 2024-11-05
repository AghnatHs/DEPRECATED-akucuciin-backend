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
  getActiveOfCustomer: db.prepare(`SELECT isActive FROM Customer WHERE id = ?`),
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

module.exports = {
  AuthenticationQuery,
  CustomerQuery,
};
