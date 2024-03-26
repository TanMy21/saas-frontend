const formatDate = (dateString: string) => {
  const options = {
    day: "numeric",
    month: "long" as string,
    year: "numeric" as const,
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

export default formatDate;
