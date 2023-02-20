import { Fragment } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { withAuth } from "@/features/auth";

type Props = {
  isAuth: boolean;
  redirectPath: string;
  children: React.ReactNode;
};

function PrivateRoute({ isAuth, redirectPath = "/login", children }: Props) {
  // prevents unauthorized users from seeing certain pages
  const { chatId } = useParams();

  const chatParam = chatId ? `/${chatId}` : "";

  if (!isAuth) {
    return <Navigate to={redirectPath + chatParam} replace />;
  }
  return <Fragment>{children ? children : <Outlet />}</Fragment>;
}

export default withAuth(PrivateRoute);