process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
const { get } = require("../routes/followup.js");
chai.use(require("chai-string"));

describe("Testing /followup path", () => {
    describe("Testing /followup", () => {
        const postTests = [
            {id: 1, height: 101, width: 102, length: 103, crossMessure: -1, lifts: "Ok", surface: "Ok", castings: "Ok",
                comments: "Ok", ursparningar: "Ok", code: 202, case: "Succsesfull insert with all fields"},
            {height: 101, width: 102, length: 103, crossMesure: -1, lifts: "Ok", surface: "Ok", castings: "Ok",
                comments: "Ok", ursparningar: "Ok", code: 400, case: "Missing id", error: "id"},
            {id: 3, height: "Sad", width: 102, length: 103, crossMessure: -1, lifts: "Ok", surface: "Ok", castings: "Ok",
                comments: "Ok", ursparningar: "Ok", code: 400, case: "Wrong height", error: "height"},
            {id: 3, height: 100, length: 103, crossMessure: -1, lifts: "Ok", surface: "Ok", castings: "Ok",
                comments: "Ok", ursparningar: "Ok", code: 400, case: "Wrong width", error: "width"},
            {id: 3, height: 100, width: 102, lifts: "Ok", surface: "Ok", castings: "Ok",
                comments: "Ok", ursparningar: "Ok", code: 400, case: "Wrong length", error: "length"},
                {id: 3, height: 100, width: 102, length: 103, lifts: "Ok", surface: "Ok", castings: "Ok",
                comments: "Ok", ursparningar: "Ok", code: 400, case: "Wrong CrossMessure", error: "crossMessure"},
            {id: 3, height: 100, width: 102, length: 103, crossMessure: -1, surface: "Ok", castings: "Ok",
                comments: "Ok", ursparningar: "Ok", code: 400, case: "Wrong Lift", error: "lifts"},
            {id: 3, height: 100, width: 102, length: 103, crossMessure: -1, lifts: "Ok", castings: "Ok",
                comments: "Ok", ursparningar: "Ok", code: 400, case: "Wrong Surface", error: "surface"}
            //     ,
            // {id: 400, height: 102, width: 102, length: 103, crossMessure: -1, lifts: "Ok", surface: "Ok", castings: "Ok",
            //     comments: "Ok", ursparningar: "Ok", code: 400, case: "Succsesfull insert with all fields"},   
        ]
        const getTests = [
            {case: "Getting followup succsesfully", id: 1, code: 200},
            {case: "Getting follow up with invalid/no id", id: "Hej", code: 400},
            {case: "Getting with id that dont exist", id: 500, code: 404}
        ];

        postTests.forEach((test) => {
            describe("POST /followup", () => {
                it(test.case, (done) => {
                    chai.request(server)
                        .post("/followup")
                        .send({
                            id: test.id,
                            height: test.height,
                            length: test.length,
                            width: test.width,
                            crossMessure: test.crossMessure,
                            lifts: test.lifts,
                            surface: test.surface,
                            castings: test.castings,
                            comments: test.comments,
                            ursparningar: test.ursparningar
                        })
                        .end((err, res) => {
                            res.should.have.status(test.code)
                            if(test.code === 400) {
                                res.body.errors.detail.should.endWith(test.error);
                            }
                            done();
                        })
                })
            })
        });

        getTests.forEach((test) => {
            describe("GET /followup", () => {
                it(test.case, (done) => {
                    chai.request(server)
                        .get("/followup")
                        .query({id: test.id})
                        .end((err, res) => {
                            res.should.have.status(test.code)
                            done();
                        })

                })
            })
        })
    });

    describe("Testing /followup/ready", () => {
        getTest = [
            {case: "Getting succsesfully", code: 200, id: 1},
            {case: "Id that dont exists", code: 404, id: 500},
            {case: "No id/invalid id", code: 400}
        ]
        getTest.forEach((test) => {
            describe("GET /followup/ready", () => {
                it(test.case, (done) => {
                    chai.request(server)
                        .get("/followup/ready")
                        .query({id: test.id})
                        .end((err, res ) => {
                            res.should.have.status(test.code);
                            done();
                        })
                })
            })
        })
    });
})