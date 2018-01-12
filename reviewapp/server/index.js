require('dotenv').config();
const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , massive = require('massive')
    , axios =require('axios');

//This is an alternative
// const{
//     AUTH_DOMAIN,
//     AUTH_CLIENTID,
//     AUTH_CLIENTSECRET,
//     AUTH_CALLBACK_URL,
//     CONNECTION_STRING
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
//Connect to the database 'db' folder
massive(process.env.CONNECTION_STRING).then((db) => {
    app.set('db', db);
})
//-------------------------------//

//Strategy
passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENTID,
    clientSecret: process.env.AUTH_CLIENTSECRET,
    callbackURL: process.env.AUTH_CALLBACK_URL,
    scope: 'openid profile'
}, function (accessToken, refreshToken, extraParams, profile, done) {

    let { displayName, user_id, picture } = profile;
    const db = app.get('db');

    db.find_user([user_id]).then((users) => {
        //if no object at position 0
        if (!users[0]) {
            db.create_user([
                displayName,
                'test@test.com',
                picture,
                user_id
            ]).then(user => {
                return done(null, user[0].id)
            })
        } else {
            return done(null, users[0].id)
        }
    })

}))
passport.serializeUser((id, done) => {
    return done(null, id)
})
//this block gets all the user info based on the user id.
passport.deserializeUser((id, done) => {
    app.get('db').find_session_user([id])
    .then((user)=> {
        return done(null, user[0]);
    })
})

//endpoints
app.get('/auth', passport.authenticate('auth0'))
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/#/private',
    failureRedirect: 'http://localhost:3000'
}))

app.get('/auth/me', (req, res) => {
    if(!req.user){
        res.status(404).send('User ot found');
    } else {
        res.status(200).send(req.user);
    }
})
app.get('/auth/logout', (req,res)=> {
    req.logOut();
    axios.get('/v2/logout/returnTo=LOGOUT_URL')
    res.redirect('http://localhost:3000')
})

//server port
const { SERVER_PORT } = process.env
app.listen(SERVER_PORT, () => {
    console.log(`Hey Fry, it's me port ${SERVER_PORT}`)
})