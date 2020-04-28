"use strict"

import {ecoDataExport} from './charting.js'


console.log('beforeJquery');

var ecoIter = 1;
var ecoCycle = [{
        title: "Coal Saved:",
        icon: 'svg/coal.svg',
        value: 0,
        unit: " kg",
        factor: 0.34
    },
    {
        title:"Trees Saved",
        icon:"svg/tree.svg",
        value: 0,
        unit: "",
        factor: 0.0214
    },
    {
        title: "CO2 Reduced",
        icon: 'svg/co2.svg',
        value: 0,
        unit: " kg",
        factor: 0.544
    }

]


$(document).ready(function(){
    //console.log('after jquery');
    
    setInterval(() => {
        $("#ecoShow")
            .fadeOut(500,()=>{
                $("#ecoLabel").text(ecoCycle[ecoIter].title);
                //console.log(ecoCycle[ecoIter].icon);
                $("#iconPath").attr('src',ecoCycle[ecoIter].icon);
                $("#ecoValue").text(Math.round(ecoCycle[ecoIter].factor*ecoDataExport.totalYield)+ecoCycle[ecoIter].unit);
                ecoIter= (ecoIter+1)%ecoCycle.length;

                //console.log(ecoDataExport);
            })
            .fadeIn(500);
    }, 5000);

    
    
});