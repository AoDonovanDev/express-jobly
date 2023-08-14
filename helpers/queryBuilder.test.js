const {companyQueryBuilder} = require('./queryBuilder')
const {jobQueryBuilder} = require('./queryBuilder')

describe("query string builder tests", function () {
  test("companies: works with name only", function () {
    const filter = {name: 'C1'}
    const {name} = filter
    expect(companyQueryBuilder(filter))
    .toEqual({
      queryString: `SELECT handle, name, description, num_employees as "numEmployees", logo_url as "logoUrl" FROM companies WHERE LOWER(name) LIKE LOWER($1)`,
      params: [`%${name}%`]
    })
  });

  test("companies: works with name and min", function () {
    
    const filter = {name: 'C2', min:2};
    const {name, min} = filter;
    expect(companyQueryBuilder(filter))
    .toEqual({
      queryString: `SELECT handle, name, description, num_employees as "numEmployees", logo_url as "logoUrl" FROM companies WHERE LOWER(name) LIKE LOWER($1) AND num_employees >= $2`,
      params: [`%${name}%`, min]
    });
  });

  test("companies: works with only min and max", function () {
    const filter = {min:1, max:3};
    const {min, max} = filter;
    expect(companyQueryBuilder(filter))
    .toEqual({
      queryString: `SELECT handle, name, description, num_employees as "numEmployees", logo_url as "logoUrl" FROM companies WHERE num_employees >= $1 AND num_employees <= $2`,
      params: [min, max]
    });
  });

  test("jobs: works with title only", function () {
    const filter = {title: 'test'};
    const {title} = filter
    expect(jobQueryBuilder(filter))
    .toEqual({
      queryString: `SELECT title, salary, equity, company_handle as "companyHandle" FROM jobs WHERE LOWER(title) LIKE LOWER($1)`,
      params: [`%${title}%`]
    })
  })

  test("jobs: works with title and min", function () {
    const filter = {title: 'test', min: 200000};
    const {title, min} = filter
    expect(jobQueryBuilder(filter))
    .toEqual({
      queryString: `SELECT title, salary, equity, company_handle as "companyHandle" FROM jobs WHERE LOWER(title) LIKE LOWER($1) AND salary >= $2`,
      params: [`%${title}%`, min]
    })
  })
});