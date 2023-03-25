import React, { Fragment } from "react";
import { styled } from "@/stitches.config";

// Components
import { Button, Icon} from "@/features/ui";

type Props = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FileUploadButton({ onChange }: Props) {
  return (
    <Fragment>
      <input
        type="file"
        className="sr-only"
        id="attachments-btn"
        name="attachments-btn"
        onChange={onChange}
      />
      <Button icon="center" transparent>
        <Label htmlFor="attachments-btn">
          <Icon icon="paper-clip" />
        </Label>
      </Button>
    </Fragment>
  );
}

const Label = styled("label", {
  cursor: "pointer",
});
