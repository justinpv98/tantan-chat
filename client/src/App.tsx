import { Fragment } from "react";
import { useRoutes } from "react-router-dom";

import { globalStyles } from "./stitches.config";
import routes from "./constants/routes";


function App() {
  globalStyles();
  let routesElement = useRoutes(routes)
  return (
    <Fragment>
      {routesElement}
    </Fragment>
  );
}

export default App;
