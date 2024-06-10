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
  let dateString = "";
  const date = new Date(today);
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
  let year = date.getFullYear();

  return (dateString = `${day}-${month}-${year}`);
};

export { formatDate, exportDataDate };
