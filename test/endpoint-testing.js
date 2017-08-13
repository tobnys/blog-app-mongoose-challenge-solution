const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect();

const mongoose = require('mongoose');
const {BlogPost} = require("../models")

const {TEST_DATABASE_URL, PORT} = require("../config")
const {runServer, closeServer, app} = require("../server")

chai.use(chaiHttp);

function dropDatabase() {
    return new Promise((resolve, reject) => {
        mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
}

function seedDatabase() {
        return BlogPost.create({
            author: {
                firstName: "nameFirst1",
                lastName: "nameLast1"
            },
            title: "testTitle1",
            content: "lorem ipsum1",
            customID: "firstTest1"
        }); 
}

describe("Endpoint testing", function(){
    
    // Before each test runs, start/connect to database.
    before(function(){
        return runServer(databaseUrl=TEST_DATABASE_URL, port=PORT);
    });

    // After each test runs, close/disconnect to database.
    after(function(){
        return closeServer();
    });

    // SEED DATABASE BEFORE TESTING
    beforeEach(function(){
        return seedDatabase();
    });

    // DROP DATABASE AFTER EACH TEST IS RUN
    afterEach(function(){
        return dropDatabase();
    });
    
    describe("GET endpoint", function(){

        it("should return a list of blog posts", function(){
            let res;
            return chai.request(app).get("/posts").then(function(_res){
                res = _res;
                res.should.have.status(200);
                res.body.should.have.length.of.at.least(1);
                return BlogPost.count();
            })
            .then(function(count){
                res.body.should.have.length.of.at.least(count);
            });
        });

        it("should return the correct fields of a post", function(){
            let resPost;
            const expectedKeys = ["id", "author", "title", "content"];
            return chai.request(app).get("/posts").then(function(res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("array");
                res.body.should.have.length.of.at.least(1);

                res.body.forEach(function(post){
                    post.should.include.keys(expectedKeys);
                });

                resPost = res.body[0];
                return BlogPost.findById(resPost.id).exec();

                //res.body.should.have.all.keys(expectedKeys);
            }).then(function(post) {
                resPost.title.should.equal(post.title);
                resPost.content.should.equal(post.content);
            });
        });
    });

    describe("POST endpoint", function(){
        it("should create a new post on POST", function(){
            const newPost = {
                title: "testing Title",
                content: "testing Content",
                author: {
                    firstName: "first auth name",
                    lastName: "last auth name"
                }
            }
            return chai.request(app)
            .post("/posts")
            .send(newPost)
            .then(function(res){
                res.should.have.status(201);
                res.body.should.be.a("object");
                res.body.title.should.equal(newPost.title);
                res.body.content.should.equal(newPost.content);
            });
        });
    });


    describe("PUT endpoint", function(){
        it("should update a post on PUT", function(){
            const updatedPost = {
                title: "updated Title",
                content: "updated Content",
                author: {
                    firstName: "updated auth name",
                    lastName: "updated auth name"
                }
            }
            return BlogPost.findOne().exec().then(function(blogPost){
                updatedPost.id = blogPost.id;

                return chai.request(app).put(`/posts/${updatedPost.id}`).send(updatedPost);
            })
            .then(function(res){
                res.should.have.status(201);

                return BlogPost.findById(updatedPost.id).exec();
            })
            .then(function(post){
                updatedPost.title.should.equal(post.title);
                updatedPost.content.should.equal(post.content);
            });
        });
    });

    describe("DELETE endpoint", function(){
        it("should remove a post on DELETE", function(){
            return BlogPost.findOne().exec().then(function(oldPost){
                return chai.request(app).del(`/posts/${oldPost.id}`).then(function(res){
                    res.should.have.status(204);
                    return BlogPost.findById(oldPost.id).exec();
                })
                .then(function(post){
                    should.not.exist(post);
                });
            });
        });
    });    
});




