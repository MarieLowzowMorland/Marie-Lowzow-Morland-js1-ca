const urlMunicipalityInfoApi = "https://ws.geonorge.no/kommuneinfo/v1/kommuner/";
const urlWeatherApi= "https://api.met.no/weatherapi/locationforecast/2.0/complete?"

const loading = '<div class="loading"></div>';

const noMunicipalityErrormessage = (municipalityNumber) => `<div class="errorMessage">Something went wrong... Could not find municipality number ${municipalityNumber}.</div>`;
const noWeatherErrormessage = (municipalityName) => `<div class="errorMessage">Something went wrong... Could not find weather information for ${municipalityName}.</div>`;

const addToDOM = (html) => document.getElementById("municipality-weather").innerHTML = html;

const findMunicipalityNumber = () => {
    const search = location.search; 
    return search.substr(search.indexOf("=") + 1);
}

const showMunicipality = async () => {
    const municipalityNumber = findMunicipalityNumber();
    if(!municipalityNumber){
        window.location.href = "/index.html";
    }
    
    addToDOM(loading);
    
    try {
        const response = await fetch(`${urlMunicipalityInfoApi}${municipalityNumber}`);
        const municipality = await response.json();
        const {fylkesnavn, kommunenavn, punktIOmrade} = municipality;
        addToDOM(`
            <h2>${kommunenavn}</h2>
            <p>Municipality number: <span class="bold">${municipalityNumber}</span></p>
            <p>County: <span class="bold">${fylkesnavn}</span></p>
            ${await getWeatherForCoordinates(punktIOmrade.coordinates, kommunenavn)}`
        );
    } catch (error) {
        console.log(error);
        addToDOM(noMunicipalityErrormessage(municipalityNumber));
    }
};

const weatherTimeseriesHtmlTableRow = (timeserie) => {
    const {air_temperature, wind_speed, } = timeserie.data.instant.details;
return `<tr>
    <td>${timeserie.time}</td>
    <td>???</td>
    <td>${air_temperature}</td>
    <td>${wind_speed}</td>
</tr>`
};

const getWeatherForCoordinates = async (coordinates, municipalityName) => {
    try {
        const [lon, lat] = coordinates;
        const response = await fetch(`${urlWeatherApi}lon=${lon}&lat=${lat}`);
        const weatherInfo = await response.json();
        
        return `
        <table>
            <thead>
                <th>Time</th>
                <th>Weather</th>
                <th>Temperature</th>
                <th>Wind</th>
            </thead>
            <tbody>
                ${weatherInfo.properties.timeseries
                    .map(weatherTimeseriesHtmlTableRow)
                    .join("")
                }
            </tbody>
        </table>`
    } catch (error) {
        console.log(error);
        return noWeatherErrormessage(municipalityName);
    }
};

showMunicipality();


