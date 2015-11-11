// controllers/recipe.js
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


router.get('/list', function (req, res) {
    req.app.models.recipe.find().then(function (errors) {
        console.log('receptek: ',errors);  // ilyen formátumban kapjuk vissza az adatokat
        //megjelenítés
        res.render('recipes/list', {
            errors: decorateErrors(errors),
            messages: req.flash('info')   // message kiolvasása a flash-en keresztül
        });
    });
    
});


router.get('/new', function(req,res){
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();

    res.render('recipes/new', {
        validationErrors: validationErrors,
        data: data,
    });
});





router.post('/new', function (req, res) {
    // adatok ellenőrzése
    req.checkBody('nev', 'Hibás név').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
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
        req.app.models.recipe.create({
            status: 'new',
            name: req.body.nev,
            description: req.body.leiras,
            pic: req.body.pic
        })
        .then(function (recipe) {
            //siker esetén
            req.flash('info', 'Recept sikeresen felvéve!');  // átirányítás előtt üzenetet nyomat még
            res.redirect('list'); // átirányít a lista oldalra
        })
        .catch(function (err) {
            //hiba esetén
            console.log(err);
        });
    }
});


module.exports = router;