import { useTheme } from "@/hooks";

// Types
import { Message } from "@/features/chat/hooks/useGetMessages/useGetMessages";

// Components
import { Icon, Popover } from "@/features/ui";
import EmojiPicker, {
  Theme,
  EmojiStyle,
  EmojiClickData,
} from "emoji-picker-react";

type Props = {
  setMessage: React.Dispatch<React.SetStateAction<any>>;
};

export default function EmojiButton({ setMessage }: Props) {
  const { theme } = useTheme();

  function onEmojiClick(_: EmojiClickData, e: MouseEvent) {
    setMessage((message: any) => {
      return { ...message, data: message.data + (e.target as any).innerText };
    });
  }
  return (
    <Popover
      side="top"
      sideOffset={5}
      trigger={<Icon icon="face-smile" />}
      css={{
        padding: "12px",
      }}
      contentCSS={{
        width: "100vw",
        minHeight: "400px",
        maxHeight: "400px",
        overflow: "scroll",
        position: "relative",
        padding: "0 0 $075 0",

        "@md": {
          maxWidth: "480px",
        },
      }}
    >
      <EmojiPicker
        theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
        emojiStyle={EmojiStyle.NATIVE}
        searchDisabled
        onEmojiClick={onEmojiClick}
        width="100%"
        previewConfig={{ showPreview: false }}
      />
    </Popover>
  );
}
