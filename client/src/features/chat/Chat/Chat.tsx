import { useState, useRef } from "react";
import { styled } from "@/stitches.config";

// Hooks
import { useSocket } from "@/hooks";

// Components
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
    <ChatContainer>
      <ChatInfo onClickMore={onClickMore} />
      <ChatConversation
        isRefVisible={isRefVisible}
        observedRef={observedRef}
        setIsRefVisible={SetIsRefVisible}
      />
      <ChatMessageBar isRefVisible={isRefVisible} observedRef={observedRef} />
    </ChatContainer>
  );
}

export const ChatContainer = styled("main", {
  position: "fixed",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxHeight: "100vh",
  minHeight: "100vh",
  top: "0",
  zIndex: 150,

  "@lg": {
    position: "static",
  },
});
