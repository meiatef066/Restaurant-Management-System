const authService = require("../../services/auth.service");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const { generateTokenAndSetCookie } = require("../../utils/jwt.utils");

// Mock dependencies npx jest tests/unit/auth.test.js
jest.mock("../../models/User");
jest.mock("bcrypt");
jest.mock("../../utils/jwt.utils");

describe("Auth Service", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = { cookie: jest.fn() }; //// mock response object
  });

  // ----------------- createUser -----------------
  describe("createUser", () => {
    it("should create a new user and return token", async () => {
      const userData = {
        firstName: "John",
        secondName: "Doe",
        gender: "female",
        mobileNumber: "+015513241",
        email: "john@example.com",
        password: "123456",
        passwordConfirm: "123456",
        role: "user",
      };

      User.findOne.mockResolvedValue(null); // No user exists

      // Mock new user instance with a save method
      const mockSave = jest.fn();
      const newUser = { ...userData, _id: "mockId", save: mockSave };
      User.mockImplementation(() => newUser); // New User instance

      generateTokenAndSetCookie.mockReturnValue("mocked-token");

      const result = await authService.createUser(userData, res);

      //  (matchers)
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(mockSave).toHaveBeenCalled();
      expect(generateTokenAndSetCookie).toHaveBeenCalledWith(res, newUser);

      expect(result).toEqual({
        accessToken: "mocked-token",
        newUser,
      });
    });

    it("should throw error if user already exists", async () => {
      const existingUser = { email: "john@example.com" };
      User.findOne.mockResolvedValue(existingUser);

      const foundUser = await User.findOne({ email: "john@example.com" });
      expect(foundUser).toBeTruthy(); // ✅ matcher: is it truthy?

      await expect(
        authService.createUser({ email: "john@example.com" }, res)
      ).rejects.toThrow("User already exists");
    });
  });

  // ----------------- loginUser -----------------
  describe("loginUser", () => {
    const mockUser = {
      email: "john@example.com",
      password: "hashed_password",
    };

    beforeEach(() => {
      User.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser),
      }));
    });

    it("should login user and return token", async () => {
      bcrypt.compare.mockResolvedValue(true);
      generateTokenAndSetCookie.mockReturnValue("mocked-token");

      const result = await authService.loginUser(
        { email: "john@example.com", password: "123456" },
        res
      );

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed_password");
      expect(generateTokenAndSetCookie).toHaveBeenCalledWith(res, mockUser);

      expect(result).toEqual({ token: "mocked-token" });
    });

    it("should throw error if email is missing", async () => {
      await expect(
        authService.loginUser({ email: "", password: "123456" }, res)
      ).rejects.toThrow("Please provide email and password");
    });

    it("should throw error if user not found", async () => {
      User.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null),
      }));

      await expect(
        authService.loginUser(
          { email: "unknown@example.com", password: "123456" },
          res
        )
      ).rejects.toThrow("Email does not exist");
    });

    it("should throw error if password is incorrect", async () => {
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.loginUser(
          { email: "john@example.com", password: "wrongpass" },
          res
        )
      ).rejects.toThrow("Incorrect password");
    });
  });
});

/** Unit tst
 * It tests only the logic inside authService.
 * It mocks all external dependencies (User, bcrypt, jwt).
 * It checks only one unit of code at a time (createUser, loginUser).
 */
