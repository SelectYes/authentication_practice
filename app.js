//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                              CONFIG                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const express =                 require('express');
const app =                     express();
const mongoose =                require('mongoose');
const passport =                require('passport');
const LocalStrategy =           require('passport-local');
const passportLocalMongoose =   require('passport-local-mongoose');
const User =                    require('./models/user');
const port =                    3000;


mongoose.connect('mongodb://localhost:27017/auth_demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => console.log('CONNECTED TO DB.'))
.catch(error => console.log(error.message));

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(require('express-session')({
    secret: 'Benny is the best and cutest dog in the world',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// MIDDLEWARE FOR LOGGING OUT OF SESSION
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                              ROUTES                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res)  => {
    res.render('home');
});

app.get('/secret', isLoggedIn, (req, res) => {
    res.render('secret');
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                       AUTHENTICATION-ROUTES                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// SIGN-UP ROUTES

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', async (req, res) => {
    try {
        await User.register(new User({username: req.body.username}), req.body.password)
        passport.authenticate('local')(req, res, () => {
            res.redirect('/secret');
        })
    } catch (error) {
        console.log(error);
        return res.render('register')
    }
});

// SIGN-IN/OUT ROUTES

app.get('/login', (req, res) => {
    res.render('login')
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), (req, res) => {

});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


app.listen(port, () => console.log(`Serving Authentication Demo on localhost:${port}`));