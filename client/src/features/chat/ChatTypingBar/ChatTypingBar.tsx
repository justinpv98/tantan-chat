import { Fragment, useEffect, useState } from "react";
import { keyframes } from "@stitches/react";

// Constants
import socketEvents from "@/constants/socketEvents";

// Hooks
import { useSocket } from "@/hooks";
import { useGetTarget } from "../hooks";

// Components
import { Box, Text } from "@/features/ui";

export default function ChatTypingBar() {
  const [usersTyping, setUsersTyping] = useState<string[]>([]);
  const socket = useSocket();
  const {data: conversation, target} = useGetTarget();


  useEffect(() => {
    socket.on(socketEvents.TYPING, typingListener);


    return () => {
      socket.off(socketEvents.TYPING, typingListener)
    }

  }, [conversation?.id])

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsersTyping([]);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [usersTyping]);

  useEffect(() => {
    return () => {
      setUsersTyping([]);
    };
  }, [conversation?.id, target?.id]);

  function formatUsers(users: string[]) {
    switch (true) {
      case users.length === 1:
        return (
          <Fragment>
            <Text weight="medium" inline>
              {users[0]}
            </Text>{" "}
            is typing...
          </Fragment>
        );
      case users.length === 2:
        return (
          <Fragment>
            <Text weight="medium" inline>
              {users[0]}
            </Text>{" "}
            and
            <Text weight="medium" inline>
              {users[1]}
            </Text>{" "}
            are typing...
          </Fragment>
        );
      case users.length === 3:
        return (
          <Fragment>
            <Text weight="bold" inline>
              {users[0]}
            </Text>
            ,{" "}
            <Text weight="bold" inline>
              {users[1]}
            </Text>
            , and{" "}
            <Text weight="bold" inline>
              {users[2]}
            </Text>{" "}
            are typing...
          </Fragment>
        );
      case users.length > 3:
        return `Several people are typing...`;
      default:
        break;
    }
  }

  function typingListener(username: string, conversationId: string){
    if(Number(conversationId) == conversation?.id){
      const users = [...usersTyping, username];
      const filteredUsers = [...new Set(users)];
      setUsersTyping(filteredUsers);
    }
  }

  
  return (
    <Box
      css={{
        transition: "bottom 200ms ease-in-out, opacity 1ms ease-in 160ms",
        backgroundColor: "$sage4",
        bottom: usersTyping.length === 0 ? "2rem" : "4.25rem",
        color: "$sage12",
        fontSize: "$075",
        letterSpacing: 0.25,
        opacity: 1,
        paddingBlock: "$025",
        paddingInlineStart: "$150",
        position: "fixed",
        width: "100%",
        zIndex: 0,
      }}
    >
      {formatUsers(usersTyping)}
    </Box>
  );
}

const slideInOut = keyframes({});
