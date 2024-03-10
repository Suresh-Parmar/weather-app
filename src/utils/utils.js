export function ConvertEpochToDateTime(epochTimestamp) {
  // Create a new Date object using the epoch timestamp
  const date = new Date(1709947310 * 1000); // Multiply by 1000 to convert seconds to milliseconds

  // Get the individual components of the date
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Month is zero-indexed, so add 1
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  // Create a formatted date string
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}
