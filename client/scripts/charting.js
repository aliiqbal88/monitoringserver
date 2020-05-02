"use strict"
export var ecoDataExport = {totalYield:0};




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
            console.log('hereitisfetch');
            console.log(res.status);
            console.log('resFinish');
            return res.json();
        })
        .then(jsonData => {
            recData = jsonData.filter(pkt=>pkt.iPktSuccess==true);     // @recdata is fetched data and filtered for inverter succfess
            wRecData = jsonData.filter((pkt=>pkt.wPktSuccess==true))    // recData for weather success
            console.log("jsonData Received");
            console.log(jsonData);

            //  display of other items
            var wLastPacket = wRecData[wRecData.length-1];
            var iLastPacket = recData[recData.length -1];
            console.log('wLastPacket');
            console.log(wLastPacket);
            
            //first Packet
            var iFirstPacket = recData[0];
            

            var currentRadiation = wLastPacket.weatherData.WSolarRadiation;
            var currentAmbentTemp = wLastPacket.weatherData.WAmbientTemperature;
            var currentModuleTemp = wLastPacket.weatherData.WPVModuleTemperature;
            var currentWindSpeed = wLastPacket.weatherData.WWindSpeed;
            console.log(currentRadiation);

            document.getElementById("irradianceValue").innerHTML = currentRadiation+ " W/m sq.";
            document.getElementById("ambientTempValue").innerHTML = currentAmbentTemp+ " \xB0C";
            document.getElementById("moduleTempValue").innerHTML = currentModuleTemp+ " \xB0C";
            document.getElementById("windSpeedValue").innerHTML = currentWindSpeed+ " m/s";
            
            
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

            let dailyYieldValue = iLastPacket.inverterData.reduce((acc,iPoint)=>{
                return (acc+iPoint.IDailyPowerYield)
            },0);
            let totalYieldValue = iLastPacket.inverterData.reduce((acc,iPoint)=>{
                return (acc+iPoint.ITotalPowerYield)
            },0)
            let currentPowerValue = iLastPacket.inverterData.reduce((acc,iPoint)=>{
                return (acc+iPoint.IActivePower)
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

            lastRecordHour++;
            

            let firstRecordHourString = firstRecordHour+":00";
            let lastRecordHourString = lastRecordHour + ":00";
            console.log("string First: " + firstRecordHourString);
            console.log("string last: " + lastRecordHourString);


            // console.log('cpo:' + currentPowerValue + ", dYie: " + dailyYieldValue + ", tyie: "+ totalYieldValue);
            ecoDataExport.totalYield = totalYieldValue;


            document.getElementById("outputPowerValue").innerHTML = currentPowerValue+ " W";
            document.getElementById("dailyYieldValue").innerHTML = dailyYieldValue + " kWh";
            document.getElementById("totalYieldValue").innerHTML = totalYieldValue + " kWh.";
            document.getElementById("moneySavedTodayValue").innerHTML = "Rs. " + Math.round(dailyYieldValue*20);
            document.getElementById("moneySavedTotalValue").innerHTML = "Rs. " + Math.round(totalYieldValue*20);
            document.getElementById("lastRecord").innerHTML = "Last Record: " + lastRecord;
    
            let chartData = recData.map(dataPoint => {
                return {
                    //x: dataPoint.date.substring(11, 19),
                    x: formatTime(dataPoint.date),
                    y: dataPoint.inverterData.reduce((acc, iPoint) => {
                        return acc + iPoint.IActivePower;
                    }, 0)
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
                        fill: true,
                        borderColor: "rgba(0, 0, 255, 1)",
                        pointRadius:2,
                        backgroundColor: 'rgba(0, 0, 255, 0.0)',
                        pointStyle: 'line',
                        borderWidth: 1.4
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
                        fontSize:25
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
                                labelString: 'Time'
                            }
                        }],
                        yAxes: [
                            {
                               id:'Power',
                                ticks: {beginAtZero:true},
                                position:'left',
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Power (Watts)'
                                }
                            }
                             ,{
                                id:'Solar Irradiance',
                                position:'right',
                                ticks: {
                                    beginAtZero:true,
                                    max:2000
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Solar Irradiance (W/sq. m)'
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

