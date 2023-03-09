import React from "react";
import { useParams, Outlet } from "react-router-dom";
import { styled } from "@/stitches.config";
import { navRoutes } from "@/constants/routes";

// Components
import {
  Flex,
  SideNavigation,
  SideNavigationItem,
} from "@/features/ui";

import Settings from "../Settings/Settings";

type Props = {};

export default function Navbar({}: Props) {
  const { id } = useParams();

  return (
    <Flex as="nav">
      <SideNavigation>
        <NavigationWrapper>
          {navRoutes.map((route) => {
            return (
              <SideNavigationItem
                label={route.label}
                path={
                  route.path +
                  (route.path === "/" ? "" : "/") +
                  (id ? `c/${id}` : "")
                }
                icon={route.icon}
                key={route.path}
              />
            );
          })}
          <li>
            <Settings isMobile />
          </li>
        </NavigationWrapper>
        <Settings/>
      </SideNavigation>
      <Outlet />
    </Flex>
  );
}

const NavigationWrapper = styled("ul", {
  display: "flex",
  justifyContent: "evenly",
  width: "100%",
  gap: "$050",

  "@lg": { flexDirection: "column", height: "100%" },
});
