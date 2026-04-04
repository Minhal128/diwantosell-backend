"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'MISSING_GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'MISSING_GOOGLE_CLIENT_SECRET',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/users/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const email = emails && emails[0].value;
    try {
        let user = await User_1.default.findOne({
            $or: [{ googleId: id }, { email: email }]
        });
        if (user) {
            if (!user.googleId) {
                user.googleId = id;
                await user.save();
            }
            return done(null, user);
        }
        user = await User_1.default.create({
            name: displayName,
            email: email,
            googleId: id,
            kycStatus: 'none',
            balance: 0,
            // phone and password are now optional
        });
        done(null, user);
    }
    catch (err) {
        done(err, undefined);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.default.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
exports.default = passport_1.default;
