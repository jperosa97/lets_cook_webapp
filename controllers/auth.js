const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const db = require('../database/db'); //Der Datenbank Ordner verlinkt

//USERNAME : WDD319
//PASSWORD: 1234

//Login script 
exports.login = async(req,res)=> {
      try {
        const {username, password} = req.body;
        let cookie = req.cookies.userID ? req.cookies.userID : '';
        if(!username || !password){
            return res.status(400).render('profil_login/login', {
                'message': ' Please provide an username and password' //wenn die Felder leer sind
            })
        }
        //Überprüft ob der username mit dem Paaswort in der Datenbank existiert
        db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
            req.session.loggedin = true;
			req.session.username = username;
            if ( !results || !(await bcrypt.compare(password, results[0].password) )){
            res.status(401).render('profil_login/login', {
                'message': 'Username or Password is incorrect' //Wenn dass Passwort oder der username falsch ist
            })
        } else {
            //Wenn es existiert, speichert es die Zeit wann er eingeloggt ist
            const id = results[0].id;

            const token = jwt.sign({id}, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            console.log("The token is:" + token)

            const cookieOptions = {
                expires: new Date (
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            }

            res.cookie('jwt', token, cookieOptions);
            res.status(200).redirect("/profil");
        }
  })
  }catch (error) {
    console.log(error);
  }
}
//Registration script 
exports.register = (req, res) => {
    console.log(req.body);

   const { username, email, password, passwordConform} = req.body;
    //Überprüft ob die email nicht in der Datenbank ist
   db.query('SELECT email From users WHERE email = ?', [email], async(error, results) =>{
       if(error){
           console.log(error);
       }
       if(results.length > 0) {
           return res.render('profil/register', {
               'message': 'That email has already in use' //Diese email ist schon in der Datenbank
           })
           //überprüft ob die Passwörter gleich sind
        }else if (password !== passwordConform){
            return res.render('register', {
                'message': 'Password sind nicht gleich' //Die Passwörter sind nicht gleich
            })
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        //Speichert die Daten in der Datenbank
        db.query('INSERT INTO users SET ?', {username: username, email: email, password: hashedPassword}, (error, result) =>{
            if(error) {
                console.log(error);
            } else{
                console.log(results);
                return res.render('profil_login/register', {
                    'message': 'User registered' //User ist jetzt registriert
                })
            }
        })
   });
}