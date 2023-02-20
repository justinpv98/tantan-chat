import { Fragment, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { globalStyles } from "./stitches.config";

// Hooks
import useAuth from "./hooks/useAuth/useAuth";

// Routing
import routes from "./constants/routes";


function App() {
  globalStyles();
  const { loading, checkSession } = useAuth();


  useEffect(() => {
    checkSession();
  }, []);

  let routesElement = useRoutes(routes)

  if(loading){
    return <p>Put real loader here...</p>
  } else {
      return (
    <Fragment>
      {routesElement}
    </Fragment>
  );
  }

}

export default App;
