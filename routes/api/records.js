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
    

    let date1 = new Date(2020,4,5,0,59,59);
    let date2 = new Date(2020,4,6,0,59,59);
    console.log(date1);
    console.log(date2);
    Record.find(
        {
            date:{$gte:new Date(2020,3,13,0,59,59), $lt:new Date(2020,3,14,0,59,59)}
        }).then(data=> {
            console.log('fetchHit');
            console.log(data[0].inverterData);
            res.json(data)}
        );
})

module.exports = router;