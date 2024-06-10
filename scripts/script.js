function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(
            "Name: " + feature.properties.name + "<br>" +
            "Type: " + feature.properties.type + "<br>" +
            "State: " + feature.properties.state
        );
        layer.bindTooltip(
            feature.properties.name,{
            direction: "top",
            offset: [0,-15],
            permanent : true,
            className: "labels",
        }).openTooltip();
    }
}

async function loadSampleData() {
    // load the sample geojson from a file and return it as a json object
    const sampleDataPath = "./data/sample.geojson";
    const request = new Request(sampleDataPath);
    const response = await fetch(request);
    const geojsonData = await response.json();
    return geojsonData
}

function createOverlay(){
    // create a title overlay to display a heading
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

function createStyle(feature){
    let style = {}
    style.color =  feature.properties.stroke
    style.weight = feature.properties["stroke-width"]
    style.opacity = feature.properties["stroke-opacity"]
    style.fillColor = feature.properties["fill"]
    style.fillOpacity= feature.properties["fill-opacity"]
    return style
}

document.addEventListener('DOMContentLoaded', async function() {
    // setup base maps 
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
    });
    var osmCycling = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
    });
    var cartoDb = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data: © Cartodb'
    });
 

    var baseMapsSelection = {
        "Open Street Map - Standard": osm,
        "Open Street Map - Humanitarian Style": osmHOT,
        "Open Street Map - Cycling": osmCycling,
        "Open Topo Map": openTopoMap,
        "Carto DB - Light": cartoDb,
    };           

    //load in sample geojson from separate file
    geojsonData = await loadSampleData()

    // convert geojson to a leaflet element
    var sampleLayer = L.geoJSON(geojsonData, {
        // setup popup box logic
        onEachFeature: onEachFeature ,
        //setup styles
        style: function(feature) {
            return createStyle(feature)
        },
        //setup point styles including icon selection
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                title : feature.properties.name,
                icon : createIcon(feature)
            });
        }  
    });

    // filter the sample features into categories
    var samplePointsLayer = L.featureGroup(),
        sampleLinesLayer = L.featureGroup(), 
        samplePolyLayer = L.featureGroup();
    for (let i in sampleLayer._layers) {
        let layer = sampleLayer._layers[i];        
        if (layer.feature.geometry.type == "Point") {
            layer.addTo(samplePointsLayer);
        } else if (layer.feature.geometry.type == "LineString") {
            layer.addTo(sampleLinesLayer);
        } else if (layer.feature.geometry.type == "Polygon") {
            layer.addTo(samplePolyLayer);
        }
    }   
    
    // build menu object for sample features
    var featureSelection = {
        "Sample GeoJSON - All" : sampleLayer,
        "Sample GeoJSON - Points" : samplePointsLayer,
        "Sample GeoJSON - Lines" : sampleLinesLayer,
        "Sample GeoJSON - Polys" : samplePolyLayer,
    };

    // setup map 
    var map = L.map('map',{
        center: [-32.589161, 119.532889],
        zoom: 6,
        layers: [osm, sampleLayer]
    });

    // create button in the top right for loading different base maps and features
    var layerControl = L.control.layers(baseMapsSelection, featureSelection).addTo(map);
    
    // create title overlay
    overlay = createOverlay();
    new overlay({ position: 'topleft' }).addTo(map);
});