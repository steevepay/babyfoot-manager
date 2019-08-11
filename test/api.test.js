process.env.NODE_ENV = 'test';
let assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

const endpoint = '/api/v1/games';
const endpointid = '/api/v1/games/';

describe('Babyfoot Manager API', () => {
  
  beforeEach('Setting up the babyfoot API - Cleaning the DB', (done) => {
    console.log('beforeEach');
    chai.request(server).delete(endpoint).end((err, res) => {
      done()
    });
  });

  describe('GET', () => {
    it('should get no game', (done) => {
      chai.request(server)
      .get(endpoint)
      .end((err, res) => {
        assert(err === null);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });

    it('should get one game', async () => {
      const name = "John vs Tom - test0";
      const status = "progress";
      let res = await chai.request(server)
        .post(endpoint)
        .set('content-type', 'application/json')
        .send({"name": name});
      res.should.have.status(201);
      res.body[0].should.have.property('id');
      
      res = await chai.request(server)
        .get(endpoint);
      res.should.have.status(200);
      res.body.length.should.be.eql(1)
      res.body[0].name.should.be.eql(name);
      res.body[0].status.should.be.eql(status);
    })
  });

  describe('POST', () => {

    it('should post  multiple games',  async () => {
      let nbrGames = 10;
      for (let i = 0; i < nbrGames; i++) {
        let name = "John vs Tom - test - " + i;
        const res = await chai.request(server)
          .post(endpoint)
          .set('content-type', 'application/json')
          .send({"name": name});
        res.should.have.status(201);
        res.body[0].should.have.property('id');
      }
      
      const res2 = await chai.request(server).get(endpoint);
      res2.should.have.status(200);
      res2.body.length.should.be.eql(nbrGames)
      res2.body[0].name.should.be.eql("John vs Tom - test - " + 0)
      res2.body[nbrGames - 1].name.should.be.eql("John vs Tom - test - " + (nbrGames - 1))
    })

    it('should respond by a bad request with an empty string', async () => {
      const name = "";
      const res = await chai.request(server)
        .post(endpoint)
        .set('content-type', 'application/json')
        .send({"name": name});
      res.should.have.status(400);
    })
  });

  describe('PATCH', () => {
    it('should edit one game status', async () => {
      // POST
      let status = "progress";
      let res = await chai.request(server)
        .post(endpoint)
        .set('content-type', 'application/json')
        .send({"name": "John vs Tom - test"});
      res.should.have.status(201);
      res.body[0].should.have.property('id');
      let idGame = res.body[0].id;
      status = "done"
      
      // PATCH
      res = await chai.request(server)
        .patch(endpointid + idGame)
        .set('content-type', 'application/json')
        .send({"status": status});
      res.should.have.status(200);

      // GET
      res = await chai.request(server)
        .get(endpoint);
      res.should.have.status(200);
      res.body.length.should.be.eql(1)
      res.body[0].status.should.be.eql(status);
    })

    it ('should response error 404 with a wrong id', async () => {
      // PATCH
      const status = "done";
      res = await chai.request(server)
        .patch(endpointid + 10)
        .set('content-type', 'application/json')
        .send({"status": status});
      res.should.have.status(404);
    })

    it ('should response error 400 with a wrong id', async () => {
      // PATCH
      const status = "done";
      res = await chai.request(server)
        .patch(endpointid + 'test-failed')
        .set('content-type', 'application/json')
        .send({"status": status});
      res.should.have.status(400);
    })

    it ('should response error 400 with a wrong status', async () => {
      // PATCH
      const status = "";
      res = await chai.request(server)
        .patch(endpointid + 10)
        .set('content-type', 'application/json')
        .send({"status": status});
      res.should.have.status(400);
    })
  });

  describe('DELETE', () => {

    it('should delete one game', async () => {
      // POST
      const name = "John vs Tom - test - delete";
      let res = await chai.request(server)
        .post(endpoint)
        .set('content-type', 'application/json')
        .send({"name": name});
      res.should.have.status(201);
      let idGame = res.body[0].id;

      // DELETE
      res = await chai.request(server)
        .delete(endpointid + idGame);
      res.should.have.status(200);

      // GET
      res = await chai.request(server)
        .get(endpoint);
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
    });

    it ('should response error 404 with a wrong status', async () => {
      // DELETE
      const status = "";
      res = await chai.request(server)
        .delete(endpointid + 10);
      res.should.have.status(404);
    })

    it ('should response error 400 with a wrong status', async () => {
      // DELETE
      const status = "";
      res = await chai.request(server)
        .delete(endpointid + "ThisIsNotANumber");
      res.should.have.status(400);
    })

  });

});