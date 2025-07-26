const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/index');
chai.use(chaiHttp);

describe('Full User Workflow Integration', () => {
  it('Registers, logs in, sets preferences', (done) => {
    const email = `flowuser${Date.now()}@test.com`;
    chai.request(app).post('/signup').send({ firstName: 'A', lastName: 'B', email, password: 'pass123', recaptchaToken: 'dummy-token' })
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.request(app).post('/login').send({ email, password: 'pass123', recaptchaToken: 'dummy-token' })
          .end((err, res2) => {
            chai.expect(res2).to.have.status(200);
            const { userId } = res2.body;
            chai.request(app).post('/api/preferences').send({ userId, travelType: 'adventure', duration: 5 })
              .end((err, res3) => {
                chai.expect(res3).to.have.status(200);
                done();
              });
          });
      });
  });
});
