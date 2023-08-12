const queryBuilder = require('./queryBuilder')

describe("build query string", function () {
  test("works with name only", function () {
    const filter = {name: 'C1'}
    const {name} = filter
    expect(queryBuilder(filter))
    .toEqual({
      queryString: "SELECT * FROM companies WHERE name LIKE $1",
      params: [`%${name}%`]
    })
  });

  test("works with name and min", function () {
    
    const filter = {name: 'C2', min:2};
    const {name, min} = filter;
    expect(queryBuilder(filter))
    .toEqual({
      queryString: "SELECT * FROM companies WHERE name LIKE $1 AND num_employees >= $2",
      params: [`%${name}%`, min]
    });
  });

  test("works with only min and max", function () {
    const filter = {min:1, max:3};
    const {min, max} = filter;
    expect(queryBuilder(filter))
    .toEqual({
      queryString: "SELECT * FROM companies WHERE num_employees >= $1 AND num_employees <= $2",
      params: [min, max]
    });
  });


});