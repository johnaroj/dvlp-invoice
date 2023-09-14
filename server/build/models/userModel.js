"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const index_js_1 = require("../constants/index.js");
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
            validator: (username) => {
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
    phoneNumnber: {
        type: String,
        default: "+31223456789",
        validate: [
            validator_1.default.isMobilePhone,
            "Your mobile phone number must begin with a '+', followed by your country code, followed by your country code then actual phone number. For example: +31223456789",
        ],
    },
    address: String,
    city: String,
    country: String,
    passwordChangedAt: Date,
    roles: {
        type: [String],
        default: [index_js_1.USER],
    },
    active: {
        type: Boolean,
        default: true,
    },
    refreshToken: [String],
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.roles.length === 0) {
            this.roles.push(index_js_1.USER);
            return next();
        }
    });
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        const salt = yield bcrypt_1.default.genSalt(10);
        this.password = yield bcrypt_1.default.hash(this.password || "", salt);
        this.passwordConfirm = undefined;
        next();
    });
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password") || this.isNew) {
            return next();
        }
        this.passwordChangedAt = new Date(Date.now());
        next();
    });
});
userSchema.methods.comparePassword = function (givenPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, this.password);
    });
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
