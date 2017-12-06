const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  username: { type: String },
  email: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  password: {type: String}
});
