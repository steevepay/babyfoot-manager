let assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

const endpoint = '/api/v1/messages';
const endpointid = '/api/v1/messages/';

describe('Tchat API', () => {
  
  beforeEach('Setting up the tchat API - Cleaning the DB', (done) => {
    console.log('beforeEach');
    chai.request(server).delete(endpoint).end((err, res) => {
      done()
    });
  });

  describe('GET', () => {
    it('should get no messages, empty array.', (done) => {
      chai.request(server)
      .get(`${endpoint}?limit=10&page=1`)
      .end((err, res) => {
        assert(err === null);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });

    it('should post one message and get one message', async () => {
      let message = {
        name: 'John Wick',
        message: 'Hi there!'
      }
      let res = await chai.request(server)
        .post(endpoint)
        .set('content-type', 'application/json')
        .send(message);
      res.should.have.status(201);
      res.body[0].should.have.property('id');
      res.body[0].name.should.be.eql(message.name);
      res.body[0].message.should.be.eql(message.message);

      let res2 = await chai.request(server)
        .get(`${endpoint}?limit=1&page=1`);
      res2.should.have.status(200);
      res2.body.should.be.a('array');
      res2.body.length.should.be.eql(1);
      res2.body[0].name.should.be.eql(message.name);
    })
  });

  describe('POST', () => {

    it('should post multiple messages and get multiple message through pagination', async () => {

      // TEST POST MULTIPLE MESSAGES
      const nbrMessages = 20;
      for (let i = 0; i < nbrMessages; i++) {
        let message = {
          name: 'John Wick' + i,
          message: 'Hi there!' + i
        }
        let res = await chai.request(server)
          .post(endpoint)
          .set('content-type', 'application/json')
          .send(message);
        res.should.have.status(201);
        res.body[0].should.have.property('id');
        res.body[0].name.should.be.eql(message.name);
        res.body[0].message.should.be.eql(message.message);
      }

      // TEST GET MESSAGES THROUGH PAGINATION
      const res2 = await chai.request(server).get(`${endpoint}?limit=10&page=1`);
      res2.should.have.status(200);
      res2.body.length.should.be.eql(10)
      const res3 = await chai.request(server).get(`${endpoint}?limit=10&page=2`);
      res3.should.have.status(200);
      res3.body.length.should.be.eql(10)
      expect(res2.body[0].id > res2.body[9].id);
      expect(res3.body[0].id > res3.body[9].id);
      expect(res2.body[9].id > res3.body[0].id);      
    })

    it('should respond by a bad request with an empty name', async () => {
      let message = {
        name: '',
        message: 'Hi there!'
      }
      let res = await chai.request(server)
        .post(endpoint)
        .set('content-type', 'application/json')
        .send(message);
      res.should.have.status(400);
    })

    it('should respond by a bad request with an empty message', async () => {
      let message = {
        name: 'John Wick',
        message: ''
      }
      let res = await chai.request(server)
        .post(endpoint)
        .set('content-type', 'application/json')
        .send(message);
      res.should.have.status(400);
    })
  });

})