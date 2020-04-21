"use strict"

document.addEventListener('DOMContentLoaded',function(){init();});

document.addEventListener('DOMContentLoaded',function(){setInterval(init,3*60*1000)});

const init = function (e) {
    let myChart = document.getElementById('myChart').getContext('2d');
    var timeFormat = 'HH:mm';
    let recData // data received
    // fetching data
    let urlFetch = 'https://monitoringserver.herokuapp.com/api/records/fetchData';
    //let urlFetch = 'http://localhost:5000/api/records/fetchData';
    console.log('fetching');
    fetch(urlFetch, { mode: 'cors' })
        .then(res => {
            console.log('hereitisfetch');
            //console.log(res);
            console.log('resFinish');
            return res.json();
        })
        .then(jsonData => {
            recData = jsonData;     // @recdata is fetched data
            console.log("recData");
            console.log(recData);

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

            let chartData = recData.map(dataPoint => {
                return {
                    //x: dataPoint.date.substring(11, 19),
                    x: formatTime(dataPoint.date),
                    y: dataPoint.inverterData.reduce((acc, iPoint) => {
                        return acc + iPoint.IActivePower;
                    }, 0)
                }
            });

            let solarChartData = recData.map(dataPoint=>{
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
                        label: 'power',
                        data: chartData,
                        yAxisID: 'power',
                        //backgroundColor:['green','blue','yellow','black'],
                        //borderWidth:5,
                        //borderColor:'#777',
                        //hoverBorderWidth:10,
                        //hoverBorderColor:'red'
                        fill: false,
                        borderColor: "red"

                    },
                    {
                        label: 'solarIrradiance',
                        data: solarChartData,
                        yAxisID:'solarIrradiance',
                        //backgroundColor:['green','blue','yellow','black'],
                        //borderWidth:5,
                        //borderColor:'#777',
                        //hoverBorderWidth:10,
                        //hoverBorderColor:'red'
                        fill: false,
                        borderColor: "blue"
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Solar Power Output',
                        //fontSize:25
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
                                min: "6:00",
                                max: "19:00"

                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            }
                        }],
                        yAxes: [
                            {
                               id:'power',
                                ticks: {beginAtZero:true},
                                position:'left',
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Value (Watts)'
                                }
                            }
                             ,{
                                id:'solarIrradiance',
                                position:'right',
                                ticks: {beginAtZero:true},
                                scaleLabel: {
                                    display: true,
                                    labelString: 'ValuG'


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
        });
    
    

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