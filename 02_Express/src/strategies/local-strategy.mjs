import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { users } from '../utilities/constants.mjs';  // import users data from arrays
import { user } from '../mongoose/schemas/user.mjs';  // import user schema from mongoose
import { comparePassword } from '../utilities/helpers.mjs';

/*
 * passport.serializeUser function is used to determine which data of the user object should be stored in the session. 
 * The result of the serializeUser method is attached to the session,
 * 'user' is the user object that is being authenticated. This object typically comes from the authentication process (e.g., after a successful login).
 * 'done' is a callback function provided by Passport.js. It should be called when you're finished serializing the user.
 * 'done(null, user.id)' is to tell Passport to store the user's ID in the session. The null parameter indicates that there were no errors.
 * 
 */
passport.serializeUser((user, done) => {
    console.log('inside serializeUser');
    console.log(`user: ${user}`);
    done(null, user.id);
});


/*
 * passport.deserializeUser function is used to retrieve the user information from the session store. 
 * The result of the deserializeUser method is attached to the 'req.user' property of the request object,
 * 'id' is the user ID that was stored in the session by serializeUser
 * 'done' is a callback function provided by Passport.js. It should be called when you're finished deserializing the user.
 * 'done(null, user)' is to pass the user object back to Passport. The null parameter indicates that there were no errors.
 */
passport.deserializeUser(async (id, done) => {
    console.log('inside deserializeUser');  
    console.log(`id: ${id}`);
    // const finduser = users.find(u => u.id === id); // find user by id in the array of users
    const finduser = await user.findById(id); // find user by id in the mongoose database
    done(null, finduser);
});


/*
 * passport.use function is used to set the local strategy for passport. 
 * The localStrategy is used to authenticate users based on a username and password.
 * the result of the local strategy function is attached to the 'req.user' property of the request object.
 * The 'new localStrategy' function is used to create a new instance of the local strategy.
 * The 'usernameField' parameter is used to specify the field in the user object that contains the username.
 * The 'passwordField' parameter is used to specify the field in the user object that contains the password.
 * The 'done' parameter is a callback function provided by Passport.js. It should be called when you're finished configuring the strategy.
 * 'done(null, user)' is called to pass the authenticated user object back to Passport. The null parameter indicates that there were no errors.
 * 'done(error, null)' is called if there was an error during the verification process.
 */
passport.use(
    new localStrategy({usernameField: "email"},async (username, password, done) => {
        // set to use our localStrategy
        console.log("localStrategy");
        console.log(`email: ${username}`);
        console.log(`password: ${password}`);
        try {
            // const finduser = users.find((u) => u.email === username); // find user by email in the array of users
            const finduser = await user.findOne({email: username}); // find user by email in the mongoose database 
            if (!finduser) throw new Error("User not found");
            if ( !comparePassword(password, finduser.password) ) {
                throw new Error("Invalid Credentials");
            }
            console.log(finduser);
            done(null, finduser); // 
        } catch (error) {
            done(error,null);
         }
    })
);


/*
 * Workflow of passport authentication
 * 1. User enters email and password
 * 2. passport.authenticate function is called with the local strategy && calls the localStrategy function
 * 3. The email and password are extracted and passed to the localStrategy function.
 * 4. localStrategy is perform authentication and returns a user object if successful.
 * 5. The user object is attached to the request object as 'req.user'.
 * 6. After successful authentication, Passport calls the serializeUser function to determine what user data should be stored in the session.
 * 7. The result of the serializeUser method is attached to the session,
 * 8. For every subsequent request, Passport checks if the user is authenticated by verifying the session.
 * 9. If the user is authenticated, Passport calls the deserializeUser function to retrieve the user object from the session.
 * 10. The result of the deserializeUser method is attached to the request object as 'req.user',
 * 11. The server can now handle the request as an authenticated user, allowing access to protected routes and resources.
 * 
 */