import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "react-query";
import { AuthProvider } from "./features/auth/auth.context";
import { SettingsProvider } from "./features/settings/settings.context";
import { ThemeProvider } from "./features/theme/theme.context";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

import queryClient from "./config/queryClient";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <Router>
            <App />
          </Router>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
