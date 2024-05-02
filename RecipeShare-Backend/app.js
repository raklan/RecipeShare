const express = require('express'); 
const cors = require('cors');
  
const app = express(); 
const PORT = 3000; 

app.use(cors());
  
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
    const user = {
        'username': 'ryan'
    }

    res.status(200);
    res.send(JSON.stringify(user))
});