const supertest = require("supertest");
const app = require("../app");
const db = require("../database/db");

const testPayload = {
  email: "test@gmail.com",
  password: "Test123123",
  confirm_password: "Test123123",
  name: "Test Browny Cozy",
  address: "Street of Test",
  telephone: "0811223344",
};

const testPayload2 = {
  email: "test2@gmail.com",
  password: "Test2123123",
  confirm_password: "Test2123123",
  name: "Test2 Browny Cozy",
  address: "Street of Test2",
  telephone: "08112233442",
};

let server;
beforeAll(() => {
  server = app.listen(3000);
});

afterAll((done) => {
  server.close();
  done();
});

describe("POST /api/customer", function () {
  afterAll((done) => {
    db.prepare(`DELETE FROM Customer WHERE email =  ?`).run(testPayload.email);
    db.prepare(`DELETE FROM Customer WHERE email =  ?`).run(testPayload2.email);
    done();
  });

  it("should can register new customer 1", async () => {
    const result = await supertest(app).post("/api/customer").send(testPayload);
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe(testPayload.email);
    expect(result.body.data.name).toBe(testPayload.name);
    expect(result.body.data.address).toBe(testPayload.address);
    expect(result.body.data.telephone).toBe(testPayload.telephone);
  });

  it("should can register new customer 2", async () => {
    const result = await supertest(app)
      .post("/api/customer")
      .send(testPayload2);
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe(testPayload2.email);
    expect(result.body.data.name).toBe(testPayload2.name);
    expect(result.body.data.address).toBe(testPayload2.address);
    expect(result.body.data.telephone).toBe(testPayload2.telephone);
  });

  it("should reject customer with same email", async () => {
    const result2 = await supertest(app).post("/api/customer").send({
      email: testPayload.email,
      password: "Test123123",
      confirm_password: "Test123123",
      name: "Test Browny",
      address: "Street new",
      telephone: "0812323",
    });
    expect(result2.status).toBe(400);
    expect(result2.body.success).toBe(false);
    expect(result2.body.errors).toBe("Email sudah terdaftar");
  });

  it("should reject customer when bad request", async () => {
    const result = await supertest(app).post("/api/customer").send({
      email: "tst",
      password: "tst123",
      confirm_password: "tst",
      name: "T",
      address: "S",
      telephone: "088888",
    });
    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/customer/login", function () {
  afterAll((done) => {
    db.prepare(`DELETE FROM Customer WHERE email =  ?`).run(testPayload.email);
    db.prepare(`DELETE FROM Customer WHERE email =  ?`).run(testPayload2.email);
    done();
  });

  it("PREQUISITE -> should can register new customer", async () => {
    const result = await supertest(app).post("/api/customer").send(testPayload);
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe(testPayload.email);
    expect(result.body.data.name).toBe(testPayload.name);
    expect(result.body.data.address).toBe(testPayload.address);
    expect(result.body.data.telephone).toBe(testPayload.telephone);
  });

  it("should reject login when wrong credentials", async () => {
    const resultLogin = await supertest(app).post("/api/customer/login").send({
      email: testPayload.email,
      password: "test123",
    });
    expect(resultLogin.status).toBe(401);
    expect(resultLogin.body.success).toBe(false);
    expect(resultLogin.body.errors).toBe("Login gagal, kredensial salah");
  });

  it("should can login a registered user", async () => {
    const resultLogin = await supertest(app).post("/api/customer/login").send({
      email: testPayload.email,
      password: testPayload.password,
    });
    expect(resultLogin.status).toBe(200);
    expect(resultLogin.body.success).toBe(true);
    expect(resultLogin.body.data.accessToken).toBeDefined();
    expect(resultLogin.body.data.refreshToken).toBeDefined();
  });

  it("should reject login of unregistered customer", async () => {
    const resultLogin = await supertest(app).post("/api/customer/login").send({
      email: "gakada@gmail.com",
      password: "gak ada",
    });
    expect(resultLogin.status).toBe(401);
    expect(resultLogin.body.success).toBe(false);
    expect(resultLogin.body.errors).toBe("Login gagal, kredensial salah");
  });

  it("should reject login when bad request", async () => {
    const resultLogin = await supertest(app).post("/api/customer/login").send({
      email: "gakada@gmail.com",
    });
    expect(resultLogin.status).toBe(400);
    expect(resultLogin.body.success).toBe(false);
    expect(resultLogin.body.errors).toBeDefined();
  });
});

describe("POST /api/customer/logout", function () {
  var cust;

  afterAll((done) => {
    db.prepare(`DELETE FROM Customer WHERE email =  ?`).run(testPayload.email);
    db.prepare(`DELETE FROM Customer WHERE email =  ?`).run(testPayload2.email);
    done();
  });

  it("PREQUISITE -> should can register new customer", async () => {
    const result = await supertest(app).post("/api/customer").send(testPayload);
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe(testPayload.email);
    expect(result.body.data.name).toBe(testPayload.name);
    expect(result.body.data.address).toBe(testPayload.address);
    expect(result.body.data.telephone).toBe(testPayload.telephone);

    cust = result.body.data;
  });

  it("PREQUISITE -> should can login a registered customer", async () => {
    const resultLogin = await supertest(app).post("/api/customer/login").send({
      email: testPayload.email,
      password: testPayload.password,
    });
    expect(resultLogin.status).toBe(200);
    expect(resultLogin.body.success).toBe(true);
    expect(resultLogin.body.data.accessToken).toBeDefined();
    expect(resultLogin.body.data.refreshToken).toBeDefined();

    cust.accessToken = resultLogin.body.data.accessToken;
    cust.refreshToken = resultLogin.body.data.refreshToken;
  });

  it("should can get customer (checking auth)", async () => {
    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${cust.accessToken}`);
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.success).toBe(true);
    expect(resultGet.body.data.id).toBe(cust.id);
    expect(resultGet.body.data.email).toBe(cust.email);
    expect(resultGet.body.data.name).toBe(cust.name);
    expect(resultGet.body.data.address).toBe(cust.address);
    expect(resultGet.body.data.telephone).toBe(cust.telephone);
    expect(resultGet.body.data.password).toBeUndefined();
  });

  it("should reject log out if no refresh token provided", async () => {
    const resultGet = await supertest(app)
      .post("/api/customer/logout")
      .send({});
    expect(resultGet.status).toBe(400);
    expect(resultGet.body.success).toBe(false);
    expect(resultGet.body.errors).toBeDefined();
  });

  it("should reject log out if sending invalid access token", async () => {
    const resultGet = await supertest(app)
      .post("/api/customer/logout")
      .send({ refresh_token: `${cust.refreshToken}1` });
    expect(resultGet.status).toBe(401);
    expect(resultGet.body.success).toBe(false);
    expect(resultGet.body.errors).toBe("Invalid refresh token");
  });

  it("should can logout customer", async () => {
    const resultGet = await supertest(app)
      .post("/api/customer/logout")
      .send({ refresh_token: `${cust.refreshToken}` });
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.success).toBe(true);
    expect(resultGet.body.message).toBe("Successfully Log Out");
  });

  it("should reject the refresh token after logout", async () => {
    const resultGet = await supertest(app)
      .post("/api/customer/logout")
      .send({ refresh_token: `${cust.refreshToken}` });
    expect(resultGet.status).toBe(401);
    expect(resultGet.body.success).toBe(false);
    expect(resultGet.body.errors).toBe("Invalid refresh token");
  });
});

describe("GET /api/customer", function () {
  var cust1;
  var cust2;

  afterAll((done) => {
    db.prepare(`DELETE FROM Customer WHERE email =  ?`).run(testPayload.email);
    db.prepare(`DELETE FROM Customer WHERE email =  ?`).run(testPayload2.email);
    done();
  });

  it("PREQUISITE -> should can register new customer 1", async () => {
    const result = await supertest(app).post("/api/customer").send(testPayload);
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe(testPayload.email);
    expect(result.body.data.name).toBe(testPayload.name);
    expect(result.body.data.address).toBe(testPayload.address);
    expect(result.body.data.telephone).toBe(testPayload.telephone);

    cust1 = result.body.data;
  });
  it("PREQUISITE -> should can register new customer 2", async () => {
    const result = await supertest(app)
      .post("/api/customer")
      .send(testPayload2);
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe(testPayload2.email);
    expect(result.body.data.name).toBe(testPayload2.name);
    expect(result.body.data.address).toBe(testPayload2.address);
    expect(result.body.data.telephone).toBe(testPayload2.telephone);

    cust2 = result.body.data;
  });
  it("should can login a registered user 1 & 2", async () => {
    const resultLogin = await supertest(app).post("/api/customer/login").send({
      email: testPayload.email,
      password: testPayload.password,
    });
    expect(resultLogin.status).toBe(200);
    expect(resultLogin.body.success).toBe(true);
    expect(resultLogin.body.data.accessToken).toBeDefined();
    expect(resultLogin.body.data.refreshToken).toBeDefined();

    const resultLogin2 = await supertest(app).post("/api/customer/login").send({
      email: testPayload2.email,
      password: testPayload2.password,
    });
    expect(resultLogin2.status).toBe(200);
    expect(resultLogin2.body.success).toBe(true);
    expect(resultLogin2.body.data.accessToken).toBeDefined();
    expect(resultLogin2.body.data.refreshToken).toBeDefined();

    cust1.accessToken = resultLogin.body.data.accessToken;
    cust2.accessToken = resultLogin2.body.data.accessToken;
  });

  it("should reject if sending invalid access token", async () => {
    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${cust1.accessToken}1`);
    expect(resultGet.status).toBe(401);
    expect(resultGet.error).toBeDefined();
    expect(resultGet.error.text).toBe("Unauthorized");
  });

  it("should can get customer 1", async () => {
    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${cust1.accessToken}`);
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.success).toBe(true);
    expect(resultGet.body.data.id).toBe(cust1.id);
    expect(resultGet.body.data.email).toBe(cust1.email);
    expect(resultGet.body.data.name).toBe(cust1.name);
    expect(resultGet.body.data.address).toBe(cust1.address);
    expect(resultGet.body.data.telephone).toBe(cust1.telephone);
    expect(resultGet.body.data.password).toBeUndefined();
  });

  it("should can get customer 2", async () => {
    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${cust2.accessToken}`);
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.success).toBe(true);
    expect(resultGet.body.data.id).toBe(cust2.id);
    expect(resultGet.body.data.email).toBe(cust2.email);
    expect(resultGet.body.data.name).toBe(cust2.name);
    expect(resultGet.body.data.address).toBe(cust2.address);
    expect(resultGet.body.data.telephone).toBe(cust2.telephone);
    expect(resultGet.body.data.password).toBeUndefined();
  });
});

