const chai = require("chai");
const should = chai.should();

const mongoose = require('mongoose');
const {BlogPost} = require("../models")

const {TEST_DATABASE_URL, PORT} = require("../config")
const {runServer, closeServer} = require("../server")

describe("Endpoint testing", function(){
    
    // Before each test runs, start/connect to database.
    before(function(){
        runServer(databaseUrl=TEST_DATABASE_URL, port=PORT);
    });

    // After each test runs, close/disconnect to database.
    after(function(){
        closeServer();
    });

    // SEED DATABASE BEFORE TESTING
    beforeEach(function(){
        BlogPost.create({
            author: {
                firstName: "nameFirst1",
                lastName: "nameLast1"
            },
            title: "testTitle1",
            content: "lorem ipsum1",
            customID: "firstTest1"
        });
        BlogPost.create({
            author: {
                firstName: "nameFirst2",
                lastName: "nameLast2"
            },
            title: "testTitle2",
            content: "lorem ipsum2",
            customID: "firstTest2"
        });
        BlogPost.create({
            author: {
                firstName: "nameFirst3",
                lastName: "nameLast3"
            },
            title: "testTitle3",
            content: "lorem ipsum3",
            customID: "firstTest3"
        });
    });

    // REMOVE MODELS AFTER TESTING IS COMPLETED 
    afterEach(function(){
        BlogPost.deleteOne({customID: "firstTest1"});
        BlogPost.deleteOne({customID: "firstTest2"});
        BlogPost.deleteOne({customID: "firstTest3"});
    });

    
    
    describe("GET endpoint", function(){
        
        it("should return a list of blog posts", function(){

        });

    });



});




