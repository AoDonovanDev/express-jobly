const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
//uses passed "jsToSql" object to convert js variable names to sql column names
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  //make an array containing string values for sql insert statement
  //if key of "dataToUpdate" is present in "jsToSql", use that, else use whatever was provided
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
  console.log(cols)
  //join and return the sql statement array
  //return an object with keys of "setCols" which is the sql statement
  //and "values" which is the values that the parameters in the string will correspond to
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
