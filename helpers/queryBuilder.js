
// returns an object containing query string and param values
//
// {min: 2, max, 3} = > {
//      queryString: "SELECT * FROM companies WHERE num_employees > $1 AND num_employees < $2",
//      params: [min, max]
//   }    //

function companyQueryBuilder(filterBy){
  
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

function jobQueryBuilder(filterBy){
  
  let queryString = 'SELECT title, salary, equity, company_handle as "companyHandle" FROM jobs WHERE ';
  let params = [];
  let count = 1;
  
  const {min, max, title, hasEquity} = filterBy
  
  if(title){
    if(count>1) queryString += ' AND ';
    queryString += `LOWER(title) LIKE LOWER($${count})`;
    params.push(`%${title}%`);
    count++;
  }
  if(min){
    if(count>1) queryString += ' AND ';
    queryString += `salary >= $${count}`;
    params.push(min);
    count++;
  }
  if(max){
    if(count>1) queryString += ' AND ';
    queryString += `salary <= $${count}`;
    params.push(max);
    count++;
  }
  if(hasEquity){
    if(count>1) queryString += ` AND `;
    queryString += `equity > 0`;
    count++;
  }
  return {
    queryString,
    params
  }
}


module.exports = {companyQueryBuilder, jobQueryBuilder}