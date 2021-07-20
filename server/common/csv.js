
const toCSV = (headers, rows) => {
  let finalStr = `${headers.toString()}\n`;
  rows.forEach(row => {
    finalStr += `${row.toString()}\n`;
  });

  return finalStr;
};

export default toCSV;
