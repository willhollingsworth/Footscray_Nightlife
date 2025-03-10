
function onEachFeature(feature, layer) {
    if (feature.geometry.type == "Point") {
        // bind permanent tooltips to point features MARK:Bind labels
        layer.bindTooltip(
            feature.properties.Name,
            {
                direction: "top",
                offset: [0,-18],
                permanent : true,
                className: "labels",
        }).openTooltip();
        // bind sidebar logic
        layer.on("click", clickedFeature )
    }        
}

async function loadSampleData(location) {
    // given a relative geojson location, load that data and return it as a json object 
    // MARK: Load JSON
    const sampleDataPath = location;
    const request = new Request(sampleDataPath);
    const response = await fetch(request);
    const geojsonData = await response.json();
    return geojsonData
}

function createOverlay(){
    // create a title overlay to display a heading MARK: Title Overlay
    let overlay   = L.Control.extend({
        onAdd: function() {
        var text = L.DomUtil.create('div');
        text.id = "overlay";
        text.innerHTML = "<h2>" + "Footscray Nightlife" + "</h2>"
        return text;
        },
    });
    return overlay;
}

function createIcon(feature){
    // icon creation logic MARK: Create Icon
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
    // setup styles for features MARK: Feature styles
    let style = {}
    style.color =  feature.properties.stroke
    style.weight = feature.properties["stroke-width"]
    style.opacity = feature.properties["stroke-opacity"]
    style.fillColor = feature.properties["fill"]
    style.fillOpacity= feature.properties["fill-opacity"]
    return style
}

function loadBaseMaps(){
    // setup base maps  MARK: Basemaps
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
    // return the default map + all base maps ready for the toolbar
    return [osm, baseMapsSelection]
}

async function loadLeaflet(){
    // main leaflet logic
    //
    // load all basemaps and set a default basemap
    var [defaultMap, baseMapsSelection] = loadBaseMaps()
    
    //load in sample geojson from separate file MARK:GeoJSON
    locationData = await loadSampleData("./data/Nightlife_Locations.geojson")

    // convert geojson to a leaflet element
    var locationLayer = L.geoJSON(locationData, {
        // setup popup box logic
        onEachFeature: onEachFeature ,
        //setup styles
        style: function(feature) {
            return createStyle(feature)
        },
        //setup point styles including icon selection
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                title : feature.properties.Name,
                icon : createIcon(feature)
            });
        }  
    });
    //load in sample geojson from separate file MARK:GeoJSON
    boundaryData = await loadSampleData("./data/Footscray_Boundary.geojson")

    // convert geojson to a leaflet element
    var boundaryLayer = L.geoJSON(boundaryData);

    // build menu object for sample features MARK: Feature selection
    var featureSelection = {
        "Nightlife Locations" : locationLayer,
        "Boundary Layer" : boundaryLayer,
    };

    // setup map MARK: Map setup
    var map = L.map('map',{
        center: [-37.8, 144.9],
        zoom: 14,
        layers: [defaultMap, locationLayer]
    });

    // create button in the top right for loading different base maps and features
    // MARK: Create controls layer
    var layerControl = L.control.layers(baseMapsSelection, featureSelection).addTo(map);

    // create a fixed pane for absolute popup box positioning
    var pane = map.createPane('fixed', document.getElementById('map'));
    // set properties of pane
    map.getPane('fixed').style.zIndex = 1000

    // create title overlay MARK:create title overlay
    overlay = createOverlay();
    new overlay({ position: 'topleft' }).addTo(map);

    map.on('click', hideSidebar);
};

function clickedFeature() {
    updateSidebarContent(this)
    showSidebar()
}

function updateSidebarContent(element) {
    // MARK: Sidebar logic
    // set title of sidebar
    let title = document.getElementById('sidebar-title');
    title.innerHTML = element.feature.properties.Name
    // set description
    let description = document.getElementById('sidebar-description');
    description.innerHTML = '<h4>description</h4>'
    description.innerHTML += `<p>${element.feature.properties.description}</p>`
}

function showSidebar() {
    let sidebar = document.getElementById('sidebar')
    sidebar.style.left = '0%'
}

function hideSidebar() {
    let sidebar = document.getElementById('sidebar')
    sidebar.style.left = '-30%'
}

loadLeaflet()