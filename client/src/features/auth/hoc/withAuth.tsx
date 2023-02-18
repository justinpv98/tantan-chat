import React from "react";
import { useAuth } from "@/hooks";

function withAuth<P extends object>(Component: any) {
  return (props: any) => {
    const state = useAuth();

    return <Component isAuth={state?.id} {...(props as P)} />;
  };
}

export default withAuth;
