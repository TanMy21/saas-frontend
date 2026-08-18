import { ChangeEvent, ReactElement, ReactNode, useRef } from "react";

import { Button, ButtonProps } from "@mui/material";

import { ACCEPTED_DOCUMENT_TYPES } from "../mockSurveyBuilderChat";
import type { SurveyChatUploadMode } from "../surveyBuilderChat.types";

type DocumentUploadButtonProps = Omit<ButtonProps, "onChange"> & {
  children: ReactNode;
  mode: SurveyChatUploadMode;
  onFileSelected: (file: File, mode: SurveyChatUploadMode) => void;
};

const DocumentUploadButton = ({
  children,
  mode,
  onFileSelected,
  ...buttonProps
}: DocumentUploadButtonProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelected(file, mode);
    event.target.value = "";
  };

  return (
    <Button component="label" {...buttonProps}>
      {children}
      <input
        ref={inputRef}
        hidden
        type="file"
        accept={ACCEPTED_DOCUMENT_TYPES}
        onChange={handleChange}
      />
    </Button>
  );
};

export default DocumentUploadButton;
