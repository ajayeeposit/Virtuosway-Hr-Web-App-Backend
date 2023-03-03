const NepaliDate = require('nepali-date-converter')

const getSaturdaysAndSundays = (year, month) => {
  const date = new NepaliDate(year, month, 1);

  let numSaturdays = 0;
  let numSundays = 0;

  while (date.getMonth() === month) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) {
      numSundays++;
    } else if (dayOfWeek === 6) {
      numSaturdays++;
    }
    date.setDate(date.getDate() + 1);
  }

  return numSaturdays + numSundays;
};

const getPayRollDate = () => {
  const date = new NepaliDate(new Date());
  const year = date.getYear();
  const month = date.getMonth() + 1;
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  return lastDayOfMonth;
};

module.exports = { getSaturdaysAndSundays, getPayRollDate };
