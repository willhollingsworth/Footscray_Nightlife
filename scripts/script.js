document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var geojsonFeature = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                [
                  -0.17628755879957225,
                  51.51272241113091
                ],
                [
                  -0.1813397079407082,
                  51.500152514431306
                ],
                [
                  -0.17242834901281867,
                  51.504405264286845
                ]
              ],
              "type": "LineString"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                [
                  [
                    -0.16173781654680397,
                    51.51087386442666
                  ],
                  [
                    -0.15193532304820678,
                    51.5042202970408
                  ],
                  [
                    -0.14273242864214808,
                    51.5101352038576
                  ],
                  [
                    -0.15817525035930657,
                    51.51604716432493
                  ],
                  [
                    -0.16173781654680397,
                    51.51087386442666
                  ]
                ]
              ],
              "type": "Polygon"
            }
          }
        ]
      };
    
    L.geoJSON(geojsonFeature).addTo(map);

});
