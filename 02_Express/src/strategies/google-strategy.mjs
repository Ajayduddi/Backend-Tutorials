import { Strategy as googleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import 'dotenv/config';
import { googleUser } from '../mongoose/schemas/google-user.mjs';
import { user } from '../mongoose/schemas/user.mjs';


passport.serializeUser((user, done) => {
    console.log('inside serializeUser');
    console.log(`user: ${user}`);
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    console.log('inside deserializeUser');
    console.log(`id: ${id}`);
    try {
        const finduser = await googleUser.findById(id); // find user by id in the mongoose database
        if (finduser && finduser.googleid) {
            done(null, finduser);
        } 
        else {
            const finduser = await user.findById(id); // find user by id in the mongoose database
            finduser ? done(null, finduser) : done(null, null);
        }
    } catch (error) {
        done(error, null);
    }
});


passport.use(
    new googleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.REDIRECT_URL,
        scope: ['profile'],
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('inside googleStrategy');
        let finduser;
        try {
            finduser = await googleUser.findOne({ googleid: profile.id });
            finduser ? done(null, finduser) : done(null, null);
        } catch (error) {
            done(error, null);
        }
        try {
            if (!finduser) {
                const newuser = new googleUser({
                    googleid: profile.id,
                    name: profile.displayName,
                    // email: profile.email,
                });
                await newuser.save();
                done(null, newuser);
            }
        } catch (error) {
            done(error, null);
        }
    })
);
