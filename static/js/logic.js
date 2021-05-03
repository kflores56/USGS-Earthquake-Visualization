//// CREATE LOCATION MARKERS ////

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// functions for marker color (depth) & size (magnitude)

function getColor(d) {
  return d > 15 ? '#F30' :
  d > 12  ? '#F60' :
  d > 9  ? '#F90' :
  d > 6  ? '#FC0' :
  d > 3   ? '#FF0' :
            '#9F3';
}

function getRadius(value){
  return value*30000
}


// Perform a GET request to the query URL
var data = d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// CREATE FEATURES FOR MARKERS

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  },

    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.geometry.coordinates[2]),
          fillOpacity: 1,
          stroke: true,
          color: "black",
          weight: .5
      })
    }

  });

  createMap(earthquakes);
}

//// CREATE MAP FUNCTION ////

function createMap(earthquakes) {

  // defining basemap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });
  
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  //// CREATE LAYER GROUPS ////

  // baseMaps object
  var baseMaps = {
    "Dark Map": darkmap,
    "Satellite Map": satellitemap,
    "Street Map": streetmap,
    "Light Map": lightmap
  };

  // overlay object
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  //// CREATE MAP ////

  // Define a map object
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [darkmap, earthquakes]
  });

  // Pass map layers into layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

