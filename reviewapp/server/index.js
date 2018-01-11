require('dotenv').config();
const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0');

//This is an alternative
// const{
//     AUTH_DOMAIN,
//     AUTH_CLIENTID,
//     AUTH_CLIENTSECRET,
//     AUTH_CALLBACK_URL
// } = process.env

const app = express();
app.use(bodyParser.json());

//set up the 3 components for auth
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true

}))
app.use(passport.initialize());
app.use(passport.session())
//-------------------------------//

//Strategy
passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENTID,
    clientSecret: process.env.AUTH_CLIENTSECRET,
    callbackURL: process.env.AUTH_CALLBACK_URL,
    scope: 'openid profile'
}, function (accessToken, refreshToken, extraParams, profile, done) {
    console.log(profile);
    return done(null, profile);
}))
passport.serializeUser((profile, done) => {
    done(null, profile)
})
passport.deserializeUser((profile, done) => {
    done(null, profile)
})

//endpoints
app.get('/auth', passport.authenticate('auth0'))
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: '/auth'
}))

const { SERVER_PORT } = process.env
app.listen(SERVER_PORT, () => {
    console.log(`Sup? It's me port ${SERVER_PORT}`)
})