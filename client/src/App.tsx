import { Fragment, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { keyframes } from "@stitches/react";
import { globalStyles, darkTheme, styled } from "./stitches.config";
//@ts-ignore
import { ReactComponent as Logo } from "./assets/logo.svg";

// Hooks
import { useAuth, useTheme } from "./hooks";

// Routing
import routes from "./constants/routes";

function App() {
  globalStyles();
  const { theme } = useTheme();

  const { loading, checkSession } = useAuth();

  useEffect(() => {
    checkSession();
  }, []);

  let routesElement = useRoutes(routes);

  function themePreference() {
    return theme === "dark" ? darkTheme : "";
  }

  if (loading) {
    return (
      <Loader className={themePreference()}>
        <LoaderContainer>
          <Logo />
        </LoaderContainer>
      </Loader>
    );
  } else {
    return <div className={themePreference()}>{routesElement}</div>;
  }
}

export default App;

const spin = keyframes({
  from: {
    transform: "rotate(0deg)",
  },
  to: {
    transform: "rotate(359deg)",
  },
});

const Loader = styled("div", {
  background: "$background",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
});

const LoaderContainer = styled("div", {
  animation: `${spin} 1s infinite`,
  width: 80,
  height: 80,
});
