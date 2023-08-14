"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Job = require("../models/job");
const {UnauthorizedError, NotFoundError} = require("../expressError.js")

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);



describe("get /jobs", function () {
  /*******get all jobs */
  test("retrieves list of jobs", async function () {
    const resp = await request(app).get("/jobs")
    const jobs = resp.body.jobs
    expect(resp.statusCode).toEqual(200)
    expect(jobs.length).toEqual(3)
  });
  /**logic in route to trigger filter method works */
  test("title filter works", async function () {
    const resp = await request(app).get("/jobs?title=job1")
    const job = resp.body.results[0]
    console.log(job.id)
    expect(job.title).toEqual('job1')
  });
  test("salary filter works", async function (){
    const resp = await request(app).get("/jobs?min=200000")
    const jobs = resp.body.results
    for(let job of jobs){
      expect(job.salary >= 200000).toBeTruthy()
    };
  });
  test("hasEquity filter works", async function () {
    const resp = await request(app).get("/jobs?hasEquity=true")
    const jobs = resp.body.results
    expect(jobs.length).toEqual(1)
  });
});

describe("POST /jobs", function () {
  //creates job if authorized
  test("create job", async function () {
    const newJob = {
      title: 'testJobPosting',
      salary: 110000,
      equity:  0,
      companyHandle: 'c2'
    }
    const resp = await request(app).post("/jobs")
    .set("authorization", `Bearer ${u1Token}`)
    .send(newJob);
    const result = resp.body.job
    expect(result).toEqual(newJob)
  });
  //does not allow unauthorized
  test("throw unauthorized if token missing", async function () {
    const newJob = {
      title: 'testJobPosting',
      salary: 110000,
      equity:  0,
      companyHandle: 'c2'
    }
    const resp = await request(app).post("/jobs")
    .send(newJob);
    expect(resp.statusCode).toEqual(401)
  })
});

describe("GET /job/:id", function () {
  //view a job
  test("view a job", async function () {
    const resp = await request(app).get("/jobs/3")
    expect(resp.body.job.title).toEqual("job3")
  })

  //throw not found if job doesnt exist
  test("throw not found if job doesnt exist", async function () {
    const resp = await request(app).get("/jobs/56754")
    expect(resp.body.error.status).toEqual(404)
  })
})

describe("PATCH /job/id", function () {
  test("can update a job if admin", async function () {
    const updatedJ = {
      salary: 220000,
      equity:  0.5,
    }
    const resp = await request(app).patch("/jobs/1")
    .set("authorization", `Bearer ${u1Token}`)
    .send(updatedJ);
    console.log(resp.body)
    const result = resp.body.job
    expect(result).toEqual({
      id: 1,
      title: 'job1',
      companyHandle: 'c1',
      ...updatedJ
    })
  })

  test("throw unauthorized if admin token absent", async function () {
    const updatedJ = {
      salary: 220000,
      equity:  0.5,
    }
    const resp = await request(app).patch("/jobs/1")
    .send(updatedJ);
    expect(resp.statusCode).toEqual(401)
  })
})

describe("DELETE /job/id", function () {
  //admin can delete other users
  test("can delete a user if you are that user or admin", async function () {
    const resp = await request(app).delete("/users/u2")
    .set("authorization", `Bearer ${u1Token}`)
    expect(resp.body.deleted).toEqual('u2')
  })
  test("non admins cannot delete other users", async function () {
    const resp = await request(app).delete("/users/u1")
    .set("authorization", `Bearer ${u2Token}`)
    expect(resp.statusCode).toEqual(401)
  })
  test("users can delete themselves", async function () {
    const resp = await request(app).delete("/users/u2")
    .set("authorization", `Bearer ${u2Token}`)
    expect(resp.body.deleted).toEqual('u2')
  })
})