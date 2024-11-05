const supertest = require("supertest");
const app = require("../app");
const db = require("../database/db");

const testPayload = {
  email: "bimic21495@anypng.com",
  password: "Aghnat123",
  confirm_password: "Aghnat123",
  name: "Aghnat",
  address: "Aghnat jalan street",
  telephone: "0831",
};

const testPayload2 = {
  email: "a@gmail.com",
  password: "Aa123123",
  confirm_password: "Aa123123",
  name: "Aa nya siapa",
  address: "Aghnat jalan street",
  telephone: "08312123445",
};

let accessToken1;
let refreshToken1;

let newAccessToken1;
let newRefreshToken1;

let server;
beforeAll(() => {
  server = app.listen(3000);
});

afterAll((done) => {
  server.close();
  done();
});

/* describe("POST /api/customer", function () {
  afterAll((done) => {
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
}); */

describe("POST /api/customer/login", function () {
  afterAll((done) => {
    done();
  });

  it("should reject login when bad request", async () => {
    const resultLogin = await supertest(app).post("/api/customer/login").send({
      email: "gakada@gmail.com",
    });
    expect(resultLogin.status).toBe(400);
    expect(resultLogin.body.success).toBe(false);
    expect(resultLogin.body.errors).toBeDefined();
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

  it("should can login a registered active user", async () => {
    const resultLogin = await supertest(app).post("/api/customer/login").send({
      email: testPayload.email,
      password: testPayload.password,
    });
    expect(resultLogin.status).toBe(200);
    expect(resultLogin.body.success).toBe(true);
    expect(resultLogin.body.data.accessToken).toBeDefined();
    expect(resultLogin.body.data.refreshToken).toBeDefined();

    accessToken1 = resultLogin.body.data.accessToken;
    refreshToken1 = resultLogin.body.data.refreshToken;
  });

  it("should reject login a registered non-active user", async () => {
    const resultLogin = await supertest(app).post("/api/customer/login").send({
      email: testPayload2.email,
      password: testPayload2.password,
    });
    expect(resultLogin.status).toBe(401);
    expect(resultLogin.body.success).toBe(false);
    expect(resultLogin.body.errors).toBe("Login gagal, silakan aktivasi akun");
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
});

describe("GET /api/customer", function () {
  afterAll((done) => {
    done();
  });

  it("should reject if sending invalid access token", async () => {
    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${accessToken1}1`);
    expect(resultGet.status).toBe(401);
    expect(resultGet.error).toBeDefined();
    expect(resultGet.error.text).toBe("Unauthorized");
  });

  it("should can get customer 1", async () => {
    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${accessToken1}`);
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.success).toBe(true);
    expect(resultGet.body.data.id).toBeDefined;
    expect(resultGet.body.data.email).toBe(testPayload.email);
    expect(resultGet.body.data.name).toBe(testPayload.name);
    expect(resultGet.body.data.address).toBe(testPayload.address);
    expect(resultGet.body.data.telephone).toBe(testPayload.telephone);
    expect(resultGet.body.data.password).toBeUndefined();
  });
});

describe("PUT /api/customer", function () {
  afterAll((done) => {
    done();
  });

  it("should reject if sending invalid access token", async () => {
    const resultPut = await supertest(app)
      .put("/api/customer")
      .set("Authorization", `Bearer ${accessToken1}1`)
      .send({
        name: "Test Baru",
      });
    expect(resultPut.status).toBe(401);
    expect(resultPut.error.text).toBe("Unauthorized");

    const resultPut2 = await supertest(app).put("/api/customer").send({
      name: "Test Baru",
    });
    expect(resultPut2.status).toBe(401);
    expect(resultPut2.error.text).toBe("Unauthorized");
  });

  it("should reject update customer data if bad request", async () => {
    const resultPut = await supertest(app)
      .put("/api/customer")
      .set("Authorization", `Bearer ${accessToken1}`)
      .send({
        name: "",
        address: "",
        telephone: "telephone",
      });
    expect(resultPut.status).toBe(400);
    expect(resultPut.body.success).toBe(false);
    expect(resultPut.body.errors).toBeDefined();

    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${accessToken1}`);
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.data.name).toBe(testPayload.name);
    expect(resultGet.body.data.email).toBe(testPayload.email);
    expect(resultGet.body.data.address).toBe(testPayload.address);
    expect(resultGet.body.data.telephone).toBe(testPayload.telephone);
  });

  it("should can update customer 1 data (partially, fully) and back it to default test value", async () => {
    const resultPut = await supertest(app)
      .put("/api/customer")
      .set("Authorization", `Bearer ${accessToken1}`)
      .send({
        name: "Test Baru",
      });
    expect(resultPut.status).toBe(200);
    expect(resultPut.body.success).toBe(true);
    expect(resultPut.body.message).toBe("Customer data updated succesfully");

    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${accessToken1}`);
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.data.name).toBe("Test Baru");
    expect(resultGet.body.data.email).toBe(testPayload.email);
    expect(resultGet.body.data.address).toBe(testPayload.address);
    expect(resultGet.body.data.telephone).toBe(testPayload.telephone);

    const resultPut2 = await supertest(app)
      .put("/api/customer")
      .set("Authorization", `Bearer ${accessToken1}`)
      .send({
        address: "Jalan Lingkar Perwira",
        telephone: "0812314567",
      });
    expect(resultPut2.status).toBe(200);
    expect(resultPut2.body.success).toBe(true);
    expect(resultPut2.body.message).toBe("Customer data updated succesfully");

    const resultGet2 = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${accessToken1}`);
    expect(resultGet2.status).toBe(200);
    expect(resultGet2.body.data.name).toBe("Test Baru");
    expect(resultGet2.body.data.email).toBe(testPayload.email);
    expect(resultGet2.body.data.address).toBe("Jalan Lingkar Perwira");
    expect(resultGet2.body.data.telephone).toBe("0812314567");

    const resultPut3 = await supertest(app)
      .put("/api/customer")
      .set("Authorization", `Bearer ${accessToken1}`)
      .send({
        name: testPayload.name,
        address: testPayload.address,
        telephone: testPayload.telephone,
      });
    expect(resultPut3.status).toBe(200);
    expect(resultPut3.body.success).toBe(true);
    expect(resultPut3.body.message).toBe("Customer data updated succesfully");

    const resultGet3 = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${accessToken1}`);
    expect(resultGet3.status).toBe(200);
    expect(resultGet3.body.data.name).toBe(testPayload.name);
    expect(resultGet3.body.data.email).toBe(testPayload.email);
    expect(resultGet3.body.data.address).toBe(testPayload.address);
    expect(resultGet3.body.data.telephone).toBe(testPayload.telephone);
  });
});

