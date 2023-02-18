import { describe, it, expect } from "vitest";
import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render } from "@testing-library/react";
import PrivateRoute from "./PrivateRoute";

describe("PrivateRoute", () => {
  it("should render the child route when the user is authorized", () => {
    const testMessage = "test";
    const { getByText } = render(
      <PrivateRoute isAuth={true}>
        <Fragment>
          <p>{testMessage}</p>
        </Fragment>
      </PrivateRoute>
    );
    expect(getByText(testMessage)).toBeInTheDocument();
  });

  it("should redirect to the redirect path when the user is not authorized", () => {
    const { container } = render(
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<PrivateRoute isAuth={false} />} />
        </Routes>
      </BrowserRouter>
    );
    expect(container.innerHTML).toBe("");
  });
});