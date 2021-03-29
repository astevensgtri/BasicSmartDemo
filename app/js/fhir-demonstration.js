// OMOPonFHIR supports the following 8 resources for SMART Apps (as of 3/29/2021, OMOPv5.3.1/FHIR STU3)
// Condition
// DocumentReference
// Encounter
// Medication Statement
// Medication Request
// Observation
// Patient
// Procedure

// Need to add the following resources:
// DocumentReference
// Encounter
// Medication Statement
// Procedure (in process)

function displayPatientDemographics(client) {

    // Request full Patient resource.

    client.patient.read()
        .then(patient => {

                // Log the Patient to the console to demonstrate structure.
                console.log(patient);

                var officialName = findOfficialName(patient.name);
                console.log(officialName);

                // Set the Patient's information in the DOM.
                document.getElementById('name').innerText = getFullNameAsString(officialName);
                document.getElementById('gender').innerText = patient.gender;
                document.getElementById('birthdate').innerText = patient.birthDate;
            })
        .catch(console.error);
}


function displayPatientObservations(client) {

    // Fetch specific Observations by LOINC Codes. Note that performing the request from the patient as shown and not
    // the client directly will automatically handle wrapping the query with the patient's ID.

    client.patient.request("Observation?code=http://loinc.org|29463-7")
        .then(result => {
                document.getElementById('pt_weight').innerText = getValueAndUnit(result.entry[0].resource.valueQuantity);
            })
        .catch(console.error);

    client.patient.request("Observation?code=http://loinc.org|8302-2")
        .then(result => {
                document.getElementById('pt_height').innerText = getValueAndUnit(result.entry[0].resource.valueQuantity);
            })
        .catch(console.error);
}

function displayEncounter(client) {

    //Andy: yikes
    //Fetch the current encounter from the server

    client.patient.request("Encounter")
        .then(result => {
            document.getElementById('encounter').innerText = entry.resource.class.display;
            document.getElementById('encounter_start').innerText = entry.resource.period.start;
            document.getElementById('encounter_end').innerText = entry.resource.period.end;
        })
        .catch(console.error)
}


function displayConditions(client) {

    // Fetch the Patient's Conditions from the server.

    client.patient.request("Condition")
        .then(conditionBundle => {
                var conditionElement = document.getElementById('conditions');
                conditionBundle.entry
                    .forEach(entry => {
                        var conditionDisplay = entry.resource.code.coding[0].display;
                        conditionElement.innerHTML += '<li>' + conditionDisplay + '</li>';
                    });
            })
        .catch(console.error);
}

function displayProcedures(client) {
    // Andy: yikes
    // Fetch the Patient's Procedures from the server

    client.patient.request("Procedure")
        .then(procedureBundle => {
            var procedureElement = document.getElementById('procedures');
            procedureBundle.entry
                .forEach(entry => {
                    var procedureDisplay = entry.resource.code.coding[0].display;
                    procedureElement.innerHTML += '<li>' + procedureDisplay + '</li>';
                });
        })
        .catch(console.error);
}


function displayMedicationOrderDstu2(client) {

    // Fetch the Medication Statements from the server.

    client.patient.request("MedicationOrder")
        .then(medicationOrderBundle => {
            var medicationElement = document.getElementById('medicationOrders');
            medicationOrderBundle.entry
                .forEach(entry => {
                    var medicationDisplay = entry.resource.medicationCodeableConcept.coding[0].display;
                    medicationElement.innerHTML += '<li>' + medicationDisplay + '</li>';
                });
        })
        // Then hide the Medication Request container as we aren't using it.
        .then(document.getElementById('medreq-container').style.display = 'none')
        .catch(console.error);
}

function displayMedicationRequestsR4(client) {

    // Fetch the Medication Requests from the server.
    client.patient.request("MedicationRequest")
        // Call the function to handle Medication Requests.
        .then(medicationRequestBundle => {
            var medicationRequestElement = document.getElementById('medicationRequests');
            medicationRequestBundle.entry.forEach(
                entry => {
                    var medicationRequestDisplay = entry.resource.medicationCodeableConcept.coding[0].display;
                    medicationRequestElement.innerHTML += '<li>' + medicationRequestDisplay + '</li>';
                });
        })
        // Then hide the Medication Statement container as we aren't using it.
        .then(document.getElementById('medorder-container').style.display = 'none')
        .catch(console.error);
}


// Quick helper function to find the (first?) instance of a HumanName with use of official, if none is
// found returns the first name in the array as a fallback.
function findOfficialName(humanNameArray) {
    var officialName = humanNameArray[0];
    humanNameArray.forEach(name => {
        if (name.use === 'official') {
            officialName = name;
        }
    });
    return officialName;
}

// Helper function to parse a full name from the FHIR HumanName type.
function getFullNameAsString(humanName) {
    var fullName = "";

    if (humanName.prefix !== undefined) humanName.prefix.forEach(prefix => fullName += prefix + " ");
    if (humanName.given !== undefined) humanName.given.forEach(given => fullName += given + " ");
    if (humanName.family !== undefined) fullName += humanName.family;
    if (humanName.suffix !== undefined) humanName.suffix.forEach(suffix => fullName += " " + suffix);

    return fullName;
}

// Helper function to parse a value and unit of measurement from Observation valueQuantity.
function getValueAndUnit(valueQuantity) {
    var value = valueQuantity.value;
    var unit = valueQuantity.unit;
    return value + " " + unit;
}