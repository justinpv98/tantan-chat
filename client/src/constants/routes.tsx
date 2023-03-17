import { Navigate } from "react-router-dom";

import { PrivateRoute, RestrictedRoute } from "@/features/navigation";

/* Elements */
import { SocketProvider } from "@/features/socket/socket.context";
import { Friends, Home, Login, Register } from "@/pages";
import { Layout } from "@/features/ui";
import { IconProps } from "@/features/ui/Icon/Icon";

const routes = [
  {
    path: "/",
    element: (
      <SocketProvider>
        <PrivateRoute redirectPath="/login">
          <Layout />
        </PrivateRoute>
      </SocketProvider>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
        children: [{ path: "c/:id", element: <Home /> }],
      },
      {
        path: "friends",
        element: <Friends />,
        children: [{ path: "c/:id", element: <Friends /> }],
      },
    ],
  },
  {
    path: "/",
    element: <RestrictedRoute redirectPath="/" />,
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
];

export const navRoutes: NavRoutes[] = [
  {
    path: "/",
    icon: "chat-bubble-oval-left",
    label: "Home"
  },
  {
    path: "/friends",
    icon: "users",
    label: "Friends"
  },
];

export type NavRoutes = {
  icon: IconProps["icon"];
  label: string;
  path: string;
};

export default routes;
