import React from "react";
import { renderHook } from "@testing-library/react";
import { AuthContext, AuthState } from "@/features/auth/auth.context";
import useAuth from "./useAuth";

describe("useAuth", () => {
  it("should return the value from AuthContext", () => {
    const authValue: AuthState = {
      id: "1",
      email: "test@email.com",
      username: "test",
      profile_picture: "",
      status: 1,
      message: "",
      loading: false,
      login: () => {},
      register: () => {},
      checkSession: () => {},
      logout: () => {},
      load: () => {},
      changeProfilePicture: () => {}
    };
    const wrapper = ({ children }: {children: React.ReactNode}) => (
      <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toEqual(authValue);
  });
});
