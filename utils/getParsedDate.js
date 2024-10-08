export const getParsedDate = (
  date,
  dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }
) => {
  return new Date(date).toLocaleDateString('en', dateOptions);
};
