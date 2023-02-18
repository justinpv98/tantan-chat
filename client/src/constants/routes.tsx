import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import PrivateRoute from "@/features/routing/PrivateRoute";
import RestrictedRoute from "@/features/routing/RestrictedRoute";

const routes = [
  {
    path: "/",
    element: <RestrictedRoute redirectPath="/" />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/e",
    element: <PrivateRoute redirectPath="/login" />,
    children: [{ path: ":id", element: <></>, children: [] }],
  },
];

export default routes;
