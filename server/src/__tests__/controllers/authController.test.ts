import { getMockReq, getMockRes } from "@jest-mock/express";
import {
  checkSession,
  register,
  login,
  logout,
} from "@/controllers/authController";
import UserModel, { User, UserSchema } from "@/models/User";
import logger from "@/logger";

const { res, next, mockClear } = getMockRes();

let req;

jest.spyOn(User, "hashPassword").mockResolvedValue("hashedPassword");
jest.spyOn(logger, "info").mockImplementation();

/*
/* CheckSession
*/

describe("checkSession", () => {
  beforeEach(() => {
    mockClear();
    req = getMockReq({
      session: {
        user: {
          email: "test123@gmail.com",
          username: "test123",
        },
      },
    });

    jest.clearAllMocks();
  });

  it("should send a user back if there is a session", async () => {
    await checkSession(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      email: "test123@gmail.com",
      username: "test123",
    });
  });

  it("should send a No Content message if there is no user in session", async () => {
    req = getMockReq({ session: {} });
    await checkSession(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
    expect(res.json).not.toHaveBeenCalled();
  });
});

/*
/ Register
*/
describe("register", () => {
  beforeEach(() => {
    mockClear();
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    const req = getMockReq({
      body: {
        email: "test@test.com",
        username: "testuser",
        password: "password",
      },
      session: {},
    });

    const saveMock = jest.fn().mockResolvedValue({
      id: 1,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    const findAllMock = jest.fn().mockResolvedValue([]);

    jest.spyOn(User.prototype, "save").mockImplementation(saveMock);
    jest.spyOn(UserModel, "findAll").mockImplementation(findAllMock);

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      email: req.body.email,
      username: req.body.username,
    });
    expect(req.session.user).toEqual({
      id: 1,
      email: req.body.email,
      username: req.body.username,
    });
  });

  it("should throw an error if a required field is missing", async () => {
    req = getMockReq({
      body: {
        email: "test@test.com",
        username: "testuser",
      },
    });

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should throw an error if the email is unavailable", async () => {
    req = getMockReq({
      body: {
        email: "test@test.com",
        username: "testuser",
        password: "password",
      },
    });

    const findAllMock = jest
      .fn()
      .mockResolvedValue([{ email: req.body.email }]);

    jest.spyOn(UserModel, "findAll").mockImplementation(findAllMock);

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).not.toHaveBeenCalled();
    expect(findAllMock).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the username is unavailable", async () => {
    req = getMockReq({
      body: {
        email: "test@test.com",
        username: "testuser",
        password: "password",
      },
    });

    const findAllMock = jest
      .fn()
      .mockResolvedValue([{ username: req.body.username }]);

    jest.spyOn(UserModel, "findAll").mockImplementation(findAllMock);

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).not.toHaveBeenCalled();
    expect(findAllMock).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if password hashing fails", async () => {
    req = getMockReq({
      body: {
        email: "test@test.com",
        username: "testuser",
        password: "password",
      },
    });

    const findAllMock = jest.fn().mockResolvedValue([]);

    jest.spyOn(User, "hashPassword").mockResolvedValue(null);
    jest.spyOn(UserModel, "findAll").mockImplementation(findAllMock);

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).not.toHaveBeenCalled();
    expect(User.hashPassword).toHaveBeenCalledWith(req.body.password);
  });

  it("should throw an error if user cannot be created for whatever other reason", async () => {
    req = getMockReq({
      body: {
        email: "test@test.com",
        username: "testuser",
        password: "password",
      },
    });

    const findAllMock = jest.fn().mockResolvedValue([]);
    const saveMock = jest.fn().mockResolvedValue(null);

    jest.spyOn(UserModel, "findAll").mockImplementation(findAllMock);
    jest.spyOn(User, "hashPassword").mockResolvedValue("hashedPassword");
    jest.spyOn(User.prototype, "save").mockImplementation(saveMock);

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).not.toHaveBeenCalled();
    expect(saveMock).toHaveBeenCalledTimes(1);
  });
});

/*
/ Login
*/
describe("login", () => {
  beforeEach(() => {
    mockClear();
    jest.clearAllMocks();
  });

  it("should log in an existing user", async () => {
    const req = getMockReq({
      body: {
        email: "test@test.com",
        password: "password",
      },
      session: {},
    });

    const findAllMock = jest
      .fn()
      .mockResolvedValue([
        { email: "test@test.com", id: 1, username: "test123" },
      ]);

    jest.spyOn(UserModel, "findAll").mockImplementation(findAllMock);
    jest.spyOn(User, "verifyPassword").mockResolvedValue(true);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      email: req.body.email,
      username: "test123",
    });
    expect(req.session.user).toEqual({
      id: 1,
      email: req.body.email,
      username: "test123",
    });
  });

  it("should throw an error if a required field is missing", async () => {
    req = getMockReq({
      body: {
        email: "test@test.com",
      },
    });

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should throw an error if user does not exist", async () => {
    req = getMockReq({
      body: {
        email: "test@test.com",
        password: "test123",
      },
    });

    const findAllMock = jest.fn().mockResolvedValue([]);

    jest.spyOn(UserModel, "findAll").mockImplementation(findAllMock);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should throw an error if password doesn't match the hash", async () => {
    req = getMockReq({
      body: {
        email: "test@test.com",
        password: "test123",
      },
    });

    const findAllMock = jest
      .fn()
      .mockResolvedValue([
        { id: 1, email: "test@test.com", password: "test123" },
      ]);

    jest.spyOn(UserModel, "findAll").mockImplementation(findAllMock);
    jest.spyOn(User, "verifyPassword").mockResolvedValue(false);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should throw an error if user object is falsy after querying", async () => {
    req = getMockReq({
      body: {
        email: "test@test.com",
        password: "test123",
      },
    });

    const findAllMock = jest
      .fn()
      .mockResolvedValue([null]);

    jest.spyOn(UserModel, "findAll").mockImplementation(findAllMock);
    jest.spyOn(User, "verifyPassword").mockResolvedValue(true);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).not.toHaveBeenCalled();
  });

});

/*
 * Logout
 */
describe("logout", () => {
  it("should destroy the session", async () => {
    req = getMockReq({
      session: {
        user: {
          id: 1,
          username: "test",
          email: "test@test.com",
        },
        destroy: jest.fn().mockImplementation((callback) => callback()),
      },
    });

    await logout(req, res, next);

    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });

  it("should throw an error if a session doesn't exist", async () => {
    req = getMockReq({
      session: {
        destroy: jest.fn().mockImplementation((callback) => callback()),
      },
    });

    await logout(req, res, next);

    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
