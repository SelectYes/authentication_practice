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
    useFindAndModify: false
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

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                              ROUTES                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res)  => {
    res.render('home');
});

app.get('/secret', (req, res) => {
    res.render('secret');
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                              AUTH-ROUTES                                             //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', (req, res) => {
    res.render('register')
});

app.listen(port, () => console.log(`Serving Authentication Demo on localhost:${port}`));