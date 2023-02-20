import {useState} from "react";

import { Flex } from "@/features/ui";
import ChatConversation from "../ChatConversation/ChatConversation";
import ChatInfo from "../ChatInfo/ChatInfo";
import ChatMessageBar from "../ChatMessageBar/ChatMessageBar";

type Props = {
  children?: React.ReactNode;
  onClickMore: () => void;
};

export default function Chat({children, onClickMore}: Props) {


  return (
    <Flex as="main" direction="column" css={{width: "100%", maxHeight: "100vh"}}>
      <ChatInfo onClickMore={onClickMore}/>
      <ChatConversation />
      <ChatMessageBar />
    </Flex>
  );
}
