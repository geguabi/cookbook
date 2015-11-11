// modulok importálása
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');


var Waterline = require('waterline');
var waterlineConfig = require('./config/waterline');
//var errorCollection = require('./models/error');
var recipeCollection = require('./models/recipe');
var userCollection = require('./models/user');
var commentCollection = require('./models/comment');

var indexRouter = require('./controllers/index');
//var errorRouter = require('./controllers/errors');
var recipeRouter = require('./controllers/recipes');
var commentRouter = require('./controllers/comments');
var loginRouter = require('./controllers/login')





var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// ----------------------------------------------------
var hbs = require('hbs');

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});
// -----------------------------------------------------


// passport
// berakom usert a sessionbe
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Regisztrációs stratégia
passport.use('local-signup', new LocalStrategy({
        // username-t a neptun alatt találja meg
        usernameField: 'neptun',
        passwordField: 'password',
        passReqToCallback: true,
    },   
    function(req, neptun, password, done) {
        // megadott neptunkód alapján keres
        req.app.models.user.findOne({ neptun: neptun }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, { message: 'Létező felhasználónév' });
            }
            req.app.models.user.create(req.body)
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            })
        });
    }
));

// Login stratégia
passport.use('local', new LocalStrategy({
        usernameField: 'neptun',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, neptun, password, done) {
        req.app.models.user.findOne({ neptun: neptun }, function(err, user) {
            if (err) { return done(err); }
            // ha a password-on elhasal, akkor visszadobja
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Helytelen adatok.' });
            }
            return done(null, user);
        });
    }
));

// Middleware segédfüggvény
// Middleware-t definiál
function setLocalsForLayout() {
    return function (req, res, next) {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    }
}

// Benéz a requestbe
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

// szerepkör ellenőrzéséhez
function andRestrictTo(role) {
    return function(req, res, next) {
        if (req.user.role == role) {
            next();
        } else {
            next(new Error('Unauthorized'));
        }
    }
}


var app = express();


// config
// views mappa, hbs használata
app.set('views', './views');
app.set('view engine', 'hbs')


// middleware
// statikus kiszolgáláshoz kell, a public mappában keresi a neki megfelelő fájlt
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    cookie: {maxAge: 600000},
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));



app.use(flash());


//Passport middlewares
app.use(passport.initialize());

//Session esetén (opcionális)
app.use(passport.session());


app.use(setLocalsForLayout());

// endpoint

//app.use('/errors', errorRouter);
//app.use('/errors', ensureAuthenticated, errorRouter);
app.use('/recipes',ensureAuthenticated, recipeRouter);
app.use('/recipes/:id', commentRouter);
app.use('/login', loginRouter);
app.use('/', indexRouter);



// logout-hoz
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// operátor elérheti a végpontokat
app.get('/operator', ensureAuthenticated, andRestrictTo('operator'), function(req, res, next) {
    res.end('operator');
    next();
});


app.get('/recipes/:id', function(req, res) {
    var id = req.params.id;
    var sId = id;
    while(sId.charAt(0) === ':')
        sId = sId.substr(1);
   
    app.models.recipe.findOne({ id: sId}).populate('comments').then(function (recipes) {
         
    res.render('comments/list', {
        recipes: recipes,
      
         }); 
    });

});

function strToArray(str) {
    
    return str.split(",");
}
function cleanId(id) {
    while(id.charAt(0) === ':')
    id = id.substr(1);
    return id;
}

app.post('/recipes/:id', function(req, res, done) {
 var id = req.params.id;
 

 
 
 req.app.models.comment.create({
         text: strToArray(req.body.hozzavalok),
         making: req.body.making,
         recipe: cleanId(id),
         username: req.session.username
    })
    .then(function (comment) {
         req.flash('info', 'Megjegyzés sikeresen felvéve!');
         console.log(req.body);
         
         res.redirect('/recipes/' + id);
          return done(null, comment);
    })
    .catch(function (err) {
         console.log(err);
    });
   
});

app.get('/delete:id', function(req, res) {
    var id = req.params.id;
    
    
    
    app.models.recipe.destroy({ id: cleanId(id) }, function() {
    
    req.flash('info', 'Recept sikeresen törölve!');  
    res.redirect('recipes/list'); // átirányít a lista oldalra
  });
    
});

app.get('/update:id', function(req, res) {
    var id = req.params.id;
    
     app.models.recipe.findOne({ id: cleanId(id)}).then(function (recipesU) {
         
    res.render('recipes/update', {
        recipesU: recipesU,
        messages: req.flash('info')
         }); 
    });
   
    
  });

app.post('/update:id', function(req, res) {
     var id = req.params.id;
    
    var dateNow = new Date();
    
    app.models.recipe.update({ id: cleanId(id) },{name: req.body.nev,description: req.body.leiras,pic:req.body.pic,date: dateNow }, req.body, function(model) {
            
    
        })
        .then(function (recipe) {
            //siker esetén
            req.flash('info', 'Recept sikeresen módosítva!');  // átirányítás előtt üzenetet nyomat még
            res.redirect('recipes/list'); // átirányít a lista oldalra
        })
        .catch(function (err) {
            //hiba esetén
            console.log(err);
        });
    
});    


// ORM példány
var orm = new Waterline();



// betölti az ORM-be, a recipeCollection-t
orm.loadCollection(Waterline.Collection.extend(recipeCollection));
orm.loadCollection(Waterline.Collection.extend(userCollection));
orm.loadCollection(Waterline.Collection.extend(commentCollection));

// ORM indítása
// ha nem sikerül az inicializálás, akkor nem is indítja el a szervert
orm.initialize(waterlineConfig, function(err, models) {
    if(err) throw err;
    
    app.models = models.collections;
    app.connections = models.connections;
    
    // Start Server
    var port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('Server is started.');
    });
    
    console.log("ORM is started.");
});