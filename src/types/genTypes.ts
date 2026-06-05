export type GeneratedDropdownOption = {
  text: string;
  value: string;
  order: number;
};

export type GenerateDropdownOptionsRequest = {
  questionID: string;
  prompt: string;
  count?: number;
};

export type GenerateDropdownOptionsResponse = {
  message: string;
  questionID: string;
  count: number;
  capacityLeft: number;
  options: GeneratedDropdownOption[];
};





