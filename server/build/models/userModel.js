"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const index_1 = require("../constants/index");
const { Schema } = mongoose_1.default;
const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email"],
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
                return /^[A-z][A-z0-9-_]{3,23}$/.test(value);
            },
            message: `username must be alphanumeric, without special characters. Hyphens and underscores are allowed.`,
        },
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate: [
            validator_1.default.isAlphanumeric,
            "First Name can only have Alphanumeric values. No special characters allowed.",
        ],
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: [
            validator_1.default.isAlphanumeric,
            "First Name can only have Alphanumeric values. No special characters allowed.",
        ],
    },
    password: {
        type: String,
        select: false,
        validate: [
            validator_1.default.isStrongPassword,
            "Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol.",
        ],
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function (value) {
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
    phoneNumber: {
        type: String,
        default: "+31612345678",
        validate: [
            validator_1.default.isMobilePhone,
            "Your mobile phone number must begin with a '+', followed by your  country code then actual number e.g +31612345678",
        ],
    },
    address: String,
    city: String,
    country: String,
    passwordChangedAt: Date,
    roles: {
        type: [String],
        default: [index_1.USER],
    },
    active: {
        type: Boolean,
        default: true,
    },
    refreshToken: [String],
    methods: {},
}, {
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    if (this.roles.length === 0) {
        this.roles.push(index_1.USER);
        return next();
    }
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcrypt_1.default.genSalt(10);
    this.password = await bcrypt_1.default.hash(this.password || "", salt);
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
userSchema.methods.comparePassword = async function (givenPassword) {
    return await bcrypt_1.default.compare(givenPassword, this.password);
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map