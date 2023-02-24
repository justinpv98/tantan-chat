import { getMockReq, getMockRes } from "@jest-mock/express";
import { searchUsers } from "@/controllers/userController";
import UserModel from "@/models/User";

const { res, next, mockClear } = getMockRes();

let req;

describe("searchUsers", () => {
  beforeEach(() => {
    mockClear();
    req = getMockReq({
      query: { username: "john" },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockUserQuery = [
    {
      id: "abc123",
      username: "johnsmith",
      profile_picture: "https://example.com/profile.jpg",
      status: "online",
    },
    {
      id: "def456",
      username: "johndoe",
      profile_picture: "https://example.com/profile.png",
      status: "offline",
    },
  ];

  it("should return list of matching users", async () => {
    const findAllMock = jest.fn().mockResolvedValue(mockUserQuery);

    jest.spyOn(UserModel, "findAll").mockImplementation(findAllMock);

    await searchUsers(req, res, next);

    expect(UserModel.findAll).toHaveBeenCalledWith({
      select: ["id", "username", "profile_picture", "status"],
      where: { username: { like: "john%" } },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUserQuery);
  });

  it("should return error if no users found", async () => {
    const findAllMock = jest.fn().mockResolvedValue(null);

    jest.spyOn(UserModel, "findAll").mockImplementation(findAllMock);

    await expect(searchUsers(req, res, next)).rejects.toThrow(
      "No users found"
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
