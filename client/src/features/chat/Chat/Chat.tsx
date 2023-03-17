import { useState, useRef } from "react";

// Hooks
import { useSocket } from "@/hooks";

// Components
import { Flex } from "@/features/ui";
import ChatConversation from "../ChatConversation/ChatConversation";
import ChatInfo from "../ChatInfo/ChatInfo";
import ChatMessageBar from "../ChatMessageBar/ChatMessageBar";

type Props = {
  onClickMore: () => void;
};

export default function Chat({ onClickMore }: Props) {
  const socket = useSocket();
  const [isRefVisible, SetIsRefVisible] = useState(true);
  const observedRef = useRef<HTMLDivElement | null>(null);


  return (
    <Flex
      as="main"
      direction="column"
      css={{ width: "100%", maxHeight: "100vh" }}
    >
      <ChatInfo onClickMore={onClickMore} />
      <ChatConversation
        isRefVisible={isRefVisible}
        observedRef={observedRef}
        setIsRefVisible={SetIsRefVisible}
      />
      <ChatMessageBar isRefVisible={isRefVisible} observedRef={observedRef} />
    </Flex>
  );
}
