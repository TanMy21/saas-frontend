export const generateOptionLabel = (index: number, qType: string) => {
  if (qType === "RADIO" || qType === "MULTIPLE_CHOICE" || qType === "MEDIA") {
    return String.fromCharCode(65 + index);
  }
  return `${index + 1}`;
};
