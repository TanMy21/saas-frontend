import { useState } from "react";

import { useGenerateDropdownOptionsMutation } from "../app/slices/genApiSlice";
import { GeneratedDropdownOption } from "../types/genTypes";
import { MAX_DROPDOWN_OPTIONS } from "../utils/constants";
import { showToast } from "../utils/showToast";

export const useGeneratedDropdownOptions = ({
  qID,
  currentOptionCount,
  createReviewedOptions,
}: {
  qID: string;
  currentOptionCount: number;
  createReviewedOptions: (
    options: GeneratedDropdownOption[],
  ) => Promise<boolean>;
}) => {
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [aiReviewOpen, setAiReviewOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCount, setAiCount] = useState(10);
  const [generatedOptions, setGeneratedOptions] = useState<
    GeneratedDropdownOption[]
  >([]);

  const [generateDropdownOptions, { isLoading: generatingOptions }] =
    useGenerateDropdownOptionsMutation();

  const available = MAX_DROPDOWN_OPTIONS - currentOptionCount;

  /**
   * Opens the AI prompt modal only when the dropdown still has remaining capacity.
   */
  const handleOpenAiPrompt = () => {
    if (available <= 0) {
      showToast.info("Dropdown option limit reached (100 options).");
      return;
    }

    setAiCount(Math.min(10, available));
    setAiPromptOpen(true);
  };

  /**
   * Sends the creator prompt to the backend and opens the review modal with generated options.
   */
  const handleGenerateOptions = async () => {
    if (!aiPrompt.trim()) {
      showToast.info("Enter a prompt first.");
      return;
    }

    if (available <= 0) {
      showToast.info("Dropdown option limit reached (100 options).");
      return;
    }

    try {
      const result = await generateDropdownOptions({
        questionID: qID,
        prompt: aiPrompt.trim(),
        count: Math.min(aiCount, available),
      }).unwrap();

      setGeneratedOptions(result.options);
      setAiPromptOpen(false);
      setAiReviewOpen(true);
    } catch (error) {
      console.error("Generate dropdown options error:", error);
      showToast.error("Failed to generate dropdown options.");
    }
  };

  /**
   * Updates generated option text before final creation.
   * The value is kept equal to text to match your current manual creation behavior.
   */
  const handleUpdateGeneratedOption = (index: number, nextText: string) => {
    setGeneratedOptions((prev) =>
      prev.map((option, optionIndex) =>
        optionIndex === index
          ? {
              ...option,
              text: nextText,
              value: nextText,
            }
          : option,
      ),
    );
  };

  /**
   * Removes one generated option from the temporary review list.
   */
  const handleDeleteGeneratedOption = (index: number) => {
    setGeneratedOptions((prev) =>
      prev
        .filter((_, optionIndex) => optionIndex !== index)
        .map((option, optionIndex) => ({
          ...option,
          order: optionIndex + 1,
        })),
    );
  };

  /**
   * Adds reviewed generated options through the normal option creation endpoint.
   */
  const handleAddGeneratedOptions = async () => {
    const created = await createReviewedOptions(generatedOptions);

    if (!created) return;

    setGeneratedOptions([]);
    setAiPrompt("");
    setAiReviewOpen(false);
  };

  return {
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
  };
};
