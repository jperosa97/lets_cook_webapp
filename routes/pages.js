const express = require('express');
const router = express.Router();


router.get('/',(req, res) =>{
    res.render('index');
});
router.get('/search', (req, res) => {
    res.render('search')
});
router.get('/ueberUns', (req, res) => {
    res.render('ueberUns', {'cookie': cookie})
});
router.get('/register',(req, res) =>{
    res.render('register');
});

router.get('/favorite',(req, res) =>{
    if (req.session.loggedin) {
        res.render('favorite', {name: req.session.username});
    }else {
		res.send('Please login to view this page!');
	}
	res.end();
});
   

router.get('/shoppinglist',(req, res) =>{
    if (req.session.loggedin) {
        res.render('shoppinglist', {name: req.session.username});
    }else {
		res.send('Please login to view this page!');
	}
	res.end();
});
   
router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/profil', (req, res) => {
    if (req.session.loggedin) {
        res.render('profil', {name: req.session.username});
    }else {
		res.send('Please login to view this page!');
	}
	res.end();
});

// LOGOUT
router.get('/logout', (req,res)=>{
    //session destroy
    res.clearCookie('userID');
    res.redirect('/login');
  });
  
module.exports = router;