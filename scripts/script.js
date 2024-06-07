function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        layer.bindPopup(
            "Name : " + feature.properties.name + "<br>" +
            "Type : " + feature.properties.type + "<br>" +
            "State : " + feature.properties.state
        
        );
    }
}
document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([-32.589161,  119.532889], 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var geojsonFeature = {
    "features": [
        {
            "geometry": {
                "coordinates": [
                    115.860458,
                    -31.950527
                ],
                "type": "Point"
            },
            "id": 0,
            "properties": {
                "marker-color": "#164be9",
                "marker-size": "large",
                "marker-symbol": 1,
                "name": "Perth",
                "state": "WA",
                "type": "City"
            },
            "type": "Feature"
        },
        {
            "geometry": {
                "coordinates": [
                    115.636093,
                    -33.327412
                ],
                "type": "Point"
            },
            "id": 1,
            "properties": {
                "marker-color": "#164be9",
                "marker-size": "medium",
                "marker-symbol": 2,
                "name": "Bunbury",
                "state": "WA",
                "type": "Town"
            },
            "type": "Feature"
        },
        {
            "geometry": {
                "coordinates": [
                    117.88473,
                    -35.02382
                ],
                "type": "Point"
            },
            "id": 2,
            "properties": {
                "marker-color": "#164be9",
                "marker-size": "medium",
                "marker-symbol": 3,
                "name": "Albany",
                "state": "WA",
                "type": "Town"
            },
            "type": "Feature"
        },
        {
            "geometry": {
                "coordinates": [
                    121.891944,
                    -33.861111
                ],
                "type": "Point"
            },
            "id": 3,
            "properties": {
                "marker-color": "#164be9",
                "marker-size": "medium",
                "marker-symbol": 4,
                "name": "Esperance",
                "state": "WA",
                "type": "Town"
            },
            "type": "Feature"
        },
        {
            "geometry": {
                "coordinates": [
                    121.476013,
                    -30.74799
                ],
                "type": "Point"
            },
            "id": 4,
            "properties": {
                "marker-color": "#164be9",
                "marker-size": "medium",
                "marker-symbol": 5,
                "name": "Kalgoorlie",
                "state": "WA",
                "type": "Town"
            },
            "type": "Feature"
        },
        {
            "geometry": {
                "coordinates": [
                    [
                        115.860458,
                        -31.950527
                    ],
                    [
                        117.88473,
                        -35.02382
                    ]
                ],
                "type": "LineString"
            },
            "id": 5,
            "properties": {
                "name": "Perth to Albany",
                "state": "WA",
                "stroke": "#ffa200",
                "stroke-opacity": 1,
                "stroke-width": 3,
                "type": "Link"
            },
            "type": "Feature"
        },
        {
            "geometry": {
                "coordinates": [
                    [
                        [
                            119.63876329950443,
                            -32.03845280379327
                        ],
                        [
                            120.04863847416522,
                            -32.03816405395313
                        ],
                        [
                            120.04685552432949,
                            -31.483145363576604
                        ],
                        [
                            119.67900576408238,
                            -31.483295898284062
                        ],
                        [
                            119.8115377286232,
                            -31.691546441283215
                        ],
                        [
                            119.63887265060669,
                            -31.771663437684396
                        ],
                        [
                            119.63880885005983,
                            -31.93077197638293
                        ],
                        [
                            119.65615009132767,
                            -31.930773454367554
                        ],
                        [
                            119.65612610930879,
                            -31.94494116120559
                        ],
                        [
                            119.63877961686802,
                            -31.944941948631836
                        ],
                        [
                            119.63876329950443,
                            -32.03845280379327
                        ]
                    ]
                ],
                "type": "Polygon"
            },
            "id": 6,
            "properties": {
                "fill": "#555555",
                "fill-opacity": 0,
                "marker-color": "#000000",
                "marker-size": "",
                "marker-symbol": "",
                "name": "Jilbadji Nature Reserve",
                "state": "WA",
                "stroke": "#fe0bf6",
                "stroke-opacity": 1,
                "stroke-width": 2,
                "type": "Boundary"
            },
            "type": "Feature"
        }
    ],
    "type": "FeatureCollection"
};
    L.geoJSON(geojsonFeature, {
        onEachFeature: onEachFeature ,
        style: function(feature) {
            // switch (feature.properties.party) {
                // case 'Republican': return {color: "#ff0000"};
            // return {color: "#ff0000"}; // hardcode to red
            return {color: feature.properties.stroke};
            }    
        }
).addTo(map);

});
