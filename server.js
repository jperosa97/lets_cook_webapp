const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const app = express();

const apiKey = 'd2ffe67642074c13a6e8391bd4a4c0f8';

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
app.get('/', (req, res) => {
  let cookie = req.cookies.userID ? req.cookies.userID : '';
  res.render('index.ejs', {'cookie': cookie});
});
app.get('/search', (req, res) => {
  res.render('search.ejs')
})

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

//Function
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

function randomRecipe(req, res) {
  let url =  `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`;

  superagent.get(url).then(recipe => {
    let randomRecipe = new Recipe(recipe.body.recipes[0], recipe.body.recipes[0].id);
    let cookie = req.cookies.userID ? req.cookies.userID : '';
    res.redirect(`/recipe/${recipe.body.recipes[0].id}`);
  }).catch(error => handleError(error));
}


// Search Recipes
function getRecipes(type) {
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?number=12&type=${type}&apiKey=${apiKey}`
  const categories = [
    {
      id: 1,
      type: 'breakfast',
      image: breakfast,
      alt: 'Image by Calum Lewis',
      label: 'Breakfast',
    },
    {
      id: 2,
      type: 'bread',
      image: bread,
      alt: 'Image by Ben Garratt',
      label: 'Bread',
    },
    {
      id: 3,
      type: 'appetizer',
      image: appetizer,
      alt: 'Image by Drew Beamer',
      label: 'Appetizer',
    },
    {
      id: 4,
      type: 'main course',
      image: mainCourse,
      alt: 'Image by Pinar Kucuk',
      label: 'Main Course',
    },
    {
      id: 5,
      type: 'salad',
      image: salad,
      alt: 'Image by Luisa Brimble',
      label: 'Salad',
    },
    {
      id: 6,
      type: 'lunch',
      image: lunch,
      alt: 'Image by Melissa Walker Horn',
      label: 'Lunch',
    },
    {
      id: 7,
      type: 'soup',
      image: soup,
      alt: 'Image by Cayla1',
      label: 'Soup',
    },
    {
      id: 8,
      type: 'side dish',
      image: sideDish,
      alt: 'Image by Maiqui Cordeiro',
      label: 'Side Dish',
    },
    {
      id: 9,
      type: 'dessert',
      image: dessert,
      alt: 'Image by Mike Meeks',
      label: 'Dessert',
    },
    {
      id: 10,
      type: 'fingerfood',
      image: fingerfood,
      alt: 'Image by Christoffer Engström',
      label: 'Fingerfood',
    },
    {
      id: 11,
      type: 'sauce',
      image: sauce,
      alt: 'Image by Dennis Klein',
      label: 'Sauce',
    },
    {
      id: 12,
      type: 'snack',
      image: snack,
      alt: 'Image by Asnim Asnim',
      label: 'Snack',
    },
    {
      id: 13,
      type: 'drinks',
      image: drinks,
      alt: 'Image by Rirri',
      label: 'Drinks',
    },
  ]
  
  return fetch(apiUrl, categories, { headers })
    .then(response => response.json())
    .then(data => {
      const { results } = data

      return results
    })
    .catch((error) => console.error(error))
}


app.listen(3000, () => {
  console.log('server is running')
})