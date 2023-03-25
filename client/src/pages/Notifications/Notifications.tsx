import React from "react";
import { styled } from "@/stitches.config";


// Components
import { Button, Flex, Icon, Sidebar } from "@/features/ui";


export default function Notifications() {

  return (
    <Sidebar
      title="Notifications"
      css={{ borderLeft: "none", maxHeight: "100vh", overflow: "scroll" }}
    >
      <ItemContainer>
      </ItemContainer>
    </Sidebar>
  );
}

const ItemContainer = styled(Flex, {
  gap: "$0",
  marginTop: "$025",
  padding: "$050 $050",
});