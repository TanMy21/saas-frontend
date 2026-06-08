import { Box } from "@mui/material";
import { AnimatePresence } from "motion/react";

import useAuth from "../../../hooks/useAuth";
import { useDropdownOptions } from "../../../hooks/useDropdownOptions";
import { useGeneratedDropdownOptions } from "../../../hooks/useGeneratedDropdownOptions";
import { useToast } from "../../../hooks/useToast";
import { MAX_DROPDOWN_OPTIONS } from "../../../utils/constants";
import { ElementProps } from "../../../utils/types";
import { DropdownAIPromptDialog } from "../../Modals/DropdownAIPromptDialog";
import { DropdownAIReviewDialog } from "../../Modals/DropdownAIReviewDialog";

import { DropdownManualAdd } from "./DropdownManualAdd";
import { DropdownOptionCount } from "./DropdownOptionCount";
import { DropdownOptionManager } from "./DropdownOptionManager";
import { DropdownPreview } from "./DropdownPreview";

const DropdownResponse = ({ qID, display }: ElementProps) => {
  const { can } = useAuth();

  const canCreate = can("CREATE_OPTION");
  const canReorder = can("REORDER_OPTION");
  const canDelete = can("DELETE_OPTION");
  const canEdit = can("UPDATE_OPTION");

  const {
    options,
    inputValue,
    createState,
    isCreatingReviewedOptions,
    setInputValue,
    handleAddOptions,
    handleDragEnd,
    handleDeleteOption,
    createReviewedOptions,
  } = useDropdownOptions({
    qID: qID!,
    canDelete,
  });

  const {
    aiPromptOpen,
    aiReviewOpen,
    aiPrompt,
    aiCount,
    generatedOptions,
    generatingOptions,
    available,
    setAiPromptOpen,
    setAiReviewOpen,
    setAiPrompt,
    setAiCount,
    handleOpenAiPrompt,
    handleGenerateOptions,
    handleUpdateGeneratedOption,
    handleDeleteGeneratedOption,
    handleAddGeneratedOptions,
  } = useGeneratedDropdownOptions({
    qID: qID!,
    currentOptionCount: options.length,
    createReviewedOptions,
  });

  useToast({
    isError: createState.isError,
    error: createState.error,
    errorFallbackMessage: "Something went wrong.",
  });

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 3,
      }}
    >
      <Box
        sx={{
          width: display === "mobile" ? "92%" : "62%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <DropdownPreview options={options} />

        <DropdownOptionCount count={options.length} />
        {display === "desktop" && (
          <DropdownOptionManager
            qID={qID!}
            options={options}
            canReorder={canReorder}
            canEdit={canEdit}
            canDelete={canDelete}
            onDragEnd={handleDragEnd}
            onDelete={handleDeleteOption}
          />
        )}

        {display === "desktop" && canCreate && (
          <DropdownManualAdd
            inputValue={inputValue}
            disabled={options.length >= MAX_DROPDOWN_OPTIONS}
            onInputChange={setInputValue}
            onAddOptions={handleAddOptions}
            onOpenAI={handleOpenAiPrompt}
          />
        )}
      </Box>

      <AnimatePresence>
        {aiPromptOpen && (
          <DropdownAIPromptDialog
            open={aiPromptOpen}
            prompt={aiPrompt}
            count={aiCount}
            maxCount={available}
            isGenerating={generatingOptions}
            onClose={() => setAiPromptOpen(false)}
            onPromptChange={setAiPrompt}
            onCountChange={setAiCount}
            onGenerate={handleGenerateOptions}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {aiReviewOpen && (
          <DropdownAIReviewDialog
            open={aiReviewOpen}
            options={generatedOptions}
            onClose={() => setAiReviewOpen(false)}
            onBack={() => {
              setAiReviewOpen(false);
              setAiPromptOpen(true);
            }}
            isAddingReviewedOptions={isCreatingReviewedOptions}
            onUpdateOption={handleUpdateGeneratedOption}
            onDeleteOption={handleDeleteGeneratedOption}
            onAddReviewedOptions={handleAddGeneratedOptions}
          />
        )}
      </AnimatePresence>
    </Box>
  );
};

export default DropdownResponse;
