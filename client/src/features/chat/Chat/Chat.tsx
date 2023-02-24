
// Components
import { Flex } from "@/features/ui";
import ChatConversation from "../ChatConversation/ChatConversation";
import ChatInfo from "../ChatInfo/ChatInfo";
import ChatMessageBar from "../ChatMessageBar/ChatMessageBar";

type Props = {
  info: any; //id of user that is being talked to from perspective of client
  onClickMore: () => void;
};

export default function Chat({ onClickMore, info }: Props) {


  return (
    <Flex
      as="main"
      direction="column"
      css={{ width: "100%", maxHeight: "100vh" }}
    >
      <ChatInfo info={info} onClickMore={onClickMore} />
      <ChatConversation />
      <ChatMessageBar />
    </Flex>
  );
}