describe("PUT /api/customer", function () {
  var cust1;
  var oldCust1;
  var cust2;
  var oldCust2;

  afterAll((done) => {
    db.prepare(`DELETE FROM Customer WHERE email =  ?`).run(testPayload.email);
    db.prepare(`DELETE FROM Customer WHERE email =  ?`).run(testPayload2.email);
    done();
  });

  it("PREQUISITE - should can register new customer 1", async () => {
    const result = await supertest(app).post("/api/customer").send(testPayload);
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe(testPayload.email);
    expect(result.body.data.name).toBe(testPayload.name);
    expect(result.body.data.address).toBe(testPayload.address);
    expect(result.body.data.telephone).toBe(testPayload.telephone);
    oldCust1 = result.body.data;
    cust1 = oldCust1;
  });

  it("PREQUISITE - should can register new customer 2", async () => {
    const result = await supertest(app)
      .post("/api/customer")
      .send(testPayload2);
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe(testPayload2.email);
    expect(result.body.data.name).toBe(testPayload2.name);
    expect(result.body.data.address).toBe(testPayload2.address);
    expect(result.body.data.telephone).toBe(testPayload2.telephone);
    oldCust2 = result.body.data;
    cust2 = oldCust2;
  });

  it("PREQUISITE - should can login a registered customer 1", async () => {
    const resultLogin = await supertest(app).post("/api/customer/login").send({
      email: testPayload.email,
      password: testPayload.password,
    });
    expect(resultLogin.status).toBe(200);
    expect(resultLogin.body.success).toBe(true);
    expect(resultLogin.body.data.accessToken).toBeDefined();
    expect(resultLogin.body.data.refreshToken).toBeDefined();
    cust1.accessToken = resultLogin.body.data.accessToken;
  });

  it("PREQUISITE - should can login a registered customer 2", async () => {
    const resultLogin = await supertest(app).post("/api/customer/login").send({
      email: testPayload2.email,
      password: testPayload2.password,
    });
    expect(resultLogin.status).toBe(200);
    expect(resultLogin.body.success).toBe(true);
    expect(resultLogin.body.data.accessToken).toBeDefined();
    expect(resultLogin.body.data.refreshToken).toBeDefined();
    cust2.accessToken = resultLogin.body.data.accessToken;
  });

  it("PREQUISITE - should can get customer 1", async () => {
    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${cust1.accessToken}`);
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.success).toBe(true);
    expect(resultGet.body.data.id).toBe(cust1.id);
    expect(resultGet.body.data.email).toBe(cust1.email);
    expect(resultGet.body.data.name).toBe(cust1.name);
    expect(resultGet.body.data.address).toBe(cust1.address);
    expect(resultGet.body.data.telephone).toBe(cust1.telephone);
    expect(resultGet.body.data.password).toBeUndefined();
  });

  it("PREQUISITE - should can get customer 2", async () => {
    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${cust2.accessToken}`);
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.success).toBe(true);
    expect(resultGet.body.data.id).toBe(cust2.id);
    expect(resultGet.body.data.email).toBe(cust2.email);
    expect(resultGet.body.data.name).toBe(cust2.name);
    expect(resultGet.body.data.address).toBe(cust2.address);
    expect(resultGet.body.data.telephone).toBe(cust2.telephone);
    expect(resultGet.body.data.password).toBeUndefined();
  });

  it("should can update customer 1 data", async () => {
    const resultPut = await supertest(app)
      .put("/api/customer")
      .set("Authorization", `Bearer ${cust1.accessToken}`)
      .send({
        name: "Test Baru",
      });
    expect(resultPut.status).toBe(200);
    expect(resultPut.body.success).toBe(true);
    expect(resultPut.body.message).toBe("Customer data updated succesfully");
    cust1.name = "Test Baru";

    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${cust1.accessToken}`);
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.data.name).toBe("Test Baru");
    expect(resultGet.body.data.email).toBe(cust1.email);
    expect(resultGet.body.data.address).toBe(cust1.address);
    expect(resultGet.body.data.telephone).toBe(cust1.telephone);
  });

  it("should can update customer 2 data", async () => {
    const resultPut = await supertest(app)
      .put("/api/customer")
      .set("Authorization", `Bearer ${cust2.accessToken}`)
      .send({
        name: "Test Baru2",
      });
    expect(resultPut.status).toBe(200);
    expect(resultPut.body.success).toBe(true);
    expect(resultPut.body.message).toBe("Customer data updated succesfully");
    cust2.name = "Test Baru2";

    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${cust1.accessToken}`);
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.data.name).toBe("Test Baru");
    expect(resultGet.body.data.email).toBe(cust1.email);
    expect(resultGet.body.data.address).toBe(cust1.address);
    expect(resultGet.body.data.telephone).toBe(cust1.telephone);
  });
});
