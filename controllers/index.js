// controllers/recipes.js
var express = require('express');

var router = express.Router();


// főoldalra átirányít
// app.get volt
router.get('/', function(req,res){
    res.render('index');
});

module.exports = router;