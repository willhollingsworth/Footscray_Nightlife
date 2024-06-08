
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

function createOverlay(){
    let overlay   = L.Control.extend({
        onAdd: function() {
        var text = L.DomUtil.create('div');
        text.id = "overlay";
        text.innerHTML = "<h2>" + "Leaflet Testing" + "</h2>"
        return text;
        },
    
    });
    return overlay;
}

function createIcon(feature){
    let path = ''
    switch (feature.properties.type){
        case "City" : 
            path = './icons/city-marker.svg'
            break;
        case "Town" : 
            path = './icons/town-marker.svg'
            break;
        default : 
            path = './icons/coffee-marker.svg'
        }
    var myIcon = L.icon({
        iconUrl: path,
        iconSize: [40, 100],
        iconAnchor: [20, 65],
        popupAnchor: [0, -35]
    });
    return myIcon
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
        },
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                title : feature.properties.name,
                icon : createIcon(feature)
            });
        }  
    }
).addTo(map);
overlay = createOverlay();
new overlay({ position: 'topleft' }).addTo(map);
});