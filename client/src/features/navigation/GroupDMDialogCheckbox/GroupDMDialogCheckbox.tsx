import React from "react";

// Types
import { User } from "@/features/friends/hooks/useGetRelationships/useGetRelationships";

// Components
import { Avatar, Checkbox, Flex, Text } from "@/features/ui";

type Props = {
  onChange: (checked: boolean | 'indeterminate', value: number) => void;
  user: User;
};

export default function GroupDMDialogCheckbox({ onChange, user }: Props) {
  return (
    <Flex justify="between" css={{ marginBlockEnd: "$100", width: "100%" }}>
      <Checkbox
        onChange={onChange}
        label={
          <Flex align="center" css={{ gap: "$050" }}>
            <Avatar size="md" src={user?.profile_picture || undefined} />{" "}
            <Text size="md" weight="medium">
              {user.username}
            </Text>
          </Flex>
        }
        value={user.id}
      />
    </Flex>
  );
}
