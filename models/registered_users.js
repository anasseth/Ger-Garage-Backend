/*
Refer General Guide.txt for undetsandong base architecture
*/
const mongoose = require("mongoose");
bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

/*
for User Schema or Model. We use hash Password to encrypt password in hashed form
*/
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/*
password validation is done my comparing the password received from user
and hashed password from db
*/
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", userSchema);
