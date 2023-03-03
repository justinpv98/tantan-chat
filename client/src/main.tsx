import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "react-query";
import { AuthProvider } from "./features/auth/auth.context";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";


import queryClient from "./config/queryClient";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
  <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  </>
);
