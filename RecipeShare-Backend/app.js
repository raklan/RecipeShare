const express = require('express');
const cors = require('cors');

const db = require('better-sqlite3')('./db/recipes.db');

const bcrypt = require('bcrypt')
const saltRounds = 7

const app = express();
const PORT = 3000;

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
    const insert = db.prepare('INSERT INTO recipes (name, difficulty, author, preptime, cost, categories, private)')

    const recipe = req.body.recipe
    insert.run(recipe.name, recipe.difficulty, recipe.author, recipe.preptime, recipe.cost, JSON.stringify(recipe.categories), recipe.private)
    
    res.status(200)
    res.json({'message': 'success'})
})

app.get('/seeddb', async (req, res) => {
    db.exec('CREATE TABLE IF NOT EXISTS users (username TEXT UNIQUE, password TEXT)')
    res.status(200)
    res.json({ data: 'done' })
})