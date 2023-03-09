import { Fragment, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { globalStyles, darkTheme} from "./stitches.config";

// Hooks
import { useAuth, useTheme } from "./hooks";

// Routing
import routes from "./constants/routes";


function App() {
  globalStyles();
  const {theme} = useTheme();

  const { loading, checkSession } = useAuth();


  useEffect(() => {
    checkSession();
  }, []);

  let routesElement = useRoutes(routes)

  function themePreference(){
    return theme === 'dark' ? darkTheme : "";
  }

  if(loading){
    return <p >Put real loader here...</p>
  } else {
      return (
    <div className={themePreference()}>
      {routesElement}
    </div>
  );
  }

}

export default App;
