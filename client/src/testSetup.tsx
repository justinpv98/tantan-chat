import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

type RouterProps = {
  children: React.ReactNode | JSX.Element | JSX.Element[];
};

export const Router = ({ children }: RouterProps) => {
  <BrowserRouter>{children}</BrowserRouter>;
};