import React from "react";

import { UserData } from "@/hooks/useSearchUsers.ts/useSearchUsers";
import { Avatar, Box, Flex, Link, Text } from "@/features/ui";

type Props = {
  onClick?: () => {};
  user: UserData;
};

export default function UserItem({ user, onClick }: Props) {
  return (
    <Link css={{textDecoration: 'none'}} to={`/${user.id}`}>
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
          "&:hover": { background: "$sage3" },
        }}
      >
        <Box>
          <Avatar size={300} />
        </Box>
        <Text>{user.username}</Text>
      </Flex>
    </Link>
  );
}
