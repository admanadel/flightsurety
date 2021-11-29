const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require('fs');

module.exports = function(deployer, network, accounts) {

    let contractOwner = accounts[0];
    let firstAirline = accounts[1];

    deployer.deploy(FlightSuretyData, "Adminman", {from: contractOwner})
        .then(() => {
            deployer.deploy(FlightSuretyApp, FlightSuretyData.address, {from: contractOwner})
            .then(() => {
                let config = {
                    localhost: {
                        url: 'http://localhost:8545',
                        dataAddress: FlightSuretyData.address,
                        appAddress: FlightSuretyApp.address
                    }
                }

                fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
            });
        });
    
    

    // deployer.deploy(FlightSuretyData)
    // .then(() => {
    //     return deployer.deploy(FlightSuretyApp)
    //             .then(() => {
    //                 let config = {
    //                     localhost: {
    //                         url: 'http://localhost:8545',
    //                         dataAddress: FlightSuretyData.address,
    //                         appAddress: FlightSuretyApp.address
    //                     }
    //                 }
    //                 fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
    //                 fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
    //             });
    // });
}