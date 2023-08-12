const {sqlForPartialUpdate} = require('./sql')

const dict = {
          firstName: "first_name",
          lastName: "last_name",
          isAdmin: "is_admin",
        };

const goodData = {
  firstName: "goobert",
  lastName: "schubert"
}

const addData = {
  firstName: "skreven",
  age: 25
}

describe("convert js names to seq columns given partial data", function () {
  test("works", function () {
    const results = sqlForPartialUpdate(goodData, dict)
    expect(results)
    .toEqual({
      setCols: '"first_name"=$1, "last_name"=$2',
      values: ['goobert', 'schubert']
    });
  });
  test("works with nonexistent keys", function(){
    expect(sqlForPartialUpdate(addData, dict))
    .toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ['skreven', 25]
    });
  });
});