const Oracle = require(__dirname + '/oracle');
const oracle = new Oracle();

class DataPoint {
    constructor(timestamp, reading) {
        this.ts = timestamp;
        this.reading = reading;
    }
}

function saveDataPoints(deviceIdList, messageKey, dataStore) {
    deviceIdList.forEach(deviceId => {
        oracle.receive(deviceId, message => {
            if(message['device_data'].hasOwnProperty(messageKey)) {
                const data = new DataPoint(Date.now(), message['device_data'][messageKey]);
                if(dataStore.hasOwnProperty(deviceId)) {
                    dataStore[deviceId].push(data);
                } else {
                    dataStore[deviceId] = [data];
                }
                console.log(`[${data.ts}] ${messageKey} data stored for ${deviceId}. Reading = ${data.reading}`);
            }
        });
    });
}

function hasOccupancyData(location) {
    if(locationOccSensorMapping.hasOwnProperty(location)) {
        const occSensorId = locationOccSensorMapping[location];
        return occupancyData.hasOwnProperty(occSensorId);
    } else {
        console.err(`no occupancy sensor for location ${location}`);
        process.exit(1);
    }
}

function isOccupied(location) {
    const occSensorId = locationOccSensorMapping[location];
    const data = occupancyData[occSensorId];
    return data[data.length - 1].reading === 1;
}

function hasTemperatureData(location) {
    if(locationTemperatureMapping.hasOwnProperty(location)) {
        // check if at least one temperature sensor has reading for this location
        const temperatureSensorList = locationTemperatureMapping[location];
        return temperatureSensorList.map(tempSensorId => temperatureData[tempSensorId])
            .some(tempReadings => tempReadings && tempReadings.length >= 1);
    } else {
        console.err(`no temperature sensors for location ${location}`);
        process.exit(1);
    }
}

function removeTemperatureData(location) {
    const temperatureSensorList = locationTemperatureMapping[location];
    temperatureSensorList.forEach(tempSensorId => temperatureData[tempSensorId] = []);
}

function getMeanTemperature(location) {
    const temperatureSensorList = locationTemperatureMapping[location];
    const readings = temperatureSensorList.map(tempSensorId => temperatureData[tempSensorId])
        .filter(tempReadings => tempReadings && tempReadings.length >= 1)
        .map(tempReadings => tempReadings[tempReadings.length - 1].reading);
    return readings.reduce((a,b) => a + b, 0) /readings.length;
}

// const temperatureSensorIds = ['018a33c5', '018a242d', '018a29bd', '018317c3', '018a29cc', '018a2c81', '018a1f05',
//     '018a271b', '018a2154', '018a27a2', '018a461f', '018a2e6d', '018a27f4', '018a44b5', '018a2ac3', '018a1f0e',
//     '018a1e13', '018a1dfd', '018a30c9', '018a343d', '018a1df9', '018a26ba', '018a32d6', '018a33be', '018a2d70',
//     '018a2fab', '018a2167', '018a2cd7', '018a2933', '018a2087', '018a2123', '018a2adf', '018a3195', '018a4759',
//     '018a2136', '018a47e0'];
const temperatureSensorIds = ['ab2a202382bffcf7', '631b445917a8187d', '09260b666f063af3', '6b7d007c97010f79',
    '418b020b22395db9', '416cd80e78a8973a', 'e0c86198d654b83f', '7369c891416f01f8',
    'f0d3b461601a8eb8', '9ccf068d3a3f9552', 'eccf56bb21edbca8', 'a7f99320f36aef4f',
    '4df66832b7c7db11', 'b4ef0a3928091e1c', '96005ba70a4263cc', 'c5bb0e3f22359233',
    '79e5f6541a8eb028', '79b17a36c70fbc62', '6b8daccee43180c8', '3c5f8092ba173bb4',
    '1cf9f770ac3736f6', '09635d5057e9d297', 'e7c6152f88177194', '988a18a6d581cd2c',
    '5dd4decc00746db6', 'dd4b76d60ab51a5c', '75753ef8ef66cdb6', '9071162789016603',
    '4bdb493c11490cbb', '7e9e559f484ede2e', '1b9e435ca41b4092', 'f3a7ba1dce226931',
    '32972750373c3193', 'd0d075462164533c', 'ad4b4a9f5f3a1775', 'c97bd4ae879d0fdc',
    'c3ffcb4971296d3a', '8cfebc3d438b0718', '38dff3e1ee75b1f6', '0640353467f0a180',
    'f7576e9fe5d97e8b', 'dd8218843406bd74', 'fbeb9f38e5b190ad', 'd4fed131538494af',
    'b140ea93b954564f', 'a0a891e1af95db47', 'a11005aea7a782e2', 'efebceea9a89e7d5',
    'd823e03e9f57a002', 'c8208af32e4c46aa', 'b95537ed825d16d3', '11f1ac7e1f1bf34d',
    'e81726588245cfb1', '4b34a26496684528', 'd7fc65df1c4217db', '3f41acab63491774'];
const occupancySensorIds = ['050d5e42', '00880cc5', '050d69ce', '051087b1', '050d68bf', '0197303a', '050d7773',
    '050d6990', '00888e93', '05083a3c', '0512871d', '050d8c55', '05073696', '0580b1cd'];
