import { Schema, model } from "mongoose";
import { isEmail, isMobilePhone } from 'validator';

const PasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~`!@#$%^&*()\-_=+\\|[\]{};:'",<.>/?]).{6,}$/;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "User already exists"],
    validate: {
      validator: isEmail,
      message: 'Invalid email address'
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  domainName: {
    type: String,
    required: [true, "Domain Name is required"],
  },
  hostedZoneId: {
    type: String,
    required: [true, "Hosted Zone Id is required"],
  },
  refreshToken: {
    type: String,
  }
});

export const UserModel = model("User", UserSchema);
