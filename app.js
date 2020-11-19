var chmodr = require('chmodr');

chmodr('/node_modules', 0o777, (err) => {
  if (err) {
    console.log('Failed to execute chmod', err);
  } else {
    console.log('Success');
  }
});
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;

app.use(cors());
const PORT = process.env.PORT || 3000;

var URI = "mongodb+srv://phil:Alfadelta4@cluster0.ibqct.mongodb.net/?retryWrites=true&w=majority";
var dbo;

MongoClient.connect(URI, function(err, db) {
    if(err) throw err;
    else{
        console.log("Mongo connected successfully");        
    }   
    
    dbo = db.db("CMPG");
});

app.get('/', (req, res) => {
    res.send("Welcome to the classification API. Please make sure you are logged in");
})

app.get('/users', (req, res) => {
    dbo.collection("Users").find({}).toArray(function(err, result){
        if(err) throw err;
        res.status(200).send(result);
    });
})

//Authenticate user
async function authUser(theEmail, thePassword) {    
    try{
        const user  = await locateUser(theEmail);
        return user;
        
    }catch(error){
        console.log(error)
    }    
}; 

async function locateUser(theEmail) {  
   const user = await dbo.collection("Users").findOne({email: theEmail});
   return user;
}

//user login
app.post('/login', async (req, res) => {
    //Authenticate user
    const user = await authUser(req.body.email, req.body.password)

    if(user !== null)
    {
        try{
            if(await bcrypt.compare(req.body.password, user.password)){
                console.log(user);
                jwt.sign({user: user}, 'secretkey', { expiresIn: '10s'}, (err, token) => {
                    //redirect to homepage
                    res.json({
						token,
						username: user.username,
                        message: "Success"
                    })
                });            
            }else{
                res.send('Not allowed');
            }
        }

        catch{
        res.status(500).send();
        }       
    }
    else{
        res.send('Cannot find user')
    }
    
});

//Verify token
function verifyToken(req, res, next){
    //Get auth header value
    //We want ot send the token in the header
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;

        //Call next middleware
        next();
    }
    else{
        //Forbidden
        res.sendStatus(403);
    }
}

app.listen(PORT, () => {
    console.log("Listening on port " + PORT)
})




/*var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } else {
        res.writeHead(200);
        res.write(html);
        res.end();
    }

    
});



// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
*/