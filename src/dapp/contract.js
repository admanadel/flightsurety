import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
// import { call } from 'file-loader';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = ["0x9EE19563Df46208d4C1a11c9171216012E9ba2D0",
        "0x068729ec4f46330d9Af83f2f5AF1B155d957BD42",
        "0x39Ae04B556bbdD73123Bab2d091DCD068144361F"];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
           
            this.owner = accts[0];

            let counter = 1;
            
//            while(this.airlines.length < 5) {
//                this.airlines.push(accts[counter++]);
//            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: 1637885911
//            Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }

    getFlightInfo(flight, airlineAddress, callback) {
        let self = this;
        let payload = {
            airline: airlineAddress,
            flight: flight,
            timestamp: 1637885911
//            Math.floor(Date.now() / 1000)
        }
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }

    insureFlight(flight, insureeAddress, airlineAddress, premium){
        let self = this;

         let payload = {
             airline: airlineAddress,
             flight: flight,
             premium: Web3.utils.toWei(premium, 'ether'),
             timestamp: 1637885911
//             Math.floor(Date.now() / 1000)
         }

        console.log("contract; flight:" + flight + " insureeAddr:" + insureeAddress+ " airlineAddr:"+
        airlineAddress+ " premium:"+Web3.utils.toWei(premium, 'ether') +
         " timestamp: "+ payload.timestamp)


         self.flightSuretyApp.methods
         .buy(payload.airline,
             payload.timestamp,
             payload.flight)
         .send({
                 from: self.owner,
                 value: payload.premium,
                 gas: 2000000,
                 gasPrice: 1 });
    }
}