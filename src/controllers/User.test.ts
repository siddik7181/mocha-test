import { expect, assert } from "chai";
import app from "../index";
import request from "supertest";
import sinon from "sinon";

describe("POST /users", () => {
  it("Should give 400 on invalid payload", async () => {
    const payload = {
      name: "",
      email: "",
      role: "",
    };
    const res = await request(app)
      .post("/users")
      .send(payload)
      .set("Accept", "application/json");

    expect(res.status).to.equal(400);
    expect(res.body.message).to.eql("name & email is required");
  });
  it("Should give 409 on duplicate email", async () => {
    const payload = {
      name: "n1",
      email: "n@1.com",
      role: "",
    };
    const res = await request(app)
      .post("/users")
      .send(payload)
      .set("Accept", "application/json");

    expect(res.status).to.equal(409);
    expect(res.body.message).to.eql("email already exists");
  });
  describe("Adding a user", () => {
    let createdUserId: string;
    afterEach(async () => {
      if (createdUserId) {
        // If a user was created, delete it to clean up
        const res = await request(app)
          .delete(`/users/${createdUserId}`)
          .set("Accept", "application/json");

        expect(res.status).to.equal(200);
      }
    });
    it("Should add a new user the database and return it", async () => {
      const payload = {
        name: "n2",
        email: "n@2.com",
        role: "",
      };
      const res = await request(app)
        .post("/users")
        .send(payload)
        .set("Accept", "application/json");

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("data");

      expect(res.body.data).to.have.property("_id");
      expect(res.body.data).to.have.property("name");
      expect(res.body.data).to.have.property("email");
      expect(res.body.data).to.have.property("role");

      createdUserId = res.body.data._id;
    });
  });
});

describe("GET /users", () => {
  let createdUserId: string;
  const fakeObjectId = "507f1f77bcf86cd799439011";
  beforeEach(async () => {
    const payload = {
      name: "n2",
      email: "n@2.com",
      role: "",
    };
    const res = await request(app)
      .post("/users")
      .send(payload)
      .set("Accept", "application/json");
    createdUserId = res.body.data._id;
  });
  afterEach(async () => {
    if (createdUserId) {
      // If a user was created, delete it to clean up
      const res = await request(app)
        .delete(`/users/${createdUserId}`)
        .set("Accept", "application/json");

      expect(res.status).to.equal(200);
    }
  });
  it("Should give 400 for invalid userId", async () => {
    const res = await request(app)
      .get(`/users/${123}`)
      .expect("Content-Type", /json/);
    expect(res.badRequest).to.be.true;
  });
  it("Should give 404 if user not found", async () => {
    const res = await request(app)
      .get(`/users/${fakeObjectId}`)
      .expect("Content-Type", /json/);
    expect(res.notFound).to.be.true;
  });
  it("Should return user with id", async () => {
    const res = await request(app)
      .get(`/users/${createdUserId}`)
      .expect("Content-Type", /json/);
    expect(res.ok).to.be.true;
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.have.property("_id");
    expect(res.body.data).to.have.property("name");
    expect(res.body.data).to.have.property("email");
    expect(res.body.data).to.have.property("role");
  });
});

describe("PATCH /users", () => {
  let createdUserId: string;
  const fakeObjectId = "507f1f77bcf86cd799439011";
  beforeEach(async () => {
    const payload = {
      name: "n2",
      email: "n@2.com",
      role: "",
    };
    const res = await request(app)
      .post("/users")
      .send(payload)
      .set("Accept", "application/json");
    createdUserId = res.body.data._id;
  });
  afterEach(async () => {
    if (createdUserId) {
      // If a user was created, delete it to clean up
      const res = await request(app)
        .delete(`/users/${createdUserId}`)
        .set("Accept", "application/json");

      expect(res.status).to.equal(200);
    }
  });
  it("Should give 400 for invalid userId", async () => {
    const res = await request(app)
      .patch(`/users/${123}`)
      .expect("Content-Type", /json/);
    expect(res.badRequest).to.be.true;
  });
  it("Should give 404 if user not found", async () => {
    const res = await request(app)
      .patch(`/users/${fakeObjectId}`)
      .expect("Content-Type", /json/);
    expect(res.notFound).to.be.true;
  });
  it("Should update & return user with id", async () => {
    const updatedPayload = {
      name: "updated t1",
    };
    const res = await request(app)
      .patch(`/users/${createdUserId}`)
      .send(updatedPayload)
      .expect("Content-Type", /json/);
    expect(res.ok).to.be.true;
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.have.property("_id");
    expect(res.body.data).to.have.property("name");
    expect(res.body.data).to.have.property("email");
    expect(res.body.data).to.have.property("role");
    expect(res.body.data.name).to.equal(updatedPayload.name);
  });
});

describe("DELETE /users", () => {
  let createdUserId: string;
  const fakeObjectId = "507f1f77bcf86cd799439011";
  beforeEach(async () => {
    const payload = {
      name: "n2",
      email: "n@2.com",
      role: "",
    };
    const res = await request(app)
      .post("/users")
      .send(payload)
      .set("Accept", "application/json");
    createdUserId = res.body.data._id;
  });
  afterEach(async () => {
    if (createdUserId) {
      // If a user was created, delete it to clean up
      const res = await request(app)
        .delete(`/users/${createdUserId}`)
        .set("Accept", "application/json");

      expect(res.status).to.equal(200);
    }
  });
  it("Should give 400 for invalid userId", async () => {
    const res = await request(app)
      .delete(`/users/${123}`)
      .expect("Content-Type", /json/);
    expect(res.badRequest).to.be.true;
  });
  it("Should give 404 if user not found", async () => {
    const res = await request(app)
      .delete(`/users/${fakeObjectId}`)
      .expect("Content-Type", /json/);
    expect(res.notFound).to.be.true;
  });
  it("Should delete & return user with id", async () => {
    const res = await request(app)
      .delete(`/users/${createdUserId}`)
      .expect("Content-Type", /json/);
    expect(res.ok).to.be.true;
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.have.property("_id");
    expect(res.body.data).to.have.property("name");
    expect(res.body.data).to.have.property("email");
    expect(res.body.data).to.have.property("role");
    createdUserId = "";
  });
});

