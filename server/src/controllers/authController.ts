import asyncHandler from "express-async-handler";
import UserModel, { User } from "@/models/User";
import { Request, Response } from "express-serve-static-core";
import logger from "@/logger";

// @desc    Checks if a user's session cookie is valid and provides data if so.
// @route   GET /api/auth/checkSession
// @access  Public
const checkSession = asyncHandler(async (req: Request, res: Response) => {
  const session = req.session;

  // If there is a session (i.e. user exists), send user
  if (session?.user) {
    res.status(200).json(session.user);
  } else {
    res.sendStatus(204);
  }
});

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  // Check if any of the fields is missing
  if (!email || !username || !password) {
    res.status(400);
    throw new Error("Email, username, or password is missing");
  }

  // Try to find a user with the same email
  let existingUsers = await UserModel.findAll({ where: { email } });

  // If a user with the same email exists, throw error.
  if (existingUsers && existingUsers.length > 0) {
    res.status(401);
    throw new Error("Email is unavailable");
  }

  // Try to find a user with the same username
  existingUsers = await UserModel.findAll({ where: { username } });

  if (existingUsers && existingUsers.length > 0) {
    res.status(401);
    throw new Error("Username is unavailable");
  }

  // Hash the password
  const hash = await User.hashPassword(password);

  // If the password hashing fails, throw error
  if (!hash || hash === null) {
    res.status(400);
    throw new Error();
  }

  let newUser = new User({ email, username, password: hash });
  const user = await newUser.save();

  // If the new user is created successfully,
  if (user && user !== null) {
    delete user.password;

    req.session.user = user;
    // Return the user data

    logger.info(`User #${user.id} has registered`);

    res.status(201).json(user);
  } else {
    // If the new user cannot be created, throw error.
    res.status(500);
    throw new Error("Server error");
  }
});

// @desc    Log in a user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if email or password is missing, throw a bad request error if so.
  if (!email || !password) {
    res.status(400);
    throw new Error("Email or password is missing");
  }

  // Find the user by email
  let existingUsers = await UserModel.findAll({ where: { email } });

  // If user not found, throw error
  if (!existingUsers || existingUsers.length === 0) {
    res.status(400);
    throw new Error("Email or password is invalid");
  }

  // Get the first user from rows
  const user = existingUsers[0];

  // Check if user is found and verify password
  if (user && user !== null) {
    const isVerified = await User.verifyPassword(user.password, password);

    // Check if password is not verified
    if (!isVerified) {
      res.status(401);
      throw new Error("Email or password is invalid");
    }

    // Delete the password from user object
    delete user.password;

    // Store the user in session
    req.session.user = user;

    logger.info(`User #${user.id} has logged in`);

    res.status(200).json(user);
  } else {
    res.status(500);
    throw new Error("Resource not found");
  }
});

// @desc    Logout a user
// @route   POST /api/auth/logout
// @access  Public
const logout = asyncHandler(async (req: Request, res: Response) => {
  // Destroy session upon logout
  try {
    await req.session.destroy(() => {
      logger.info(`User #${req.session.user.id} has logged out`);
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500);
    throw new Error("Server error");
  }
});

export { checkSession, register, login, logout };
