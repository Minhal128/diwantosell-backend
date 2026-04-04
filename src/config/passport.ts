import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'MISSING_GOOGLE_CLIENT_ID',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'MISSING_GOOGLE_CLIENT_SECRET',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/users/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            const { id, displayName, emails } = profile;
            const email = emails && emails[0].value;

            try {
                let user = await User.findOne({
                    $or: [{ googleId: id }, { email: email }]
                });

                if (user) {
                    if (!user.googleId) {
                        user.googleId = id;
                        await user.save();
                    }
                    return done(null, user);
                }

                user = await User.create({
                    name: displayName,
                    email: email,
                    googleId: id,
                    kycStatus: 'none',
                    balance: 0,
                    // phone and password are now optional
                });

                done(null, user);
            } catch (err) {
                done(err as Error, undefined);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