// const locationTemperatureMapping = { // location -> [temp1, temp2, ...]
//     loc1: ['018a33c5', '018a242d', '018a2933'],
//     loc2: ['018a29bd', '018317c3', '018a2087'],
//     loc3: ['018a29cc', '018a2c81', '018a2123'],
//     loc4: ['018a1f05', '018a271b'],
//     loc5: ['018a2154', '018a27a2', '018a2136', '018a47e0'],
//     loc6: ['018a461f', '018a2e6d'],
//     loc7: ['018a27f4', '018a44b5', '018a4759'],
//     loc8: ['018a2ac3', '018a1f0e'],
//     loc9: ['018a1e13', '018a1dfd', '018a3195'],
//     loc10: ['018a30c9', '018a343d'],
//     loc11: ['018a1df9', '018a26ba'],
//     loc12: ['018a32d6', '018a33be'],
//     loc13: ['018a2d70', '018a2fab'],
//     loc14: ['018a2167', '018a2cd7', '018a2adf']
// };
const locationTemperatureMapping = { // location -> [temp1, temp2, ...]
    loc1: ['ab2a202382bffcf7', '631b445917a8187d', '09260b666f063af3', '6b7d007c97010f79'],
    loc2: ['418b020b22395db9', '416cd80e78a8973a', 'e0c86198d654b83f', '7369c891416f01f8'],
    loc3: ['f0d3b461601a8eb8', '9ccf068d3a3f9552', 'eccf56bb21edbca8', 'a7f99320f36aef4f'],
    loc4: ['4df66832b7c7db11', 'b4ef0a3928091e1c', '96005ba70a4263cc', 'c5bb0e3f22359233'],
    loc5: ['79e5f6541a8eb028', '79b17a36c70fbc62', '6b8daccee43180c8', '3c5f8092ba173bb4'],
    loc6: ['1cf9f770ac3736f6', '09635d5057e9d297', 'e7c6152f88177194', '988a18a6d581cd2c'],
    loc7: ['5dd4decc00746db6', 'dd4b76d60ab51a5c', '75753ef8ef66cdb6', '9071162789016603'],
    loc8: ['4bdb493c11490cbb', '7e9e559f484ede2e', '1b9e435ca41b4092', 'f3a7ba1dce226931'],
    loc9: ['32972750373c3193', 'd0d075462164533c', 'ad4b4a9f5f3a1775', 'c97bd4ae879d0fdc'],
    loc10: ['c3ffcb4971296d3a', '8cfebc3d438b0718', '38dff3e1ee75b1f6', '0640353467f0a180'],
    loc11: ['f7576e9fe5d97e8b', 'dd8218843406bd74', 'fbeb9f38e5b190ad', 'd4fed131538494af'],
    loc12: ['b140ea93b954564f', 'a0a891e1af95db47', 'a11005aea7a782e2', 'efebceea9a89e7d5'],
    loc13: ['d823e03e9f57a002', 'c8208af32e4c46aa', 'b95537ed825d16d3', '11f1ac7e1f1bf34d'],
    loc14: ['e81726588245cfb1', '4b34a26496684528', 'd7fc65df1c4217db', '3f41acab63491774']
};
const locationOccSensorMapping = { // location -> occ sensor. each occ-sensor covers a location.
    loc1: '05073696',
    loc2: '0580b1cd',
    loc3: '05083a3c',
    loc4: '0512871d',
    loc5: '050d8c55',
    loc6: '00888e93',
    loc7: '050d6990',
    loc8: '050d7773',
    loc9: '0197303a',
    loc10: '050d68bf',
    loc11: '051087b1',
    loc12: '050d69ce',
    loc13: '00880cc5',
    loc14: '050d5e42'
};

const temperatureData = {}; //tempSensorId => [reading]
const occupancyData = {}; //occSensorId => [reading]

saveDataPoints(occupancySensorIds, 'PIR Status', occupancyData);
saveDataPoints(temperatureSensorIds, 'temperature', temperatureData);

// every 5 mins do a check of what's the status like
setInterval(() => {
    console.log("performing routine checkup");

    console.log('occupancyData');
    console.log(occupancyData);

    console.log('temperatureData');
    console.log(temperatureData);

    Object.keys(locationOccSensorMapping).forEach(location => {
        console.log(`${location}`);
        console.log('=====');
        // get current occupancy of location
        if(!hasOccupancyData(location)) {
            console.log(`no occupancy data for ${location}`);
        } else {
            console.log(`occupancy data available for ${location}`);
            const occupied = isOccupied(location);
            console.log(`Location is ${occupied ? 'occupied' : 'unoccupied'}`)
        }

        // compute the min, mean, max temperature of all temperature sensors in that location
        if(!hasTemperatureData(location)) {
            console.log(`no temperature data for ${location}`);
        } else {
            console.log(`temperature data available for ${location}`);
            const meanTemperature = getMeanTemperature(location);
            console.log(`mean temperature = ${meanTemperature}`);
            if((meanTemperature < 20 || meanTemperature > 30)) {
                // uncomfortable
                console.log(`User comfort not maintained at location ${location}`);
                if(meanTemperature < 20) {
                    // energy wastage
                    console.log(`Energy wasted at location ${location} due to over cooling`);
                }
            } else {
                console.log(`comfort good`);
            }
            removeTemperatureData(location);
            console.log(`removed temp data for ${location}`);
        }
        // TODO: clear last 5 mins data? depends on freq of data production. maybe just remove temp sensor values?
        
    })
}, 1 * 60 * 1000);