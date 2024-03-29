// WORKING ON NEW SERVER FROM TWO SOURCES

const express = require('express');
const mongoose = require ('mongoose');
const bodyParser = require('body-parser')

const records = require('./routes/api/records')

const app = express();

app.use(bodyParser.json());

// db config

const db = require('./config/keys').mongoURI;

// connect to mongoose

mongoose.connect(db,{ useUnifiedTopology: true, useNewUrlParser: true })
    .then(()=> console.log('Mongo Connected..'))
.catch(err=>console.log(err));



// @mouting router
app.use('/api/records',records); 

// @ Serve Static Page
const path = require('path');
app.use('/client',express.static(path.join(__dirname, 'client')));



// @Serve ODK Page
app.use('/odk',express.static(path.join(__dirname, 'odk')));
// port definition
/*
app.listen(process.env.port || 5000);
*/

//console.log(process.env.NODE_ENV)
var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port;
    console.log("Express is working on port " + port);
  });