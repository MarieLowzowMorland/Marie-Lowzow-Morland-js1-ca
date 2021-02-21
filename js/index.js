const urlMunicipalityInfoApi = "https://ws.geonorge.no/kommuneinfo/v1/fylkerkommuner";

const loading = '<div class="loading"></div>';
const errormessage = '<div class="errorMessage">Something went wrong... Try again later.</div>';

const addToDOM = (html) => document.getElementById("options").innerHTML = html;

const showMunicipalityOptions = async () => {
    addToDOM(loading);
    
    try {
        const response = await fetch(urlMunicipalityInfoApi);
        const counties = await response.json();
        addToDOM(countiesToOptions(counties));
        subscribeToChange();
    } catch (error) {
        console.log(error);
        addToDOM(errormessage);
    }
};

const countiesToOptions = (counties) => `
    <label for="municipality-slector">Your municipality:</label>
    <input list="municipality-list" id="municipality-slector" placeholder="Choose a municipality"/>
    <datalist name="municipality" id="municipality-list">
        ${counties.flatMap(countyToOptions).join("")}
    </datalist>`;

const countyToOptions = (county) => county.kommuner.map(municipalityToOption)

const municipalityToOption = (municipality) => {
    const {fylkesnavn: countyName, kommunenavn: municipalityName, kommunenummer: municipalityNumber} = municipality;
    return `
        <option value=${municipalityNumber}>
            ${municipalityName}, ${countyName}
        </option>`;
}

const subscribeToChange = () =>
    document.getElementById("municipality-slector").onchange = (event) => {
        const kommunenummer = event.target.value;
        window.location.href = "/details.html?municipalityNumber=" + kommunenummer;
    }


showMunicipalityOptions()

/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
https://www.w3schools.com/js/js_window_location.asp
*/
