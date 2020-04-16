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

// port definition

app.listen(process.env.port || 5000);