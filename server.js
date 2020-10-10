const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const superagent = require('superagent');
const cookieParser = require('cookie-parser');
const app = express();

dotenv.config({ path: './.env'});

const db = require('./database/db');
const apiKey = 'd2ffe67642074c13a6e8391bd4a4c0f8';

app.use(express.static('public'))

app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended:true}));

//Routes
app.set('view engine', 'ejs')
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

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
    res.render('result.ejs', {searchResults: results, 'cookie': cookie});
  })
  .catch(error => handleError(error, res));
};
//Rezept Informationen (Wie lange, Zutaten, original Rezept Webseite)
function getRecipe(req, res) {
  let url = `https://api.spoonacular.com/recipes/informationBulk?ids=${req.params.id}&apiKey=${apiKey}`;
  let userID = req.cookies.userID ? parseInt(req.cookies.userID) : -1;
  let SQL = `SELECT COUNT(recipe_id) FROM recipes WHERE user_id = ${userID} AND recipe_id = ${req.params.id};`;
  let recipeSaved = 0;
      superagent.get(url)
        .then(recipe => {
          return new Recipe(recipe.body[0], req.params.id);
        })
        .then(result => {
          if (recipeSaved > 0) {
            let cookie = req.cookies.userID ? req.cookies.userID : '';
            res.render('recipe_details.ejs', {details: result, 'cookie': cookie, saved: true});
          }
          else {
            let cookie = req.cookies.userID ? req.cookies.userID : '';
            res.render('recipe_details.ejs', {details: result, 'cookie': cookie, saved: false});
          }
        })
    .catch(error => handleError(error, res));
}

//Rezepte speichen 
function saveRecipe(req, res) {
  let {name, image_url, time, servings} = req.body;
  let userID = parseInt(req.cookies.userID);

  let SQL = 'INSERT INTO recipes(recipe_id, image, name, time, servings, user_id, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7);';
  let values = [req.params.id, image_url, name, time, servings, userID, Date.now()];

  if(isNaN(userID)) {
    res.render('pages/login', {'message': 'You must be signed in to save recipes.', 'cookie': ''})
  }
  else {
    client.query(SQL, values)
      .then(() => {
        res.redirect(`/saved`);
      })
      .catch(error => handleError(error, res));
  }
}
//Rezepte die gespeichert sind, wieder löschen
function deleteRecipe(req, res) {
  let userID = parseInt(req.cookies.userID);
  let SQL = `DELETE FROM recipes WHERE user_id = ${userID} AND recipe_id = ${req.params.id};`;

  client.query(SQL)
    .then(result => res.redirect('/saved'))
    .catch(error => handleError(error, res));
}
//Gespeicherte Rezepte ansehen können
function getSaved(req, res) {
  let userID = parseInt(req.cookies.userID);
  let cookie = req.cookies.userID ? req.cookies.userID : '';

  if (!userID) {
    res.render('pages/login', {'message': 'Sign In to Save Recipes', 'cookie': cookie, 'savedResults': ''});
  }
  else {
    let SQL = `SELECT recipe_id, image, name, time, servings FROM recipes WHERE user_id = ${userID} ORDER BY timestamp;`;
    client.query(SQL)
      .then(results => {
        if (results.rows[0]) {
          res.render('pages/saved', {'savedResults': results.rows, 'cookie': cookie});
        }
        else {
          res.render('pages/saved', {'savedResults': '', 'cookie': cookie});
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