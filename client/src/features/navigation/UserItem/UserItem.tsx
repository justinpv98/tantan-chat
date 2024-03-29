import React from "react";

// Types
import { UserData } from "@/features/chat/hooks/useSearchUsers/useSearchUsers";

// Components
import { Avatar, Box, Flex, Text } from "@/features/ui";

type Props = {
  onClick?: () => any;
  user: UserData;
  status?: 1 | 2 | 3 | 4;
  showStatus?: boolean;
};

export default function UserItem({ user, onClick, showStatus }: Props) {
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
        <Avatar size="md" src={user.profile_picture || ""} />
      </Box>
      <Text weight="semibold" overflow="ellipsis">{user.username}</Text>
    </Flex>
  );
}
