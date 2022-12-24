const localStratedgy = require('passport-local').Strategy;
const bcrypt = require("bcrypt")


function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {

        try {
            const user = (await getUserByEmail(email))[0]
            if (user == null) {
                return done(null, false, { message: "No user with that email" })
            }
            // console.log(user)
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Password incorrect" })
            }
        } catch (e) {
            console.log(e.message)
            return done(e)
        }
    }
    passport.use(new localStratedgy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) =>{console.log("serialize");console.log(user); return done(null, user._id)})
    passport.deserializeUser(async (id, done) => {
        console.log("deserialize");
        console.log(id)
        let uui;
        await getUserById(id).then((data)=>{
            uui=data;
            console.log("uui")
            console.log(uui)
        })
        
        return done(null, uui)
    })
}

module.exports = initialize