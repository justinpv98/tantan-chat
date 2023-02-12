import { Request, Response } from "express";
import errorHandler from "../../middleware/errorHandler";

describe("errorHandler", () => {
  it("handles errors and sends them as JSON", () => {
    // Mock the request and response objects
    const req = {} as Request;
    const res = {
      statusCode: 500,
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    } as unknown as Response;
    const next = jest.fn();
    jest.mock("@/logger/index", () => ({ error: jest.fn() }));

    // Create an error to be handled
    const err = new Error("Test error");

    // Call the errorHandler with the mock objects and error
    errorHandler(err, req, res, next);

    // Verify that the response status and JSON were called with the expected arguments
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status(500).json).toHaveBeenCalledWith({
      message: "Test error",
      stack: err.stack,
    });
  });

  it("should not not include error stack in response when in production mode", () => {
    const OLD_ENV = process.env;
    jest.resetModules();
    process.env = { ...OLD_ENV };
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnValue({
        json: jest.fn(),
      }),
      statusCode: 500,
    } as unknown as Response;
    const next = jest.fn();

    // Create a test error object
    const err = new Error("Test error message");

    // Mock the process.env.NODE_ENV variable and set it to "production"
    process.env.NODE_ENV = "production";

    // Call the errorHandler function with the mock objects and error
    errorHandler(err, req, res, next);

    // Assert that the status and json methods of the response object were called with the correct arguments,
    // and that the error stack is not included in the JSON response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status(500).json).toHaveBeenCalledWith({
      message: "Test error message",
      stack: null,
    });
    process.env = OLD_ENV;
  });
});