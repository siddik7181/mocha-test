import { expect, assert } from "chai";
import app from "../index";
import request from "supertest";
import sinon from "sinon";
import * as userService from "../services/User";

describe("POST /users without sinon", () => {
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

describe("GET /users without snion", () => {
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

describe("PATCH /users without snion", () => {
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

describe("DELETE /users without snion", () => {
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

describe("POST /users WITH SINON", () => {
  let createUserStub: sinon.SinonStub;
  let getUserByEmailStub: sinon.SinonStub;

  beforeEach(() => {
    createUserStub = sinon.stub(userService, "createUser");
    getUserByEmailStub = sinon.stub(userService, "getUserByEmail");
  });

  afterEach(() => {
    createUserStub.restore();
    getUserByEmailStub.restore();
  });

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

    // stub the getUserByEmail.
    getUserByEmailStub.resolves([{ email: "n@1.com" }]);

    const res = await request(app)
      .post("/users")
      .send(payload)
      .set("Accept", "application/json");

    expect(res.status).to.equal(409);
    expect(res.body.message).to.eql("email already exists");
  });

  it("Should add a new user the database and return it", async () => {
    const payload = {
      name: "n2",
      email: "n@2.com",
      role: "",
    };

    // Stubing getUserByEmail to simulate no existing user
    getUserByEmailStub.resolves([]);
    // stubing createUser to return user.
    const mockUser = {
      _id: "507f1f77bcf86cd799439012",
      name: payload.name,
      email: payload.email,
      role: payload.role || "User",
    };
    createUserStub.resolves(mockUser);

    const res = await request(app)
      .post("/users")
      .send(payload)
      .set("Accept", "application/json");

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.deep.include(mockUser);
  });
});

describe("GET /users WITH SNION", () => {
  let getUserByIdStub: sinon.SinonStub;
  const objectId = "507f1f77bcf86cd799439011";

  beforeEach(() => {
    getUserByIdStub = sinon.stub(userService, "getUserById");
  });
  afterEach(() => {
    getUserByIdStub.restore();
  });

  it("Should give 400 for invalid userId", async () => {
    const res = await request(app)
      .get(`/users/${123}`) // invalid userId
      .expect("Content-Type", /json/);

    expect(res.badRequest).to.be.true;
  });

  it("Should give 404 if user not found", async () => {
    // stub getUserById service to return null
    getUserByIdStub.resolves(null);

    const res = await request(app)
      .get(`/users/${objectId}`)
      .expect("Content-Type", /json/);

    expect(res.notFound).to.be.true;
  });

  it("Should return user with id", async () => {
    // create a mock user.
    const mockUser = {
      _id: objectId,
      name: "Stubed name",
      email: "Stubed email",
      role: "User",
    };
    // stub getUserById service to return mock user
    getUserByIdStub.resolves(mockUser);

    const res = await request(app)
      .get(`/users/${objectId}`)
      .expect("Content-Type", /json/);

    expect(res.ok).to.be.true;
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.deep.include(mockUser);
  });
});

describe("PATCH /users WITH SINON", () => {
  let updateUserStub: sinon.SinonStub;
  const objectId = "507f1f77bcf86cd799439011";

  beforeEach(() => {
    updateUserStub = sinon.stub(userService, "updateUser");
  });
  afterEach(() => {
    updateUserStub.restore();
  });

  it("Should give 400 for invalid userId", async () => {
    const res = await request(app)
      .patch(`/users/${123}`)
      .expect("Content-Type", /json/);

    expect(res.badRequest).to.be.true;
  });

  it("Should give 404 if user not found", async () => {
    // stub the updateUserStub.
    updateUserStub.resolves(null);
    const res = await request(app)
      .patch(`/users/${objectId}`)
      .expect("Content-Type", /json/);

    expect(res.notFound).to.be.true;
  });

  it("Should update & return user with id", async () => {
    const updatedPayload = { name: "update ..." };
    // create a mock user.
    const mockUser = {
      _id: objectId,
      name: "Updated Stubed name",
      email: "Stubed email",
      role: "User",
    };

    // stub getUserById service to return mock user
    updateUserStub.resolves(mockUser);

    const res = await request(app)
      .patch(`/users/${objectId}`)
      .send(updatedPayload)
      .expect("Content-Type", /json/);

    expect(res.ok).to.be.true;
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.deep.include(mockUser);
  });
});

describe("DELETE /users WITH SINON", () => {
  let deleteUserStub: sinon.SinonStub;
  const objectId = "507f1f77bcf86cd799439011";

  beforeEach(() => {
    deleteUserStub = sinon.stub(userService, "deleteUser");
  });
  afterEach(() => {
    deleteUserStub.restore();
  });

  it("Should give 400 for invalid userId", async () => {
    const res = await request(app)
      .delete(`/users/${123}`)
      .expect("Content-Type", /json/);

    expect(res.badRequest).to.be.true;
  });

  it("Should give 404 if user not found", async () => {
    // stub the updateUserStub.
    deleteUserStub.resolves(null);

    const res = await request(app)
      .delete(`/users/${objectId}`)
      .expect("Content-Type", /json/);

    expect(res.notFound).to.be.true;
  });

  it("Should delete & return user with id", async () => {
    // create a mock user.
    const mockUser = {
      _id: objectId,
      name: "Updated Stubed name",
      email: "Stubed email",
      role: "User",
    };
    // stub getUserById service to return mock user
    deleteUserStub.resolves(mockUser);

    const res = await request(app)
      .delete(`/users/${objectId}`)
      .expect("Content-Type", /json/);

    expect(res.ok).to.be.true;
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.deep.include(mockUser);
  });
});
