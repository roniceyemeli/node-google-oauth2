const express = require('express');
const session = require('express-session')
const passport = require('passport');
require('./Auth');


const app = express();

const isLoggedIn = (req, res, next) =>{
    req.user ?  next() : res.sendStatus(401)
}

app.use(session({secret: 'cats',resave: false, saveUninitialized: true  }));
app.use(passport.initialize());
app.use(passport.session());
 

app.get('/', (req, res) => {
	res.send('<a href="/auth/google">Login with google</a>');
});

app.get('/auth/google', passport.authenticate('google', {scope:['email', 'profile']}));

app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/locked',
    failureRedirect: '/auth/failure'
}))

app.get('/locked', isLoggedIn, (req, res) => {    
	res.send(`hello ${req.user.displayName} you are authenticated !`);
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
	res.send('you logged out :) ');
});

app.get('/auth/google/failure', (req, res) => {
    res.send('authentification failed...');
})

const PORT = 5000 | process.env.PORT;

app.listen(PORT, console.log(`app is listenning on port ${PORT}`));
