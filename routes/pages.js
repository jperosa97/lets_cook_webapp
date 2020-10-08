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

router.get('/login', (req, res) => {
   
    res.render('login');
});
// LOGOUT
router.get('/logout', (req,res)=>{
    //session destroy
    res.clearCookie('userID');
    res.redirect('/login');
  });
router.get('/profil', (req, res) => {
    res.render('profil')
});

module.exports = router;