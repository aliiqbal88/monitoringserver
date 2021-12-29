"use strict"
export var ecoDataExport = {totalYield:0};
import { inverterConfig } from './inverterConfig.js'



document.addEventListener('DOMContentLoaded',function(){init();});

document.addEventListener('DOMContentLoaded',function(){setInterval(init,3*60*1000)});

const init = function (e) {
    let myChart = document.getElementById('myChart').getContext('2d');
    var timeFormat = 'HH:mm';
    let recData; // filtered for inverterData success
    let wRecData; // filtered for weatherData success
    // fetching data
    let urlFetch = 'https://monitoringserver.herokuapp.com/api/records/fetchData';
    //let urlFetch = 'http://localhost:5000/api/records/fetchData';
    console.log('fetching');
    fetch(urlFetch, { mode: 'cors' })
        .then(res => {
            console.log('hereitisfetch_v2');
            console.log(res.status);
            console.log('resFinish');
            return res.json();
        })
        .then(jsonData => {
            //recData = jsonData.filter(pkt=>pkt.iPktSuccess==true);     // @recdata is fetched data and filtered for inverter succfess

            recData = jsonData;


            wRecData = jsonData.filter((pkt=>pkt.wPktSuccess==true))    // recData for weather success
            console.log("jsonData Received");
            console.log(jsonData);


            

            //  display of other items
            var wLastPacket = wRecData[wRecData.length-1]; //CHECK WHERE THIS LEADS
            var iLastPacket = recData[recData.length -1];
            
            // CHECK WHERE WEATHER LAST PACKET IS USED. THATS THE SOURCE OF THE PROBLEM
            // console.log('wLastPacket');
            // console.log(wLastPacket);
            
            console.log('iLastPacket');
            console.log(iLastPacket);
            //first Packet
            var iFirstPacket = recData[0];
            
            //// DO AWAY WITH THIS INVERTER CONFIG FOR NOW. WE DONT NEED IT. CHECK BACK LATER.
            //// THIS PART DOES SOMETHING ABOUT INDIVIDUAL INVERTERS. GROUPED IN BUILDINGS.             
            // var mappedArray = inverterConfig.map( loc =>{
            //     let locationArray = iLastPacket.inverterData.filter( dev => loc.inverter_addresses.includes(dev.DeviceAddress) ); // sorted inverter packets according to location and puts them in an array
                
            //     let fault_code = locationArray.map(fault => {
            //         return fault.IFaultCode;
            //     });

            //     let total_yield = locationArray.reduce( (total,t_yield)=>{
            //         return total + t_yield.ITotalPowerYield;
            //     },0);

            //     let daily_yield = locationArray.reduce( (total,d_yield)=>{
            //         return total + d_yield.IDailyPowerYield;
            //     },0);

            //     let power_generation = locationArray.reduce( (total,p_gen)=>{
            //         return total + p_gen.IActivePower;
            //     },0);

            //     return ({
            //         location: loc.location,
            //         fault_code: fault_code,
            //         daily_yield: daily_yield,
            //         total_yield: total_yield,
            //         power_generation:power_generation
            //     });

            // })

            // console.log("mappedArray");
            // console.log(mappedArray)

            //DETAILED ARRAY
            
            //document.getElementById("oneID").innerHTML = mappedArray[1].location + " " + mappedArray[1].power_generation;
            
            ////////////////

            //// THIS IS THE WEATHER DATA. GET BACK TO THIS IN THE CODE EXTENSION //
            // var currentRadiation = wLastPacket.weatherData.WSolarRadiation;
            // var currentAmbentTemp = wLastPacket.weatherData.WAmbientTemperature;
            // var currentModuleTemp = wLastPacket.weatherData.WPVModuleTemperature;
            // var currentWindSpeed = wLastPacket.weatherData.WWindSpeed;
            // console.log(currentRadiation);

            // document.getElementById("irradianceValue").innerHTML = currentRadiation+ " W/m\u00B2";
            // document.getElementById("ambientTempValue").innerHTML = currentAmbentTemp.toFixed(1) + " \xB0C";
            // document.getElementById("moduleTempValue").innerHTML = currentModuleTemp.toFixed(1) + " \xB0C";
            // document.getElementById("windSpeedValue").innerHTML = currentWindSpeed+ " m/s";
            
            
            //Global Options
            Chart.defaults.global.defaultFontFamily = 'Lato';
            Chart.defaults.global.defaultFontSize = 18;
            Chart.defaults.global.defaultFontColor = '#777';

            // @parsing chartData
            //console.log(recData[0].date.substring(11,19));
            
            //var oldDateCorrected = new Date(recData[0].date);
            //var dateCorrected = new Date(recData[0].date);

            // var newDateCorrected = dateCorrected.setHours(dateCorrected.getHours()+5);
            // console.log("Old Date corrected " + oldDateCorrected.getHours()+":"+oldDateCorrected.getMinutes()+":"+oldDateCorrected.getSeconds());
            // console.log("Date corrected " + dateCorrected);


            let midValue = 0;       // getting rid of keys not present due to comm error
            let dailyYieldValue = iLastPacket.inverterData.reduce((acc,iPoint)=>{
                
                if (!("IDailyPowerYield" in iPoint)){
                    midValue = 0;
                    
                } else {
                    midValue = iPoint.IDailyPowerYield;
                }
                return (acc+midValue)
            },0);
            
            let totalYieldValue = iLastPacket.inverterData.reduce((acc,iPoint)=>{
                
                if (!("ITotalPowerYield" in iPoint)){
                    midValue = 0;
                    //console.log(midDailyYieldValue);
                } else{
                    midValue = iPoint.ITotalPowerYield;
                }
                return (acc+midValue)
            },0)

            let currentPowerValue = iLastPacket.inverterData.reduce((acc,iPoint)=>{
                if (!("IActivePower" in iPoint)){
                    midValue = 0;
                    //console.log(midDailyYieldValue);
                } else{
                    midValue = iPoint.IActivePower;
                }
                return (acc+midValue)
                //return (acc+iPoint.IActivePower)
            },0);

            let firstRecordDateObject = new Date(iFirstPacket.date)
            let firstRecord = firstRecordDateObject.toString().substring(0,21);
            let firstRecordHour = parseInt(firstRecord.substring(16,18));
            console.log("firstHour: " + firstRecordHour);
            let lastRecordDateObject= new Date(iLastPacket.date);
            let lastRecord = lastRecordDateObject.toString().substring(0,21);
            let lastRecordHour = parseInt(lastRecord.substring(16,18));
            console.log("lastHour: " + lastRecordHour);
            console.log("date: " +lastRecord);

            
            
            // MIN AND MAX FOR THE X-AXIS
            lastRecordHour++;
            let firstRecordHourString = firstRecordHour+":00";
            let lastRecordHourString = lastRecordHour + ":00";
            console.log("string First: " + firstRecordHourString);
            console.log("string last: " + lastRecordHourString);


            // LAST RECORD FOR DISPLAY
            let dateString = lastRecordDateObject.toISOString();
            // let newDateString = dateString.substring(8,10)+"/"+dateString.substring(5,7)+"/"+dateString.substring(0,4) + " " + dateString.substring(11,19)
            let newDateString = dateString.substring(8,10)+"/"+dateString.substring(5,7)+"/"+dateString.substring(0,4) + " " + lastRecordDateObject.toString().substring(16,24);
            console.log("newDateString : " + newDateString);

            // console.log('cpo:' + currentPowerValue + ", dYie: " + dailyYieldValue + ", tyie: "+ totalYieldValue);
            ecoDataExport.totalYield = totalYieldValue;


            document.getElementById("outputPowerValue").innerHTML = (currentPowerValue/1000).toFixed(2) + " kW";
            document.getElementById("dailyYieldValue").innerHTML = Math.round(dailyYieldValue) + " kWh";
            document.getElementById("totalYieldValue").innerHTML = (totalYieldValue/1000).toFixed(2) + " MWh";
            document.getElementById("moneySavedTodayValue").innerHTML = "Rs. " + Math.round(dailyYieldValue*20);
            document.getElementById("moneySavedTotalValue").innerHTML = "Rs. " + Math.round(totalYieldValue*20);
            document.getElementById("lastRecord").innerHTML = "Last Record: " + newDateString;
    
            let chartData = recData.map(dataPoint => {
                return {
                    //x: dataPoint.date.substring(11, 19),
                    x: formatTime(dataPoint.date),
                    y: (dataPoint.inverterData.reduce((acc, iPoint) => {
                        if (!("IActivePower" in iPoint)){
                            midValue = 0;
                            //console.log(midDailyYieldValue);
                        } else{
                            midValue = iPoint.IActivePower;
                        }
                        return acc + midValue;
                        //return acc + iPoint.IActivePower;
                    }, 0)/1000).toFixed(3)
                }
            });

            let solarChartData = wRecData.map(dataPoint=>{
                return{
                    x: formatTime(dataPoint.date),
                    y: dataPoint.weatherData.WSolarRadiation
                }

            });
            console.log('chartData')
            console.log(chartData);

            console.log('solarChartData')
            console.log(solarChartData);


            //FIND MAX SOLAR DATA;

            //let theX = [new Date(2018, 11, 24, 10, 33, 30, 0),new Date(2018, 11, 24, 10, 45, 30, 0),new Date(2018, 11, 24, 10, 55, 30, 0),new Date(2018, 11, 24, 11, 13, 30, 0)];
            let massPopChart = new Chart(myChart, {
                type: 'line',
                data: {
                    //labels:['Peshawar','Mardan','Pabo','Rehman Abad'],

                    //labels:theX,
                    datasets: [{
                        label: 'Power Generation',
                        data: chartData,
                        yAxisID: 'Power',
                        //backgroundColor:['green','blue','yellow','black'],
                        //borderWidth:5,
                        //borderColor:'#777',
                        //hoverBorderWidth:10,
                        //hoverBorderColor:'red'
                        fill: true,
                        borderColor: 'rgba(255, 128, 0,1)',
                        pointRadius:2,
                        backgroundColor: 'rgba(255, 128, 0, 0.3)',
                        pointStyle: 'line',
                        borderWidth: 1.4

                    },
                    {
                        label: 'Solar Irradiance',
                        data: solarChartData,
                        yAxisID:'Solar Irradiance',
                        //backgroundColor:['green','blue','yellow','black'],
                        //borderWidth:5,
                        //borderColor:'#777',
                        //hoverBorderWidth:10,
                        //hoverBorderColor:'red'
                        fill: false,
                        borderColor: "rgba(0, 0, 255, 1)",
                        pointRadius:2,
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        pointStyle: 'line',
                        borderWidth: 1.4,
                        borderDash: [15, 3, 3, 3]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio:false,
                    legend: {
                        display: true,
                        // position:'bottom',
                        align:'end',
                        
                        labels:{
                            usePointStyle:true
                        }
                    },
                    title: {
                        display: true,
                        text: 'System Output',
                        fontSize:35
                    },

                    scales: {
                        xAxes: [{
                            type: "time",
                            time: {
                                parser: timeFormat,
                                tooltipFormat: 'HH:mm:ss',
                                displayFormats: {  // this section gives the desired x axis result
                                    millisecond: 'HH:mm:ss.SSS',
                                    second: 'HH:mm:ss',
                                    minute: 'HH:mm',
                                    hour: 'HH'
                                },
                                unit: 'minute',
                                unitStepSize: 60,
                                min: firstRecordHourString,
                                max: lastRecordHourString
                                // min: "6:00",
                                // max: "19:00"

                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Time',
                                fontSize: 25
                            }
                        }],
                        yAxes: [
                            {
                               id:'Power',
                                ticks: {
                                    beginAtZero:true,
                                    maxTicksLimit:7
                                },
                                position:'left',
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Power Generation (kW)',
                                    fontSize: 25
                                    
                                }
                            }
                             ,{
                                beforeUpdate: function(scale){
                                    var nLeftTickCount = scale.chart.scales['Power'].ticks.length;
                    
                                    scale.chart.options.scales.yAxes[1].ticks.max = 2400;
                                    scale.chart.options.scales.yAxes[1].ticks.stepSize = 2400/(nLeftTickCount-1)
                                    //console.log("left tick count : " + nLeftTickCount );
                                    return;
                                },
                                id:'Solar Irradiance',
                                position:'right',
                                ticks: {
                                    beginAtZero:true,
                                    //max:2400,
                                    //stepSize:400
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Solar Irradiance (W/m\u00B2)',
                                    fontSize: 25
                                },
                                gridLines: {
                                    display:false
                                }
                             }
                        ]



                    }
                    /*,                    pan: {
                        enabled: true,
                        mode: "x",
                        speed: 10,
                        threshold: 10
                      },
                      zoom: {
                        enabled: true,
                        drag: false,
                        mode: "xy",
                        limits: {
                          max: 10,
                          min: 0.5
                        }
                      }*/
                }
            });

            //chartupdate
            //setInterval(chartUpdate,4000,massPopChart);
        }).catch(()=>console.log('sumtingwong'));
    
    

}

let printed=0

function formatTime(dateString){
    var dateObject = new Date(dateString);
    return dateObject.getHours()+":"+dateObject.getMinutes()+":"+dateObject.getSeconds();
}


/// @USE THIS TO REFRESH THE CHART

function chartUpdate(oldChart){
    /*oldChart.data.datasets.forEach((dataset) => {             //  THIS ONE WORKS BUBBA
        dataset.data.push({x:'20:20:20',y:500})
    });*/
    
    oldChart.data.datasets[0].data.push({x:'20:20:20',y:500})
    oldChart.update();
    console.log('printMe '+ printed);
    printed++;
}

