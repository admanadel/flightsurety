
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });
    
        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })

        DOM.elid('get-flight-info').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            let airlineAddress = DOM.elid('airline-address').value;

            // Write transaction
            contract.getFlightInfo(flight, airlineAddress, (error, result) => {
                console.log("flight info " + result[0])
                console.log("error " + error)
            });
        })

        
        DOM.elid('insure-flight').addEventListener('click', () => {
            let flightToInsure = DOM.elid('flight-number-to-insure').value;
            let insureeAddress = DOM.elid('insuree-address').value;
            let airlineAddress = DOM.elid('airline-address').value;
            let premiumValue = DOM.elid('premium-value').value;
            
            // Write transaction
            contract.insureFlight(flightToInsure, insureeAddress, airlineAddress, premiumValue, (error, result) => {
                console.log(error)
                console.log(result)
                console.log(result)
                // display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })
    
    });
    

})();


function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}







