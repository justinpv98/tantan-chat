import { useEffect } from "react";

import { Flex } from "@/features/ui";
import ChatConversation from "../ChatConversation/ChatConversation";
import ChatInfo from "../ChatInfo/ChatInfo";
import ChatMessageBar from "../ChatMessageBar/ChatMessageBar";

type Props = {
  id: string; //id of user that you're talking to
  onClickMore: () => void;
};

export default function Chat({ onClickMore, id }: Props) {
  useEffect(() => {}, [id]);

  return (
    <Flex
      as="main"
      direction="column"
      css={{ width: "100%", maxHeight: "100vh" }}
    >
      <ChatInfo onClickMore={onClickMore} />
      <ChatConversation />
      <ChatMessageBar />
    </Flex>
  );
}
