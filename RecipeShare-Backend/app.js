const express = require('express'); 
const cors = require('cors');

const db = require('better-sqlite3')('./db/recipes.db');
  
const app = express(); 
const PORT = 3000; 

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
  
app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server listening on port "+ PORT) 
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

    if (user && user.password == req.body.password){
        res.status(200);
        res.json(user)
    }
    else{
        res.status(401);
        res.json({'error': 'login failed'})
    }
});

app.get('/seeddb', async (req, res) => {    
    await db.exec('CREATE TABLE IF NOT EXISTS users (username TEXT UNIQUE, password TEXT)')
    res.status(200)
    res.json({data: 'done'})    
})