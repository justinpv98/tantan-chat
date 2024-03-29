import { Navigate } from "react-router-dom";

import { PrivateRoute, RestrictedRoute } from "@/features/navigation";

/* Elements */
import { SocketProvider } from "@/features/socket/socket.context";
import { LayoutProvider } from "@/features/ui/Layout/layout.context";
import { Friends, Home, Login, Notifications, Register } from "@/pages";
import { Layout } from "@/features/ui";
import { IconProps } from "@/features/ui/Icon/Icon";

const routes = [
  {
    path: "/",
    element: (
      <SocketProvider>
        <LayoutProvider>
          <PrivateRoute redirectPath="/login">
            <Layout />
          </PrivateRoute>
        </LayoutProvider>
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
      {
        path: "notifications",
        element: <Notifications />,
        children: [{ path: "c/:id", element: <Notifications /> }],
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
    label: "Home",
  },
  {
    path: "/friends",
    icon: "users",
    label: "Friends",
  },
  {
    path: "/notifications",
    icon: "bell",
    label: "Notifications",
  },
];

export type NavRoutes = {
  icon: IconProps["icon"];
  label: string;
  path: string;
};

export default routes;
