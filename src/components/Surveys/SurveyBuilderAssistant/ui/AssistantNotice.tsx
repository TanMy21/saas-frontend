import type { AssistantNoticeData } from "../../../../types/surveyBuilderAssistant.types";
import { GuardrailNotice } from "../../../assistant-ui/guardrail-notice";
import { useSurveyBuilderAssistant } from "../SurveyBuilderAssistantContext";
import { isAssistantThreadReadOnly } from "../surveyBuilderAssistantLifecycle";

const AssistantNotice = ({
  notice,
  interactive = false,
  announce = false,
  onDismiss,
}: {
  notice: AssistantNoticeData;
  interactive?: boolean;
  announce?: boolean;
  onDismiss?: () => void;
}) => {
  const { canSendMessages, sendMessage, thread } = useSurveyBuilderAssistant();

  return (
    <GuardrailNotice
      {...notice}
      role={
        announce ? (notice.tone === "refusal" ? "alert" : "status") : "note"
      }
      onDismiss={onDismiss}
      disabled={!canSendMessages}
      onPick={
        interactive && !isAssistantThreadReadOnly(thread)
          ? (alternative) => void sendMessage(alternative)
          : undefined
      }
    />
  );
};

export default AssistantNotice;
