const { expect } = require('chai');
const mongoose = require('mongoose');
const User = require('../../src/models/User');

describe('User Model Schema', () => {
  before(async () => {
    await mongoose.connect(process.env.DB_URI, {});
  });
  after(async () => {
    await mongoose.connection.close();
  });

  it('should not save without required fields', async () => {
    try {
      const user = new User({}); // Missing required fields
      await user.save();
    } catch (err) {
      expect(err).to.be.an('error');
      expect(err.errors).to.have.property('email');
    }
  });

  it('should save a valid user', async () => {
    const user = new User({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'hashedPass',
    });
    const savedUser = await user.save();
    expect(savedUser._id).to.exist;
    expect(savedUser.email).to.equal('jane@example.com');
  });
});
