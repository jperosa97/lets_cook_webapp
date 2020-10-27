const express = require('express');
const router = express.Router();

//Index File anzeigen lassen 
router.get('/',(req, res) =>{
    res.render('searchPages/index');
});

//Search File anzeigen lassen 
router.get('/search', (req, res) => {
    res.render('searchPages/search')
});

//Shoppinglist File anzeigen lassen 
router.get('/shoppinglist',(req, res) =>{
    if (req.session.loggedin) {
        res.render('profil_login/shoppinglist', {name: req.session.username});
    }else {
		res.send('Please login to view this page!');
	}
	res.end();
});

//Login File anzeigen lassen  
router.get('/login', (req, res) => {
    res.render('profil_login/login');
});

//Registration File anzeigen lassen 
router.get('/register',(req, res) =>{
    res.render('profil_login/register');
});

//Saved File anzeigen lassen 
router.get('/saved',(req, res) =>{
    if (req.session.loggedin) {
        res.render('profil_login/saved', {name: req.session.username});
    }else {
		res.send('Please login to view this page!');
	}
	res.end();
});


//Profil File anzeigen lassen 
router.get('/profil', (req, res) => {
    if (req.session.loggedin) {
        res.render('profil_login/profil', {name: req.session.username});
    }else {
		res.send('Please login to view this page!');
	}
	res.end();
});


//Über uns File anzeigen lassen 
router.get('/ueberUns', (req, res) => {
    res.render('profil_login/ueberUns')
});
// LOGOUT ausführen
router.get('/logout', (req,res)=>{
    //session destroy
    res.clearCookie('userID');
    res.redirect('/login');
  });
  
module.exports = router;