import { format, getTime, formatDistanceToNow, parseISO } from "date-fns";

export function fDate(date) {
  return format(new Date(date), "dd MMMM yyyy");
}

//this function is called to change the data from
// data base which was saved as 8601 format and then
// using parseISO in date-fns to convert the value to normal date
// in javascript. it is more easier for UI display

export function fDateCheck(date) {
  return parseISO(date);
}

export function fDateTime(date) {
  return format(new Date(date), "dd MMM yyyy HH:mm");
}

export function fTimestamp(date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), "dd/MM/yyyy hh:mm p");
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
