require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('better-sqlite3')('/data/recipes.db');

const bcrypt = require('bcrypt')
const saltRounds = 7

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);

const adminUsers = ['ryan', 'christina']

app.get("/", (req, res) => {
    res.status(200);
    res.send("Heartbeat successful!")
});

app.post('/login', (req, res) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username==?')
    const user = stmt.get(req.body.username);

    if (user) {
        bcrypt.compare(req.body.password, user.password)
            .then(result => {
                if (result === true) {
                    res.status(200);
                    res.json(user)
                }
                else {
                    res.status(401);
                    res.json({ 'error': 'login failed' })
                }
            }).catch(err => {
                res.status(401);
                res.json({ 'error': 'login failed' })
            })
    }
    else {
        res.status(401);
        res.json({ 'error': 'login failed' })
    }
});

app.post('/register', (req, res) => {
    const insert = db.prepare('INSERT INTO USERS (username, password) VALUES (?, ?)')

    bcrypt.hash(req.body.password, saltRounds)
        .then(hash => insert.run(req.body.username, hash))
        .catch(err => {
            res.status(500)
            res.json({ 'error': 'Something went wrong trying to hash your password' })
        })

    res.status(200)
    res.json({ 'message': 'success' })
})

app.post('/createRecipe', (req, res) => {
    try {
        const recipeInsert = db.prepare('INSERT INTO recipes (name, difficulty, author, preptime, cost, categories, private) VALUES (?, ?, ?, ?, ?, ?, ?)')
        const recipe = req.body.recipe
        const result = recipeInsert.run(recipe.name, recipe.difficulty, recipe.author, recipe.preptime, recipe.cost, JSON.stringify(recipe.categories), recipe.private ? 1 : 0)
        recipe.id = result.lastInsertRowid

        const ingredientSetInsert = db.prepare('INSERT INTO ingredientsets (ingredients, recipe_id) VALUES (?, ?)')
        const ingredientSetsTransaction = db.transaction((sets) => {
            for (const i of sets) ingredientSetInsert.run(JSON.stringify(i), recipe.id)
        })
        ingredientSetsTransaction(req.body.ingredientSets)

        const setpSetInsert = db.prepare('INSERT INTO stepsets (steps, recipe_id) VALUES (?, ?)')
        const stepSetsTransaction = db.transaction((sets) => {
            for (const i of sets) setpSetInsert.run(JSON.stringify(i), recipe.id)
        })
        stepSetsTransaction(req.body.stepSets)

        res.status(200)
        res.json({ 'message': 'success' })
    } catch (e) {
        res.status(500)
        res.json({ 'error': e.message })
    }
})

app.get('/recipes', (req, res) => {
    try{
        var stmt = db.prepare("SELECT * FROM recipes ORDER BY name")
        const recipes = stmt.all()

        res.status(200)
        res.json({'data': recipes})
    }catch (e){
        res.status(500)
        res.json({'error': e.message})
    }
})

app.get("/categories", (req, res) => {
    try {
        var get = db.prepare("SELECT name FROM categories ORDER BY name")
        var categories = get.all()

        res.status(200)
        res.json(categories)
    } catch (e) {
        res.status(500)
        res.json({ 'error': e.message })
    }
})

app.get('/seeddb', (req, res) => {
    db.exec('CREATE TABLE IF NOT EXISTS users (username TEXT UNIQUE, password TEXT)')
    res.status(200)
    res.json({ data: 'done' })
})

app.post('/adminSubmit', (req, res) => {
    if(!adminUsers.includes(req.body.user.username)){
        res.status(401)
        res.json({'error': 'not an admin'})        
    }

    try{
        db.exec(req.body.query)

        res.status(200)
        res.json({'message': 'success'})
    }catch (e){
        res.status(500)
        res.json({'error': e.message})
    }


})