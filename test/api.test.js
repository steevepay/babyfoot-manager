var assert = require('assert');

// when async, utilise done()

describe('Babyfoot Manager API', () => {
  
  beforeEach('Setting up the userList', function(){
    console.log('beforeEach');
    loginController.loadUserList(['abc123','xyz321']);
  });

  describe('GET', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });

  describe('GET', () => {
    
  });
});