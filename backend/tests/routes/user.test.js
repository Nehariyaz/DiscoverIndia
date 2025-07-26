const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const nodemailer = require('nodemailer');

const app = require('../index');
const User = require('../models/User');

const { expect } = chai;
chai.use(chaiHttp);

const recaptchaToken = 'dummy-token'; // reCAPTCHA bypassed in test mode

describe('Authentication Routes', () => {
  let testEmail;
  let testUser;
  let mailStub;
  let sendMailStub;

  before(async () => {
    // ✅ Separate stubs for createTransport & sendMail
    sendMailStub = sinon.stub().resolves({
      accepted: ['mock@example.com'],
      response: '250 OK',
    });

    mailStub = sinon.stub(nodemailer, 'createTransport').returns({
      sendMail: sendMailStub,
    });
  });

  beforeEach(async () => {
    testEmail = `user${Date.now()}@example.com`;
    testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      password: 'password123',
      recaptchaToken,
    };

    await User.deleteMany({});
    sendMailStub.resetHistory(); // Clear stub usage between tests
  });

  it('✔ should register a user', (done) => {
    chai
      .request(app)
      .post('/signup')
      .send(testUser)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('userId');
        done();
      });
  });

  it('✔ should log in with correct credentials', (done) => {
    chai
      .request(app)
      .post('/signup')
      .send(testUser)
      .end(() => {
        chai
          .request(app)
          .post('/login')
          .send({
            email: testUser.email,
            password: testUser.password,
            recaptchaToken,
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
            done();
          });
      });
  });

  it('✔ should reject login with wrong password', (done) => {
    chai
      .request(app)
      .post('/signup')
      .send(testUser)
      .end(() => {
        chai
          .request(app)
          .post('/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword',
            recaptchaToken,
          })
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error').that.includes('Invalid');
            done();
          });
      });
  });

  describe('Forgot Password Route', () => {
    beforeEach(async () => {
      await chai.request(app).post('/signup').send(testUser);
    });

    it('✔ should return success for registered email', (done) => {
      chai
        .request(app)
        .post('/forgot-password')
        .send({ email: testUser.email })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(sendMailStub.calledOnce).to.be.true;
          done();
        });
    });

    it('✔ should return generic message for unregistered email', (done) => {
      chai
        .request(app)
        .post('/forgot-password')
        .send({ email: 'nonexistingemail@example.com' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.include('receive a reset link');
          done();
        });
    });

    it('✔ should return 400 if email is missing', (done) => {
      chai
        .request(app)
        .post('/forgot-password')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('Reset Password Route', () => {
    let resetToken;

    beforeEach(async () => {
      await chai.request(app).post('/signup').send(testUser);
      const user = await User.findOne({ email: testUser.email });

      resetToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    });

    it('✔ should reset password with valid token', (done) => {
      chai
        .request(app)
        .post('/reset-password')
        .send({ token: resetToken, password: 'newPassword123' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.include('successful');
          done();
        });
    });

    it('✔ should return 400 for invalid token', (done) => {
      chai
        .request(app)
        .post('/reset-password')
        .send({ token: 'invalid.token.value', password: 'pass' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('✔ should return 400 if fields are missing', (done) => {
      chai
        .request(app)
        .post('/reset-password')
        .send({ password: 'somePass' }) // missing token
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('Duplicate Registration', () => {
    it('✔ should not allow registering with existing email', (done) => {
      chai
        .request(app)
        .post('/signup')
        .send(testUser)
        .end(() => {
          chai
            .request(app)
            .post('/signup')
            .send(testUser)
            .end((err, res) => {
              expect(res).to.have.status(409);
              expect(res.body.error).to.include('already exists');
              done();
            });
        });
    });
  });

  describe('Missing Required Fields', () => {
    it('✔ should return 400 if fields are missing in registration', (done) => {
      chai
        .request(app)
        .post('/signup')
        .send({ firstName: 'Only' }) // Missing fields
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('User Preferences', () => {
    it('✔ should save valid preferences', (done) => {
      chai
        .request(app)
        .post('/api/preferences')
        .send({
          userId: 'testUserId',
          travelType: 'adventure',
          duration: 7,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          done();
        });
    });

    it('✔ should reject invalid preferences', (done) => {
      chai
        .request(app)
        .post('/api/preferences')
        .send({ duration: 7 }) // Missing travelType and userId
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  after(async () => {
    mailStub.restore(); // restore transport
    await mongoose.connection.close();
  });
});
