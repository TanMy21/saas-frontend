import { DateTimeFormatOptions } from "intl";

const formatDate = (dateString: string) => {
  const options: DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

export default formatDate;
