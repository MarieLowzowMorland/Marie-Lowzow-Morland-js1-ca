const urlMunicipalities = "https://ws.geonorge.no/kommuneinfo/v1/fylkerkommuner";

const municipalityAnchorTag = (municipalityName) => `<a href="/character.html?municipality_name=${municipalityName}">${municipalityName}</a>`

document.getElementById("options").onchange = (event) => {
    const kommunenummer = event.target.value;
    window.location.href = "/details.html?id=" + kommunenummer;
}
