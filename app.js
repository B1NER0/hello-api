const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
const PORT = process.env.PORT || 3000;

var URI = "mongodb+srv://phil:Alfadelta4@cluster0.ibqct.mongodb.net/?retryWrites=true&w=majority";
var dbo;

/*MongoClient.connect(URI, function(err, db) {
    if(err) throw err;
    else{
        console.log("Mongo connected successfully");        
    }   
    
    dbo = db.db("CMPG");
});*/

app.get('/', (req, res) => {
    res.send("YOU ARE HERE");
})

app.get('/users', (req, res) => {
    dbo.collection("Users").find({}).toArray(function(err, result){
        if(err) throw err;
        res.status(200).send(result);
    });
})

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