process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");

describe("Testing /wall path", () => {
    describe("Testing PUT /wall/ship", () => {
        const sendTests = [
            {case: "Sending single wall", wallId: 1, code: 200, changedRows: 1},
            {case: "Sending multupe walls", wallId: [2, 3], code: 200, changedRows: 2},
            {case: "No walls", wallId: [], code: 404},
            {case: "Walls field as string", wallId: "string", code: 404},
            {case: "Trying to ship walls that dont exist", wallId: 700, code: 404}
        ];
    
        sendTests.forEach((test) => {
            describe("PUT /wall/ship", () => {
                it(test.case, (done) => {
                    chai.request(server)
                        .put("/wall/ship")
                        .send({
                            walls: test.wallId
                        })
                        .end((err, res ) => {
                            res.should.have.status(test.code);
                            if(test.code === 200) {
                                res.body.changedRows.should.equal(test.changedRows)
                            }
                            done();
                        })
                })
            })
        })
    });

    describe("Testing /wall/unmolded", () => {
        const unmoldedTest = [
            {case: "Geting unmolded with invalid project id format", id: "ett", code: 400},
            {case: "Getting unmolded with project with one unmolded wall", id: 1, code: 200, length: 1}
        ]
        unmoldedTest.forEach((test) => {
            describe("GET /wall/unmolded", () => {
                it(test.case, (done) => {
                    chai.request(server)
                        .get("/wall/unmolded")
                        .query({
                            id: test.id
                        })
                        .end((err, res) => {
                            res.should.have.status(test.code)
                            if(test.code === 200) {
                                res.body.data.length.should.equal(test.length)
                            }
                            done();
                        })
                })
            })
        })

    })
    describe("Testing /wall/mold paths", () => {
        const moldTests = [
            {case: "Modling wall", method: "PUT /wall/mold", id: 1, code: 204},
            {case: "Trying to mold wall that dont exist", method: "POST /wall/mold", id: 700, code: 404},
            {case: "Trying to mold wall with no id", method: "POST /wall/mold", id: undefined, code: 404}
        ]

        moldTests.forEach((test) => {
            describe(test.method, () => {
                it(test.case, (done) => {
                    chai.request(server)
                        .put("/wall/mold")
                        .send({
                            id: test.id
                        })
                        .end((err, res) => {
                            res.should.have.status(test.code)
                            done();
                        })
                })
            })
        })
    });

    describe("Testing GET /wall/ship", () => {
        const unmoldedTest = [
            {case: "Geting walls redy to ship with invalid project id format", id: "ett", code: 400},
            {case: "Getting walls redy to ship with project with one wall ready", id: 1, code: 200, length: 2}
        ]
        unmoldedTest.forEach((test) => {
            describe("GET /wall/unmolded", () => {
                it(test.case, (done) => {
                    chai.request(server)
                        .get("/wall/ship")
                        .query({
                            id: test.id
                        })
                        .end((err, res) => {
                            res.should.have.status(test.code)
                            if(test.code === 200) {
                                res.body.data.length.should.equal(test.length)
                            }
                            done();
                        })
                })
            })
        })

    });

    describe("Testing GET /wall", () => {
        const getWallTest = [
            {case: "Getting wall with invalid id" , id: "ett", code: 400},
            {case: "Getting wall sucsessfuly", id: 1, code: 200},
            {case: "Getting wall that dont exist", id: 500, code: 404}
        ];

        getWallTest.forEach((test) => {
            describe("Get /wall", () => {
                it(test.case, (done) => {
                    chai.request(server)
                        .get("/wall")
                        .query({
                            id: test.id
                        })
                        .end((err, res) => {
                            res.should.have.status(test.code);
                            done();
                        })
                })
            })
        })
    })
})