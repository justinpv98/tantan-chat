import { describe, it, expect } from "vitest";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render } from "@testing-library/react";
import RestrictedRoute from "./RestrictedRoute";

describe("RestrictedRoute", () => {
  it("should render the children when isAuth is false", () => {
    const testMessage = "test";
    const { getByText } = render(
      <RestrictedRoute isAuth={false}>
        <p>{testMessage}</p>
      </RestrictedRoute>
    );
    expect(getByText(testMessage)).toBeInTheDocument();
  });

  it("should redirect to the redirect path when isAuth is true", () => {
    const { container } = render(
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<RestrictedRoute isAuth={true} />} />
        </Routes>
      </BrowserRouter>
    );
    expect(container.innerHTML).toBe("");
  });
});