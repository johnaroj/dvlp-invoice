import bcrypt from "bcrypt";
import "dotenv/config";
import mongoose from "mongoose";
import validator from "validator";
import { USER } from "../constants/index";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (username: string) => {
          return /^[A-z][A-Z0-9-_]{3,23}$/.test(username);
        },
        message: `username must be alphanumeric, without special characters. Hypens and underscores are allowed.`,
      },
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      validate: [
        validator.isAlphanumeric,
        "First Name can only have Alphanumeric values. No special characters allowed.",
      ],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      validate: [
        validator.isAlphanumeric,
        "First Name can only have Alphanumeric values. No special characters allowed.",
      ],
    },
    password: {
      type: String,
      select: false,
      validate: [
        validator.isStrongPassword,
        "Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol.",
      ],
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (this: any, value: string) {
          return value === this.password;
        },
        message: "Passwords do not match.",
      },
    },
    isEmailVerified: {
      type: Boolean,
      require: true,
      default: false,
    },
    provider: {
      type: String,
      required: true,
      default: "email",
    },
    googleID: String,
    avatar: String,
    businessName: String,
    phoneNumnber: {
      type: String,
      default: "+31223456789",
      validate: [
        validator.isMobilePhone,
        "Your mobile phone number must begin with a '+', followed by your country code, followed by your country code then actual phone number. For example: +31223456789",
      ],
    },
    address: String,
    city: String,
    country: String,
    passwordChangedAt: Date,
    roles: {
      type: [String],
      default: [USER],
    },
    active: {
      type: Boolean,
      default: true,
    },
    refreshToken: [String],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.roles.length === 0) {
    this.roles.push(USER);
    return next();
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password || "", salt);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = new Date(Date.now());
  next();
});

userSchema.methods.comparePassword = async function (givenPassword: any) {
  return await bcrypt.compare(givenPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
