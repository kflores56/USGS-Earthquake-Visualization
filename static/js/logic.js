//// CREATE LOCATION MARKERS ////

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// function to determine marker color (magnitude) 
// function chooseColor()

// function to determine marker size (depth)

// grab geoJSON data & bind pop-up information

// define array
var eqMarkers = [];

// loop through locations to create marker
for (var i = 0; i < link.length; i++) {
  eqMarkers.push(
    L.circle([link.features.geometry.coordinates[0], features.geometry.coordinates[1]], {
      stroke: false, 
      fillOpacity: 0.50, 
      // color: function
      // fillColor: function
      radius: features.geometry.coordinates[2]
    })
    .bindPopup("<h3>Location: " + features.properties.place + "<h3><h3>Magnitude: " + features.properties.mag + "</h3>")
    )
}
// var magnitude = features.properties.mag
// var time = features.properties.time
// var lat = features.geometry.coordinates[0]
// var long = features.geometry.coordinates[1]
  
//// CREATE BASE MAPS ////

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  })

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

//// CREATE LAYER GROUPS ////

// overlay object
var overlayMaps = {
  "Earthquakes" : eqMarkers
}

// baseMaps object
var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap,
    "Satellite Map": satellitemap
  };

//// CREATE MAP ////

// Define a map object
var myMap = L.map("map", {
  center: [0, 0],
  zoom: 3, 
  layers: [satellitemap]
});

// Pass map layers into layer control
// Add the layer control to the map
L.control.layers(baseMaps, {
  collapsed: false
}).addTo(myMap);


