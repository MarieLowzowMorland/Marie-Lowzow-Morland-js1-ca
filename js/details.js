const urlMunicipalityInfoApi = "https://ws.geonorge.no/kommuneinfo/v1/kommuner/";
const urlWeatherApi= "https://api.met.no/weatherapi/locationforecast/2.0/complete?"

const oneHourInMilliSeconds = 1000 * 60 * 60 * 24;
const loading = '<div class="loading"></div>';

const noMunicipalityErrormessage = (municipalityNumber) => 
    `<div class="errorMessage">
        Something went wrong... Could not find municipality number ${municipalityNumber}.
    </div>`;

const noWeatherErrormessage = (municipalityName) => 
    `<div class="errorMessage">
        Something went wrong... Could not find weather information for ${municipalityName}.
    </div>`;

const addToDOM = (html) => document.getElementById("municipality-weather").innerHTML = html;

const showMunicipality = async () => {
    const municipalityNumber = findMunicipalityNumber();
    if(!municipalityNumber){
        window.location.href = "/index.html";
    }
    
    addToDOM(loading);
    
    try {
        const response = await fetch(`${urlMunicipalityInfoApi}${municipalityNumber}`);
        const municipality = await response.json();
        const municipalityInfo = await municipalityToHtml(municipality);
        addToDOM(municipalityInfo);
    } catch (error) {
        console.log(error);
        addToDOM(noMunicipalityErrormessage(municipalityNumber));
    }
};

const findMunicipalityNumber = () => {
    const search = location.search;
    return search.substr(search.indexOf("=") + 1);
}

const municipalityToHtml = async (municipality) => {
    const {fylkesnavn: countyName, kommunenavn: municipalityName, punktIOmrade: point, kommunenummer: municipalityNumber} = municipality;
    
    return `
        <h2>${municipalityName}</h2>
        <p>Municipality number: <span class="bold">${municipalityNumber}</span></p>
        <p>County: <span class="bold">${countyName}</span></p>
        ${await getWeatherForCoordinates(point.coordinates, municipalityName)}
    `;
};

const getWeatherForCoordinates = async (coordinates, municipalityName) => {
    try {
        const [lon, lat] = coordinates;
        const response = await fetch(`${urlWeatherApi}lon=${lon}&lat=${lat}`);
        const weatherInfo = await response.json();
        return weatherInfoToHtml(weatherInfo);
    } catch (error) {
        console.log(error);
        return noWeatherErrormessage(municipalityName);
    }
};

const weatherInfoToHtml = (weatherInfo) => {
    const {timeseries, meta} = weatherInfo.properties;
    const {precipitation_amount, probability_of_precipitation, air_temperature, wind_speed} = meta.units;
    
    return `
        <table>
            <thead>
                <th>Time</th>
                <th>Precipitation Amount (${precipitation_amount})</th>
                <th>Probability of precipitation (${probability_of_precipitation})</th>
                <th>Air temperature (${air_temperature})</th>
                <th>Wind (${wind_speed})</th>
            </thead>
            <tbody>
                ${timeseries
                    .filter(next24hours)
                    .map(weatherTimeseriesHtmlTableRow)
                    .join("")
                }
            </tbody>
        </table>`;
} 

const next24hours = (timeserie) =>{
    const weatherDataTime = new Date(timeserie.time);
    const now = new Date();
    return (weatherDataTime - now) < oneHourInMilliSeconds;
};

const weatherTimeseriesHtmlTableRow = (timeserie) => {
    const {instant, next_1_hours, } = timeserie.data;
    const {air_temperature, wind_speed, } = instant.details;
    const {precipitation_amount, probability_of_precipitation } = next_1_hours && next_1_hours.details || {};

    return `<tr>
        <td>${new Date(timeserie.time).toLocaleString()}</td>
        <td>${precipitation_amount || ""}</td>
        <td>${probability_of_precipitation || ""}</td>
        <td>${air_temperature}</td>
        <td>${wind_speed}</td>
    </tr>`
};

showMunicipality();


/*
https://stackoverflow.com/questions/1226714/how-to-get-the-browser-to-navigate-to-url-in-javascript
https://wesbos.com/destructuring-renaming
*/