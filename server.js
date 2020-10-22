const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const superagent = require('superagent');
const pg = require('pg');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const app = express();

dotenv.config({ path: './.env'});

const db = require('./database/db.js');
const client = new pg.Client(process.env.DATABASE_URL);

const apiKey = 'd2ffe67642074c13a6e8391bd4a4c0f8';

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static('public'))

app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended:true}));

//Routes
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.set('view engine', 'ejs')
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.post('/breakfast', breakfastSearch);
app.post('/appetizer', appetizerSearch);
app.post('/mainCourse', mainCourseSearch);
app.post('/italien_food', italienSearch);
app.post('/indian_food', indianSearch);
app.post('/american_food', americanSearch);
app.post('/greek_food', greekSearch);
app.post('/japan_food', japanSearch);
app.post('/mexican_food', mexicanSearch);
app.post('/spain_food', spainSearch);
app.post('/thai_food', thaiSearch);
app.post('/dessert', dessertSearch);
app.post('/result', createSearch);
app.get('/recipe/:id', getRecipe);
app.post('/recipe/:id', saveRecipe);
app.delete('/recipe/:id', deleteRecipe);
app.get('/random', randomRecipe);
app.get('/saved', getSaved);



function Result(result){
  this.recipe_id = result.id;
  this.image_url = `https://spoonacular.com/recipeImages/${result.id}-312x231.jpg`;
  this.name = result.title;
}
function Recipe(data, id){
  this.recipe_id = id;
  this.name = data.title;
  this.image = data.image;
  this.time = data.readyInMinutes;
  this.servings = data.servings;
  this.rating = data.spoonacularScore;
  this.source = data.sourceUrl;
  this.ingredients = data.extendedIngredients;
  this.steps = data.analyzedInstructions[0] ? data.analyzedInstructions[0].steps : [{'number': 0, 'step': 'Instructions Unavailable'}];
}
function handleError(error, response) {
  response.status(error.status || 500).send(error.message);
}

//schnelle breakfast rezepte suchen
function breakfastSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&type=breakfast&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/breakfast', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};

//schnelle Abendessen rezepte suchen
function mainCourseSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&type=main course&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/mainCourse', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};

//schnelle Apero rezepte suchen
function appetizerSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&type=appetizer&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/appetizer', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};

//schnelle dessert rezepte suchen
function dessertSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&type=dessert&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/dessert', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};

//schnelle italienische rezepte suchen
function italienSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&cuisine=Italian&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/italien_food', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};
//schnelle indische rezepte suchen
function indianSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&cuisine=Indian&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/indian_food', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};
//schnelle americanische rezepte suchen
function americanSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&cuisine=American&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/america_food', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};

//schnelle griechische rezepte suchen
function greekSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&cuisine=Greek&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/greek_food', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};

//schnelle japanische rezepte suchen
function japanSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&cuisine=Japanese&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/japan_food', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};
//schnelle mexicanische rezepte suchen
function mexicanSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&cuisine=Mexican&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/mexican_food', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};
//schnelle spanische rezepte suchen
function spainSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&cuisine=Spanish&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/spain_food', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};
//schnelle thailändische rezepte suchen
function thaiSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&cuisine=Thai&apiKey=${apiKey}`;

  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/thai_food', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};

//Rezepte suchen mit jeweilligen Däten oder auch Allergien
function createSearch(req, res) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?number=12&apiKey=${apiKey}&query=${req.body.search}`;

  if(req.body.dairyIntolerance){
    url = `${url}&excludeIngredients=dairy`;
  }
  if(req.body.glutenIntolerance){
    url = `${url}&intolerances=gluten`;
  }
  if(req.body.paleoIntolerance){
    url = `${url}&diet=paleo`;
  }
  if(req.body.veganIntolerance){
    url = `${url}&diet=vegan`;
  }
  if(req.body.vegetarianIntolerance){
    url = `${url}&diet=vegetarian`;
  }
  if(req.body.pescatarianIntolerance){
    url = `${url}&diet=pescatarian`;
  }
  superagent.get(url)
  .then(searchResults => searchResults.body.results.map(result => new Result(result)))
  .then(results => {
   let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.render('searchPages/result', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};

//Rezept Informationen (Wie lange, Zutaten, original Rezept Webseite)
function getRecipe(req, res) {
  let url = `https://api.spoonacular.com/recipes/informationBulk?ids=${req.params.id}&apiKey=${apiKey}`;
  let userID = req.cookies.userID ? parseInt(req.cookies.userID) : -1;
  let SQL = `SELECT COUNT(recipe_id) FROM recipes WHERE user_id = ${userID} AND recipe_id = ${req.params.id};`;
  let recipeSaved = 0;

  client.query(SQL)
    .then(result => {
      recipeSaved = parseInt(result.rows[0].count);
    })
    .then(
      superagent.get(url)
        .then(recipe => {
          return new Recipe(recipe.body[0], req.params.id);
        })
        .then(result => {
          if (recipeSaved > 0) {
            let cookie = req.cookies.userID ? req.cookies.userID : '';
            res.render('searchPages/recipe_details', {details: result, 'cookie': cookie, saved: true});
          }
          else {
            let cookie = req.cookies.userID ? req.cookies.userID : '';
            res.render('searchPages/recipe_details', {details: result, 'cookie': cookie, saved: false});
          }
        })
    )
    .catch(error => handleError(error, res));
}

function saveRecipe(req, res) {
  let {name, image_url, time, servings} = req.body;
  let userID = parseInt(req.cookies.userID);

  let SQL = 'INSERT INTO recipes(recipe_id, image, name, time, servings, user_id, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7);';
  let values = [req.params.id, image_url, name, time, servings, userID, Date.now()];

  if(isNaN(userID)) {
    res.render('profil_login/login', {'message': 'You must be signed in to save recipes.', 'cookie': ''})
  }
  else {
    client.query(SQL, values)
      .then(() => {
        res.redirect(`/saved`);
      })
      .catch(error => handleError(error, res));
  }
}

function deleteRecipe(req, res) {
  let userID = parseInt(req.cookies.userID);
  let SQL = `DELETE FROM recipes WHERE user_id = ${userID} AND recipe_id = ${req.params.id};`;

  client.query(SQL)
    .then(result => res.redirect('/saved'))
    .catch(error => handleError(error, res));
}

function getSaved(req, res) {
  let userID = parseInt(req.cookies.userID);
  let cookie = req.cookies.userID ? req.cookies.userID : '';

  if (!userID) {
    res.render('profil_login/login', {'message': 'Sign In to Save Recipes', 'cookie': cookie, 'savedResults': ''});
  }
  else {
    let SQL = `SELECT recipe_id, image, name, time, servings FROM recipes WHERE user_id = ${userID} ORDER BY timestamp;`;
    client.query(SQL)
      .then(results => {
        if (results.rows[0]) {
          res.render('profil_login/saved', {'savedResults': results.rows, 'cookie': cookie});
        }
        else {
          res.render('profil_login/saved', {'savedResults': '', 'cookie': cookie});
        }
      });
  }
}
//Random Rezepte bekommen
function randomRecipe(req, res) {
  let url =  `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`;

  superagent.get(url).then(recipe => {
    let randomRecipe = new Recipe(recipe.body.recipes[0], recipe.body.recipes[0].id);
    let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.redirect(`/recipe/${recipe.body.recipes[0].id}`);
  }).catch(error => handleError(error));
}

//Mit dem Server verbinden
app.listen(3000, () => {
  console.log('server is running')
})