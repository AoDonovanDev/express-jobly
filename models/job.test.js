"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "testJob",
    salary: 125000,
    equity: "0",
    companyHandle: 'fakebiz'
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual(newJob);

    const result = await db.query(
          `SELECT title, salary, equity, company_handle as "companyHandle"
           FROM jobs
           WHERE title = 'testJob'`);
    expect(result.rows).toEqual([
      {
        title: "testJob",
        salary: 125000,
        equity: "0",
        companyHandle: 'fakebiz'
      }
    ]);
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {title: 'job1',
       salary: 200000,
       equity:  "0",
       companyHandle: 'fakebiz'},
      {title: 'job2',
       salary: 100000,
       equity:  "0",
       companyHandle: 'fakebiz'},
      {title: 'job3',
       salary: 50000,
       equity:  "0",
       companyHandle: 'fakebiz'},
    ]);
  });
});

/************************************** filter */
describe("filter", function() {
  test("min works", async function () {
    let jobs = await Job.filter({min:100000})
    expect(jobs).toEqual([
      {title: 'job1',
       salary: 200000,
       equity:  "0",
       companyHandle: 'fakebiz'},
      {title: 'job2',
       salary: 100000,
       equity:  "0",
       companyHandle: 'fakebiz'}
      ]);
  });
  test("max works", async function () {
    let jobs = await Job.filter({max:100000});
    expect(jobs).toEqual([
      {title: 'job2',
       salary: 100000,
       equity:  "0",
       companyHandle: 'fakebiz'},
      {title: 'job3',
       salary: 50000,
       equity:  "0",
       companyHandle: 'fakebiz'}
      ]);
  });
  test("name works, case insensitive", async function() {
    let jobs = await Job.filter({title:'job'});
    expect(jobs).toEqual([
      {title: 'job1',
       salary: 200000,
       equity:  "0",
       companyHandle: 'fakebiz'},
      {title: 'job2',
       salary: 100000,
       equity:  "0",
       companyHandle: 'fakebiz'},
      {title: 'job3',
       salary: 50000,
       equity:  "0",
       companyHandle: 'fakebiz'}
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(1);
    expect(job).toEqual(
      {
       title: 'job1',
       salary: 200000,
       equity:  0,
       companyHandle: 'fakebiz'
      });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(468);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = 
     {
       salary: 210000,
       equity:  0.5
      };

  test("works", async function () {
    let job = await Job.update(1, updateData);
    expect(job).toEqual({
      title: "job1",
      companyHandle: 'fakebiz',
      id: 1,
      ...updateData,
    });

    const result = await db.query(
          `SELECT title, salary, equity::real, company_handle as "companyHandle"
           FROM jobs
           WHERE id = 1`);
    expect(result.rows).toEqual([{
      title: 'job1',
      salary: 210000,
      equity: 0.5,
      companyHandle: 'fakebiz'
    }]);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(888, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(955, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query(
        "SELECT title FROM jobs WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(890);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
