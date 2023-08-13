
// returns an object containing query string and param values
//
// {min: 2, max, 3} = > {
//      queryString: "SELECT * FROM companies WHERE num_employees > $1 AND num_employees < $2",
//      params: [min, max]
//   }    //

function queryBuilder(filterBy){
  
  let queryString = 'SELECT handle, name, description, num_Employees as "numEmployees", logo_url as "logoUrl" FROM companies WHERE ';
  let params = [];
  let count = 1;
  
  const {min, max, name} = filterBy
  
  if(name){
    if(count>1) queryString += ' AND ';
    queryString += `LOWER(name) LIKE LOWER($${count})`;
    params.push(`%${name}%`);
    count++;
  }
  if(min){
    if(count>1) queryString += ' AND ';
    queryString += `num_employees >= $${count}`;
    params.push(min);
    count++;
  }
  if(max){
    if(count>1) queryString += ' AND ';
    queryString += `num_employees <= $${count}`;
    params.push(max);
    count++;
  }
  return {
    queryString,
    params
  }
}



module.exports = {queryBuilder}