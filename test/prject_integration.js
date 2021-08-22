process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");

chai.should();
chai.use(chaiHttp);

describe("Get project", () => {
    const getTests = [
        {case: "Succsessfully geting project with walls", id: 1, status: 200, walls: 3},
        {case: "Succsesfully geting project with no walls", id: 2, status: 200, walls: 0},
        {case: "Id is not an integer", id: "failing", status: 400},
        {case: "Id is less than 1", id: 0, status: 400},
        {case: "Id cannot be found", id: 100, status: 404}
    ];

    getTests.forEach((test) => {
        describe("GET /project", () => {
            it(test.case, (done) => {
                chai.request(server)
                .get("/project")
                .query({
                    id: test.id
                })
                .end((err, res) => {
                    res.should.have.status(test.status);
                    if (test.walls) {
                        res.body.walls.should.have.length(test.walls)
                    }
                    done();
                })
            })
        })
    })
});

describe("Get all projects", () => {
    it("GET /project/all", () => {
        chai.request(server)
        .get("/project/all")
        .query({})
        .end((err, res) => {
            res.should.have.status(200)
    
        })
    })
})


describe("New Project", () => {
   const newProjectTests = [
    {case: "Project with one wall succesfully", code: 201, costumer: "TestCostumer", project: "TestProject", wall: [
        {wallName: "v01", height: 1100, width: 1200, length: 1300, amount: 1}
    ]},
    {case: "Project with multiple of same wall sucsefully", code: 201, costumer: "Multiple", project: "SameWall", wall: [
        {wallName: "v01", height: 1100, width: 1200, length: 1300, amount: 5}
    ]},
    {case: "Project with multiple of diffrent walls", code: 201, costumer: "Multiple", project: "DiffrentWalls", wall: [
        {wallName: "v01", height: 1100, width: 1200, length: 1300, amount: 2},
        {wallName: "v02", height: 1200, width: 1300, length: 1400, amount: 3},
        {wallName: "v03", height: 1300, width: 1400, length: 1500, amount: 4}
    ]},
    {case: "Failed no costumer", code: 400, costumer: false, project: "DiffrentWalls", wall: [
        {wallName: "v01", height: 1100, width: 1200, length: 1300, amount: 2},
    ]},
    {case: "Failed no projectname", code: 400, costumer: "fins", project: false, wall: [
        {wallName: "v01", height: 1100, width: 1200, length: 1300, amount: 2},
    ]},
    {case: "Failed no walls", code: 400, costumer: "false", project: "DiffrentWalls", wall: [
    ]},
   ]

    newProjectTests.forEach((test) => {
        describe("POST /project", () => {
            it(test.case, (done) => {
                chai.request(server)
                    .post("/project")
                    .send({
                        costumer: test.costumer,
                        project: test.project,
                        walls: test.wall
                    })
                    .end((err, res) => {
                        res.should.have.status(test.code);
                        done();
                    })
            })
        })
    }); 
});
