import React from "react";
import { useParams, Outlet } from "react-router-dom";
import { styled } from "@/stitches.config";
import { navRoutes } from "@/constants/routes";

import {
  Avatar,
  Box,
  Flex,
  Popover,
  SideNavigation,
  SideNavigationItem,
} from "@/features/ui";

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
                path={route.path + (id ? `/${id}` : "")}
                icon={route.icon}
                key={route.path}
              />
            );
          })}
          <Popover
          side="top"
            css={{
              borderRadius: "$round",
              display: "block",
              width: "$275",
              height: "$275",
              backgroundColor: "$sage4",
            
              "@lg": {
                display: "none",
              },
            }}
            trigger={<Avatar />}
          />
        </NavigationWrapper>
        <Popover
        side="right"
          css={{
            display: "none",
            borderRadius: "$round",
            width: "$275",
            height: "$275",
            backgroundColor: "$sage4",

            "@lg": {
              display: "block",
            },
          }}
          trigger={<Avatar />}
        />
      </SideNavigation>
      <Outlet />
    </Flex>
  );
}

const NavigationWrapper = styled("div", {
  display: "flex",
  justifyContent: "evenly",
  width: "100%",
  gap: "$050",

  "@lg": { flexDirection: "column", height: "100%" },
});
