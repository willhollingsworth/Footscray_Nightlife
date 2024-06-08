
function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(
            "Name: " + feature.properties.name + "<br>" +
            "Type: " + feature.properties.type + "<br>" +
            "State: " + feature.properties.state
        );
    }
}

async function loadSampleData() {
    const sampleDataPath = "./data/sample.geojson";
    const request = new Request(sampleDataPath);
    const response = await fetch(request);
    const geojsonData = await response.json();
    return geojsonData
}

document.addEventListener('DOMContentLoaded', async function() {
    var map = L.map('map').setView([-32.589161,  119.532889], 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    geojsonData = await loadSampleData()
    L.geoJSON(geojsonData, {
        onEachFeature: onEachFeature ,
        style: function(feature) {
            // switch (feature.properties.party) {
                // case 'Republican': return {color: "#ff0000"};
            return {color: feature.properties.stroke};
            }    
        }
).addTo(map);
});