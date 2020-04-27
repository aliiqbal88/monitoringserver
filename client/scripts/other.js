"use strict"

import {lastPacketExport} from './charting.js'

console.log('beforeJquery');

var ecoIter = 1;
var ecoCycle = [{
        title: "Coal Saved:",
        icon: 'svg/coal.svg',
        value: 0,
        unit: "Tonnes"
    },
    {
        title:"Trees Saved",
        icon:"svg/tree.svg",
        value: 0,
        unit: ""
    },
    {
        title: "CO2 Reduced",
        icon: 'svg/co2.svg',
        value: 0,
        unit: "Tonnes"
    }

]


$(document).ready(function(){
    //console.log('after jquery');
    
    setInterval(() => {
        $("#ecoShow")
            .fadeOut(1000,()=>{
                $("#ecoLabel").text(ecoCycle[ecoIter].title);
                //console.log(ecoCycle[ecoIter].icon);
                $("#iconPath").attr('src',ecoCycle[ecoIter].icon);
                ecoIter= (ecoIter+1)%ecoCycle.length;
                
            })
            .fadeIn(1000);
    }, 5000);

    
    
});