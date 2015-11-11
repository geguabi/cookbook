
var express = require('express');

var router = express.Router();


//Viewmodel réteg
var statusTexts = {
    'new': 'Új',
    'assigned': 'Hozzárendelve',
    'ready': 'Kész',
    'rejected': 'Elutasítva',
    'pending': 'Felfüggesztve',
};
var statusClasses = {
    'new': 'danger',
    'assigned': 'info',
    'ready': 'success',
    'rejected': 'default',
    'pending': 'warning',
};

function decorateErrors(errorContainer) {
    return errorContainer.map(function (e) {
        e.statusText = statusTexts[e.status];
        e.statusClass = statusClasses[e.status];
        return e;
    });
}


//hozzávalók végpont id alapján
/*router.get('/recipes/:id', function (req, res) {
    var id = req.params.id;
    console.log('GET YAY ID:'+id);
    req.app.models.recipe.findOne ({ id: id}).populate('comments').then(function (recipe) {
         res.render('/comments/list', {
        recipe : recipe,
    }); 
});
    
});*/



router.get('/recipes/:id', function(req, res) {
    var id = req.params.id;
    req.app.models.recipe.findOne({ id: id}).populate('comments').then(function (recipes) {
         console.log(recipes);
    res.render('comments/list', {
        recipes: recipes,
         }); 
    });
    
});

router.post('/recipes/:id', function(req, res) {
 var id = req.params.id;
 console.log('id: ',id);
 req.app.models.comment.create({
         text: req.body.hozzavalok,
          
         recipe: req.params.id
    })
    .then(function (comment) {
         req.flash('info', 'Megjegyzés sikeresen felvéve!');
         console.log(req.body);
         console.log('id:', id);
         res.redirect('/recipes/' + id);
    })
    .catch(function (err) {
         console.log(err);
    });
    console.log('req body hozzav:',req.body.hozzavalok);
});

/*
router.post('/recipes/:id', function (req, res) {
    // adatok ellenőrzése
   
    req.checkBody('hozzavalok', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
    // hibaüzenetek lekérdezése
    var validationErrors = req.validationErrors(true); 
    console.log(validationErrors);
    console.log(req.body);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/recipes/new');
        
    }
    else {
        // adatok elmentése, és hibalista megjelenítése
        var id = req.params.id;
        req.app.models.comment.create({
             text: req.body.hozzavalok,
             recipe: id
            })
        .then(function (comment) {
             req.flash('info', 'Megjegyzés sikeresen felvéve!');
             res.redirect('/recipes/:' + id);
        })
        .catch(function (err) {
         console.log(err);
});
        
        
    }
});
*/

module.exports = router;