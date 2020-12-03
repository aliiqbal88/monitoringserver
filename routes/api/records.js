const express = require('express');
const router = express.Router();

// Records Model

const Record = require('../../models/Record')

//@get api/records
//@desc GetAllItems
//@access public

router.get('/',(req, res)=>{
    console.log('apiHit');
    res.send('welsomehome')
    //Record.find().sort({date:-1}).then(data=>res.json(data));
})


const moment = require('moment-timezone');

router.post('/monitoring',(req,res)=>{
    console.log('POSThit')
    let datePost = new Date();
    datePost.setHours(0,0,0,0);
    datePost.setHours(datePost.getHours()-2);     // we want 3am PST
    // let dateDatePost = datePost.getDate();
    // let dateMonthPost = datePost.getMonth();
    // let dateYearPost = datePost.getFullYear();
    var newObject = req.body;
    var weatherDataTemp = req.body[0]
    newObject.shift();

    var validationTemp = newObject.pop();
    
    var inverterDataTemp = newObject
    console.log(inverterDataTemp);
    
    //var today = new Date();
    //today.setHours(today.getHours() + 5);
    //var todayX = new Date();
    //today.setHours(today.getHours() + 5);
    //var today = moment().tz("Asia/Karachi").format();
    //console.log('here is today');
    //console.log(today.format());
    //console.log(todayX);
    var newRecord = new Record({
      weatherData: weatherDataTemp,
      inverterData: inverterDataTemp,
      wPktSuccess: validationTemp.wPktSuccess,
      iPktSuccess: validationTemp.iPktSuccess
      //date: today

    })
    newRecord.save()
        .then(data=>{
            console.log('here This Was saved');
            console.log(data);
            Record.deleteMany(
                {
                    date:{$lt:new Date(datePost.getTime())}
                }
            ).then(()=>
                console.log('deleted')
            ).catch(()=>console.log('deleteErr'));
            res.send('Data Received Successfully')
        })
        
        .catch(err=>console.log(err));
    
    //res.json({hiThere:req.body[2]['ICOMPort']})


});



// get them cors
const cors = require('cors');
// @dataFetch.
router.get('/fetchData',cors(),(req,res)=>{
    //res.json({hi:"fetchHit"});
    let today = new Date();
    

    //let date1 = new Date(2020,4,5,0,59,59);
    //let date2 = new Date(2020,4,6,0,59,59);
    let date3 = new Date();
    let date4 = new Date();
    
    
    
    date3.setHours(0,0,0,0);
    date3.setHours(date3.getHours()-2);     // we want 3am PST
    
    date4.setHours(15,0,0,0);
    //console.log(date3);
    //console.log(date4);

    //date3.setHours(1,1,1,1);
    //date3.setMinutes(1);
    
    //date4.setHours(23,59,59,59);
    //date4.setMinutes(59);
    //console.log(date1);
    //console.log(date2);
    // let dateDate = date3.getDate();
    // let dateMonth = date3.getMonth();
    // let dateYear = date3.getFullYear();

    // let dateDate1 = date4.getDate();
    // let dateMonth1 = date4.getMonth();
    // let dateYear1 = date4.getFullYear();
    //let currentDate = new Date(dateYear,dateMonth,dateDate,3,59,59)
    let currentDateString = date3.toString();
    console.log("dates:"+currentDateString);
    
    
    Record.find(
        {
            date:{$gte:new Date(date3.getTime()), $lt:new Date(date4.getTime())}
            //date:{$gte:date3, $lt:date4}
        }).then(data=> {
            console.log('fetchHit2');
            //console.log(data[0].date);
            //console.log(data);
            res.json(data)}
        );
})

var request = require('request');
router.get('/odkFetch',cors(),(req,res)=>{
    let cred="aliiqbal88@gmail.com:scienceorthewin";
    let base64data = Buffer.from(cred).toString('base64');
    // let buff = new Buffer(cred);
   // let base64data = buff.toString('base64')
    request({
        method: 'GET',
        url: 'https://sitesurvey.panelsolar.si/v1/projects/2/forms/build_4k-Final-Testing-Form_1605795109/submissions/',
        headers: {
          'Authorization': 'Basic ' + base64data,
          'X-Extended-Metadata': true

        }}, function (error, response, body) {
        console.log('Status:', response.statusCode);
        console.log('Headers:', JSON.stringify(response.headers));
        console.log('Response:', body);
        
      });
    console.log('yoyoyo');
    console.log(base64data);
    res.json({yo:'hereitis'});
})


module.exports = router;