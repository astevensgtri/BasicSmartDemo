

function displayPatientDemographics(patient) {
    // Parse the first element of the name array into a single string.
    var fullName = getFullNameAsString(patient.name[0]);

    // Set the Patient's information in the HTML.
    document.getElementById('name').innerText = fullName;
    document.getElementById('gender').innerText = patient.gender;
    document.getElementById('birthdate').innerText = patient.birthDate;
}

function displayConditions(conditionBundle) {
    var conditionElement = document.getElementById('conditions');

    conditionBundle.entry.forEach(
        entry => {
            var conditionDisplay = entry.resource.code.coding[0].display;
            conditionElement.innerHTML += '<li>' + conditionDisplay + '</li>';
        });
}

function displayMedicationRequests(medicationRequestBundle) {
    var medicationRequestElement = document.getElementById('medicationRequests');

    medicationRequestBundle.entry.forEach(
        entry => {
            var medicationRequestDisplay = entry.resource.medicationCodeableConcept.coding[0].display;
            medicationRequestElement.innerHTML += '<li>' + medicationRequestDisplay + '</li>';
    });
}


// Helper method to parse a full name from the FHIR HumanName type.
function getFullNameAsString(humanName) {
    var fullName = "";
    console.log(humanName);

    if (humanName.prefix != undefined) humanName.prefix.forEach(prefix => fullName += prefix + " ");
    if (humanName.given != undefined) humanName.given.forEach(given => fullName += given + " ");
    if (humanName.family != undefined) fullName += humanName.family;
    if (humanName.suffix != undefined) humanName.suffix.forEach(suffix => fullName += " " + suffix);

    return fullName;
}