describe("PUT /api/auth", function () {
  afterAll((done) => {
    done();
  });

  it("should reject if sending invalid refresh token", async () => {
    const result = await supertest(app)
      .put("/api/auth")
      .send({ refresh_token: `${refreshToken1}1` });
    expect(result.status).toBe(401);
    expect(result.body.success).toBe(false);
    expect(result.body.errors).toBe("Invalid refresh token");
  });

  it("should reject if sending bad request", async () => {
    const result = await supertest(app)
      .put("/api/auth")
    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
    expect(result.body.errors).toBeDefined();
  });

  it("should can refresh new access token and new refresh token", async () => {
    const result = await supertest(app)
      .put("/api/auth")
      .send({ refresh_token: `${refreshToken1}` });
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.data.accessToken).toBeDefined();
    expect(result.body.data.refreshToken).toBeDefined();

    newAccessToken1 = result.body.data.accessToken;
    newRefreshToken1 = result.body.data.refreshToken;
  });

  it("should can get customer 1 using new accessToken", async () => {
    const resultGet = await supertest(app)
      .get("/api/customer")
      .set("Authorization", `Bearer ${newAccessToken1}`);
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.success).toBe(true);
    expect(resultGet.body.data.id).toBeDefined;
    expect(resultGet.body.data.email).toBe(testPayload.email);
    expect(resultGet.body.data.name).toBe(testPayload.name);
    expect(resultGet.body.data.address).toBe(testPayload.address);
    expect(resultGet.body.data.telephone).toBe(testPayload.telephone);
    expect(resultGet.body.data.password).toBeUndefined();
  });

  it("should reject if sending previous refresh token", async () => {
    const result = await supertest(app)
      .put("/api/auth")
      .send({ refresh_token: `${refreshToken1}` });
    expect(result.status).toBe(401);
    expect(result.body.success).toBe(false);
    expect(result.body.errors).toBe("Invalid refresh token");
  });
});

describe("POST /api/customer/logout", function () {
  afterAll((done) => {
    done();
  });

  it("should reject log out if sending invalid refresh token", async () => {
    const resultGet = await supertest(app)
      .post("/api/customer/logout")
      .send({ refresh_token: `${refreshToken1}1` });
    expect(resultGet.status).toBe(401);
    expect(resultGet.body.success).toBe(false);
    expect(resultGet.body.errors).toBe("Invalid refresh token");
  });

  it("should reject log out if sending previous refresh token", async () => {
    const resultGet = await supertest(app)
      .post("/api/customer/logout")
      .send({ refresh_token: `${refreshToken1}` });
    expect(resultGet.status).toBe(401);
    expect(resultGet.body.success).toBe(false);
    expect(resultGet.body.errors).toBe("Invalid refresh token");
  });

  it("should can log out if sending new refresh token", async () => {
    const resultGet = await supertest(app)
      .post("/api/customer/logout")
      .send({ refresh_token: `${newRefreshToken1}` });
    expect(resultGet.status).toBe(200);
    expect(resultGet.body.success).toBe(true);
    expect(resultGet.body.message).toBe("Successfully Log Out");
  });

  it("should reject the refresh token after logout", async () => {
    const resultGet = await supertest(app)
      .post("/api/customer/logout")
      .send({ refresh_token: `${newRefreshToken1}` });
    expect(resultGet.status).toBe(401);
    expect(resultGet.body.success).toBe(false);
    expect(resultGet.body.errors).toBe("Invalid refresh token");
  });
});
