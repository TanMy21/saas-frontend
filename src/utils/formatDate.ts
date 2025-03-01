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

const exportDataDate = (today: string): string => {
  const date = new Date(today);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export { formatDate, exportDataDate };
