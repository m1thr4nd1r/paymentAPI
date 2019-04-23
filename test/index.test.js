let mongoose = require("mongoose");
let Clients = require('../db');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Clients', () => 
{
    beforeEach((done) => 
    { //Before each test we empty the database
        Clients.remove({}, (err) => 
        { 
           done();           
        });        
    });
	describe('/GET client', () => 
	{
      it('it should GET all clients', (done) => 
      {
        chai.request(server)
            .get('/clients')
            .end((err, res) => 
            {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
	  });
  	});
});