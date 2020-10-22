const express = require('express');
const router = express.Router();


router.get('/',(req, res) =>{
    res.render('searchPages/index');
});
router.get('/search', (req, res) => {
    res.render('searchPages/search')
});

router.get('/shoppinglist',(req, res) =>{
    if (req.session.loggedin) {
        res.render('profil_login/shoppinglist', {name: req.session.username});
    }else {
		res.send('Please login to view this page!');
	}
	res.end();
});

router.get('/login', (req, res) => {
    res.render('profil_login/login');
});

router.get('/register',(req, res) =>{
    res.render('profil_login/register');
});

router.get('/saved',(req, res) =>{
    if (req.session.loggedin) {
        res.render('profil_login/saved', {name: req.session.username});
    }else {
		res.send('Please login to view this page!');
	}
	res.end();
});
   
router.get('/profil', (req, res) => {
    if (req.session.loggedin) {
        res.render('profil_login/profil', {name: req.session.username});
    }else {
		res.send('Please login to view this page!');
	}
	res.end();
});

router.get('/ueberUns', (req, res) => {
    res.render('profil_login/ueberUns')
});
// LOGOUT
router.get('/logout', (req,res)=>{
    //session destroy
    res.clearCookie('userID');
    res.redirect('/login');
  });
  
module.exports = router;