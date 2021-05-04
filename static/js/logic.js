/// SET UP VARIABLES ////

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

//// CREATE LOCATION MARKERS & FEATURES ////

// functions for marker color (depth) & size (magnitude)
function getColor(d) {
  return d > 15 ? '#d93240' :
  d > 12  ? '#ff5865' :
  d > 9  ? '#ff7a72' :
  d > 6  ? '#ffa56a' :
  d > 3   ? '#bbdc86' :
            '#6dd5ae';
}

function getRadius(value){
  return value*15000
}

// Perform a GET request to the query URL
var data = d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// create feature function

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

 // create var for plate layer
  var tectonicPlates = new L.LayerGroup();

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
    "Light Map": lightmap,
    "Street Map": streetmap,
    "Satellite Map": satellitemap,
    "Dark Map": darkmap,
  };

  // overlay object
  var overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicPlates
  };

  //// CREATE MAP ////

  // Define a map object
  var myMap = L.map("map", {
    center: [38, -100],
    zoom: 4,
    layers: [lightmap, earthquakes, tectonicPlates]
  });

  // Pass map layers into layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
 
  //// CREATE TECHNOIC PLATE LAYER ////

  d3.json(plates).then(function(plateData) {
  
    tectonicPlates = L.geoJson(plateData, {
      color: "orange",
      weight: 2
    })
    .addTo(tectonicPlates);
  });
  

// Set up the legend
var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"), 
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

      // Add min & max
      var legendInfo = "<h1>Earthquake Depth</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + grades[0] + "</div>" +
          "<div class=\"max\">" + grades[grades.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + getColor[grades] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);
}

