import { format } from "date-fns";

const formateDate = (date: any, formate?: string) => {
  const dateObj = new Date(date);
  const dateFormat = formate ? formate : "MM/dd/yyyy";
  const formattedDate = format(dateObj, dateFormat);
  return formattedDate;
};

// hh:mm:aaa
const getDateTime = (date: string) => {
  // change DateTime format
  let time = new Date(date);
  let day = time.getMonth() + 1 + "/" + time.getDate(),
    hour = time.getHours(),
    minute = time.getMinutes(),
    ampm = "am";
  // 判斷am, pm
  if (hour > 12) {
    hour = hour % 12;
    ampm = "pm";
  }

  let formatHour = hour < 10 ? "0" + hour : hour.toString(),
    formetMinute = minute < 10 ? "0" + minute : minute.toString();

  return `${day} ${formatHour}:${formetMinute} ${ampm}`;
};

export { formateDate, getDateTime };
