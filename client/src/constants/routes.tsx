import { Navigate } from "react-router-dom";

import { PrivateRoute, RestrictedRoute } from "@/features/navigation";

/* Elements */
import { Login, Register } from "@/pages";
import { Layout } from "@/features/ui";
import { IconProps } from "@/features/ui//Icon/Icon";

const routes = [
  {
    path: "/",
    element: <RestrictedRoute redirectPath="/app" />,
    children: [
      { path: "home", element: <Navigate to="/login" /> },
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
    path: "app",
    element: (
      <PrivateRoute redirectPath="/login">
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: ":id?",
        element: <p>test</p>,
      },
      { path: "friends/:id?", element: <p>friends</p> },
    ],
  },
];

export const navRoutes: NavRoutes[] = [
  {
    path: "/app",
    icon: "chat-bubble-oval-left",
  },
  {
    path: "/app/friends",
    icon: "users",
  },
];

export type NavRoutes = {
  path: string;
  icon: IconProps["icon"];
};

export default routes;
