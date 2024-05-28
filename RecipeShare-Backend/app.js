require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('better-sqlite3')('/data/recipes.db');
//const db = require('better-sqlite3')('./db/recipes.db');

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

const s3Client = new S3Client({
    region: 'us-east-2',
})

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
        const recipeInsert = db.prepare('INSERT INTO recipes (name, difficulty, author, preptime, categories, private) VALUES (?, ?, ?, ?, ?, ?, ?)')
        const recipe = req.body.recipe
        const result = recipeInsert.run(recipe.name, recipe.difficulty, recipe.author, recipe.preptime, JSON.stringify(recipe.categories), recipe.private ? 1 : 0)
        recipe.id = result.lastInsertRowid

        const ingredientSetInsert = db.prepare('INSERT INTO ingredientsets (ingredients, recipe_id) VALUES (?, ?)')
        const ingredientSetsTransaction = db.transaction((sets) => {
            for (const i of sets) ingredientSetInsert.run(JSON.stringify(i.ingredients), recipe.id)
        })
        ingredientSetsTransaction(req.body.ingredientSets)

        const setpSetInsert = db.prepare('INSERT INTO stepsets (steps, recipe_id) VALUES (?, ?)')
        const stepSetsTransaction = db.transaction((sets) => {
            for (const i of sets) setpSetInsert.run(JSON.stringify(i.steps), recipe.id)
        })
        stepSetsTransaction(req.body.stepSets)

        res.status(200)
        res.json({ 'message': 'success' })
    } catch (e) {
        res.status(500)
        res.json({ 'error': e.message })
    }
})

app.post('/saveRecipe', (req, res) => {
    try{
        const recipeUpdate = db.prepare('UPDATE recipes SET name=?,difficulty=?,preptime=?,categories=?,private=? WHERE id==?')
        const recipe = req.body.recipe
        const result = recipeUpdate.run(recipe.name, recipe.difficulty,recipe.preptime, JSON.stringify(recipe.categories), recipe.private ? 1 : 0, recipe.id)

        const deleteOldIngredients = db.prepare('DELETE FROM ingredientsets WHERE recipe_id=?')
        deleteOldIngredients.run(recipe.id)

        const ingredientSetInsert = db.prepare('INSERT INTO ingredientsets (ingredients, recipe_id) VALUES (?, ?)')
        const ingredientSetsTransaction = db.transaction((sets) => {
            for (const i of sets) ingredientSetInsert.run(JSON.stringify(i.ingredients), recipe.id)
        })
        ingredientSetsTransaction(req.body.ingredientSets)

        const deleteOldStepSets = db.prepare('DELETE FROM stepsets WHERE recipe_id=?')
        deleteOldStepSets.run(recipe.id)

        const setpSetInsert = db.prepare('INSERT INTO stepsets (steps, recipe_id) VALUES (?, ?)')
        const stepSetsTransaction = db.transaction((sets) => {
            for (const i of sets) setpSetInsert.run(JSON.stringify(i.steps), recipe.id)
        })
        stepSetsTransaction(req.body.stepSets)

        res.status(200)
        res.json({'message': 'success', 'data': req.body})
    }catch(e){
        res.status(500)
        res.json({'error': e.message})
    }
})

app.get('/recipes', (req, res) => {
    try{
        if(req.query.category){
            var stmt = db.prepare(`SELECT * FROM recipes WHERE categories LIKE '%"${req.query.category}"%' ORDER BY name`)
        }else{
            var stmt = db.prepare("SELECT * FROM recipes ORDER BY name")
        }
        const recipes = stmt.all()
        recipes.forEach(r => {
            //Parse the categories back from a string into an array
            let parsed = JSON.parse(r.categories)
            r.categories = parsed
        });

        res.status(200)
        res.json({'data': recipes})
    }catch (e){
        res.status(500)
        res.json({'error': e.message})
    }
})

app.get('/recipe', (req, res) => {
    const id = req.query.id
    let toReturn = {}
    
    try{
        let stmt = db.prepare("SELECT * FROM recipes WHERE id==?")
        const recipe = stmt.get(id)

        if(recipe){
            //Parse the categories back from a string into an array
            let parsed = JSON.parse(recipe.categories)
            recipe.categories = parsed

            stmt = db.prepare("SELECT * FROM ingredientsets WHERE recipe_id==?")
            const ingredientSets = stmt.all(recipe.id)

            stmt = db.prepare("SELECT * FROM stepsets WHERE recipe_id==?")
            const stepSets = stmt.all(recipe.id)

            toReturn = {
                recipe: recipe,
                ingredientSets: ingredientSets,
                stepSets: stepSets
            }

            res.status(200)
            res.json({'data': toReturn})
        }else{
            res.status(404)
            res.json({'error': 'No Recipe Found'})
        }
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
        res.json({'data': categories})
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

app.get('/s3testset', (req, res) => {
    s3Client.send(new PutObjectCommand({
        Bucket: 'recipeshare',
        Key: 'testobject.txt',
        Body: "This is a test"
    }))
})

app.get('/s3testget', (req, res) => {
    
})