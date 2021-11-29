import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
require('babel-polyfill');

//ganache-cli -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" -a 100 -g 1 -l 20000000

let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));

web3.eth.defaultAccount = web3.eth.accounts[0];

let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
let flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);

const ORACLES_NUMBER = 20;

let airlines = ["air france", "malaysia airlines", "garuda indonesia", "air america"]

async function registerAirlines() {
  return new Promise((resolve, reject) => {
      web3.eth.getAccounts().then(accounts =>{
      console.log(accounts[0])
      let nbrAirlinesRegistered = 0 
      let nbrAirlinesFunded = 0

      flightSuretyApp.methods.getMinFund().call().then(minFund => {
        console.log("Min fund " + minFund)
        flightSuretyApp.methods.fund().send({
          from: accounts[0],
          value: minFund,
          gas: 2000000,
          gasPrice: 1
        }).then(() => {
          accounts.slice(26,29).forEach(newAirlineAddress => {
              let nbrAirlinesRegistered = 0 
              console.log("register airline: "+ nbrAirlinesRegistered + "account" +newAirlineAddress)
              
              flightSuretyApp.methods.registerAirline(
                newAirlineAddress,
                airlines[nbrAirlinesRegistered]
              ).send({
                  from: accounts[0],
                  gas: 2000000,
                  gasPrice: 1
                }).then(() => {
                  console.log("Airfline address account: " + newAirlineAddress)
                  nbrAirlinesRegistered += 1
                  
                  flightSuretyApp.methods.fund().send({
                    from: newAirlineAddress,
                    value: minFund,
                    gas: 2000000,
                    gasPrice: 1
                  }).then(() => {
                    console.log("Airline funded "+newAirlineAddress)
                    nbrAirlinesFunded +=1
                    if(nbrAirlinesFunded==3){
                      let time = 1637885911 //Math.floor(Date.now() / 1000)
                      flightSuretyApp.methods.registerFlight(
                        "GA2015",
                        time
                      ).send({
                        from: newAirlineAddress,
                        gas: 2000000,
                        gasPrice: 1
                      }).then(()=> {
                        console.log("Flight registered, flight: GA2015"+", Time: " +
                         time + " Address: "+newAirlineAddress) 
                      })

                    }
                  })
                })
          })
        })
     })
    })
  });

}

registerAirlines().then(airlines =>{
  console.log("Airline regitration finished")
});

let oracles = [];
const STATUS_CODES = [0, 10, 20, 30, 40, 50];
async function initOracleRegistration() {
    return new Promise((resolve, reject) => {

      web3.eth.getAccounts().then(accounts =>{
        let nbrOraclesRegistered = 0 

        flightSuretyApp.methods.REGISTRATION_FEE().call().then(fee => {

            accounts.slice(79,99).forEach(account => {
              console.log("register oracle: "+account)
              flightSuretyApp.methods.registerOracle().send({
                  from: account,
                  value: fee,
                  gas: 2000000,
                  gasPrice: 1
              })
              .then(() => {
                  console.log("get indexes for account: "+account)
                  flightSuretyApp.methods.getMyIndexes().call({
                      from: account,
                      gas: 2000000,
                      gasPrice: 1
                  }).then(result => {
                      console.log(`Oracle Registered .: ${result[0]}, ${result[1]}, ${result[2]} at ${account}`);
                      nbrOraclesRegistered += 1;
                      oracles.push({account, result, STATUS_CODES})
                      if (nbrOraclesRegistered==ORACLES_NUMBER) {
                          resolve(oracles);
                      }
                  }).catch(error => {
                      console.log("push result fail.")
                      reject(error);
                  });
              }).catch(error => {
                  console.log("get index fail.")
                  reject(error);
              })
          })
        }).catch(error => {
            console.log("get fee fail.")
            reject(error);
        })
      }).catch(error => {
          console.log("fail on get account.")
          reject(error);
      })
    });
}
  
initOracleRegistration().then(oracles =>{
    console.log("Oracle regitration finished")
});

flightSuretyApp.events.BuyInsurance({
    fromBlock: 0
}, function (error, event) {
    if (error)  {
        console.log(error)
    }
    console.log(event)
});

flightSuretyData.events.PolicyHolderPayoutReceived({
    fromBlock: 0
}, function (error, event) {
    if (error)  {
        console.log(error)
    }
    console.log(event)
});

const STATUS_CODE_AIRLINE_LATE = 20

flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, function (error, event) {
      if (error) {
          console.log(error)
      }
      console.log(event);

      let airline = event.returnValues.airline;
      let flight = event.returnValues.flight;
      let timestamp = event.returnValues.timestamp;
      let index = event.returnValues.index;

        console.log(airline)
        console.log(flight)
        console.log(timestamp)
        console.log(index)

      for(let a=0; a< oracles.length; a++){
        console.log("Oracle loop val", oracles[a].indexes);
        console.log("Oracle loop val", oracles[a].account);
        console.log("Oracle loop val", oracles[a].result);
        if(oracles[a].result[0]==index ||
           oracles[a].result[1]==index ||
           oracles[a].result[2]==index) {

                console.log({ index,
                              airline,
                              flight,
                              timestamp })
                flightSuretyApp.methods
                .submitOracleResponse(index,
                                      airline,
                                      flight,
                                      timestamp,
                                      20)
                .send({
                  from: oracles[a].account,
                  gas: 2000000,
                  gasPrice: 1
                }).then(result => {
                  console.log(result.events.FlightStatusInfo.returnValues)
                }).catch(err => {
                  console.log("No response from the oracle");
                  console.log("error "+err)
                });
           }
      }

  });

const app = express();
app.get('/api', (req, res) => {
    console.log("hello from server.js.")
    res.send({
      message: 'An API for use with your Dapp!'
    })
})


// List of flight numbers
const flightList = [
  {"index": 0, "code": "AF441"},
  {"index": 1, "code": "AF443"},
  {"index": 2, "code": "AL234"},
  {"index": 3, "code": "DT720"},
  {"index": 4, "code": "AM220"},
  {"index": 5, "code": "ID620"}];

app.get('/flights', (req, res) => {
  res.json({
    result: flightList
  })
})

export default app;


