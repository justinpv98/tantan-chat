import { getMockReq, getMockRes } from "@jest-mock/express";
import isAuthenticated from "@/middleware/isAuthenticated";

const { res, next, mockClear } = getMockRes();

let req;

describe("isAuthenticated", () => {
  beforeEach(() => {
    mockClear();
    req = getMockReq({
      sessionID: 123,
      session: {
        user: {
          id: 1,
          email: "test123@gmail.com",
          username: "test123",
        },
        destroy: jest.fn()

      },
    });

    jest.clearAllMocks();
  });

  it("calls next function if user is authenticated", () => {

    isAuthenticated(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("destroys session and throws error if user is not authenticated", () => {
    req = {
      sessionID: "123",
      session: {
        destroy: jest.fn()
      },
        };

    expect(() => {
      isAuthenticated(req, res, next);
    }).toThrowError("Invalid credentials.");

    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
