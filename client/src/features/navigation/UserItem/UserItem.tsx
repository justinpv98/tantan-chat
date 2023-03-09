import React from "react";

// Types
import { UserData } from "@/hooks/useSearchUsers/useSearchUsers";

// Components
import { Avatar, Box, Flex, Text } from "@/features/ui";

type Props = {
  onClick?: () => any;
  user: UserData;
};

export default function UserItem({ user, onClick }: Props) {
  return (
    <Flex
      align="center"
      onClick={onClick}
      css={{
        borderRadius: "$050",
        cursor: "pointer",
        gap: "$050",
        width: "100%",
        paddingBlock: "$050",
        paddingInline: "$050",
        "&:hover": { background: "$sage4" },
      }}
    >
      <Box>
        <Avatar size="md" />
      </Box>
      <Text>{user.username}</Text>
    </Flex>
  );
}
