const Oracle = require(__dirname + '/oracle');
const oracle = new Oracle();
const fs = require('fs');

const stream = fs.createWriteStream('latency.log', {flags:'w'});
stream.write(`# latency (ms)\n`);

const deviceIdList = ['ab2a202382bffcf7', '631b445917a8187d', '09260b666f063af3', '6b7d007c97010f79',
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
    'e81726588245cfb1', '4b34a26496684528', 'd7fc65df1c4217db', '3f41acab63491774',
    '050d5e42', '00880cc5', '050d69ce', '051087b1', '050d68bf', '0197303a', '050d7773',
    '050d6990', '00888e93', '05083a3c', '0512871d', '050d8c55', '05073696', '0580b1cd'];

deviceIdList.forEach(deviceId => {
    oracle.receive(deviceId, message => {
        
        latency = curr_time - float(data['device_data']['xxxStartTs'])
        f.write(str(latency) + "\n")

        if(message['device_data'].hasOwnProperty('xxxStartTs')) {
            const startTs = message['device_data']['xxxStartTs'];
            const latency = Date.now() - startTs;
            stream.write(`${latency}\n`);
        }
    });
});