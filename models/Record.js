const mongoose = require('mongoose')
const Schema = mongoose.Schema;


// Create schema

const RecordSchema = new Schema({
    weatherData:{
        DeviceAddress: Number,
        WCOMPort: String,
        WModBus: String,
        WAmbientTemperature:Number,
        WPVModuleTemperature:Number,
        WAmbientPressure:Number,
        WSolarRadiation:Number,
        WWindDirection:Number,
        WWindSpeed:Number
    },
    inverterData: [{
        DeviceAddress: Number,
        ICOMPort: String,
        IModBus: String,
        INominalOutputPower: Number,
        IDailyPowerYield: Number,
        IActivePower:Number,
        IDailyPowerYield:Number,
        ITotalPowerYield:Number,
        IworkState:Number,
        IFaultCode:Number,
        
    }
    ],
    date:{
        type:Date,
        default:Date.now
    },
    wPktSuccess: Boolean,
    iPktSuccess: Boolean
    
});

module.exports = Record = mongoose.model('monitoringRecord',RecordSchema);
