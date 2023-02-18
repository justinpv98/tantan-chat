import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import withAuth from "../auth/hoc/withAuth";

type Props = {
  isAuth: boolean;
  redirectPath: string;
  children: React.ReactNode;
};

function PrivateRoute({ isAuth, redirectPath = "/login", children }: Props) {
  // prevents unauthorized users from seeing certain pages
  if (!isAuth) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Fragment>{children ? children : <Outlet />}</Fragment>;
}

export default withAuth(PrivateRoute);