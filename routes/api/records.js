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
    let dateDatePost = datePost.getDate();
    let dateMonthPost = datePost.getMonth();
    let dateYearPost = datePost.getFullYear();
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
                    date:{$lt:new Date(dateYearPost,dateMonthPost,dateDatePost,3,0,0)}
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
    //let date4 = new Date();
    
    //console.log(date3);
    //console.log(date4);

    //date3.setHours(1,1,1,1);
    //date3.setMinutes(1);
    
    //date4.setHours(23,59,59,59);
    //date4.setMinutes(59);
    //console.log(date1);
    //console.log(date2);
    let dateDate = date3.getDate();
    let dateMonth = date3.getMonth();
    let dateYear = date3.getFullYear();
    
    
    Record.find(
        {
            date:{$gte:new Date(dateYear,dateMonth,dateDate,3,59,59), $lt:new Date(dateYear,dateMonth,dateDate,20,0,0)}
            //date:{$gte:date3, $lt:date4}
        }).then(data=> {
            console.log('fetchHit2');
            //console.log(data[0].inverterData);
            
            res.json(data)}
        );
})

module.exports = router;