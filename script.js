// Create the map centered on Georgia
var map = L.map('map').setView([32.7, -83.3], 7);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);


// Flood risk data (with alert threshold)
var floodRiskAreas = [
  {
    name: "Savannah",
    coords: [32.0809, -81.0912],
    risk: 45,
    reason: "Coastal flooding & storm surge",
    status: "⚠️ SEVERE FLOOD RISK"
  },
  {
    name: "Brunswick",
    coords: [31.1499, -81.4915],
    risk: 40,
    reason: "Tidal & coastal flooding",
    status: "⚠️ HIGH FLOOD RISK"
  },
  {
    name: "Albany",
    coords: [31.5785, -84.1557],
    risk: 35,
    reason: "Flint River overflow",
    status: "🟠 MODERATE FLOOD RISK"
  },
  {
    name: "Macon",
    coords: [32.8407, -83.6324],
    risk: 30,
    reason: "Ocmulgee River floodplain",
    status: "🟡 ELEVATED FLOOD RISK"
  },
  {
    name: "Columbus",
    coords: [32.4609, -84.9877],
    risk: 28,
    reason: "Chattahoochee River flooding",
    status: "🟡 ELEVATED FLOOD RISK"
  },
  {
    name: "Atlanta",
    coords: [33.7490, -84.3880],
    risk: 22,
    reason: "Urban flooding & river floodplains",
    status: "🟢 LOW–MODERATE FLOOD RISK"
  }
];

// Alert threshold
var ALERT_THRESHOLD = 40;

// Track if alert already shown
var alertShown = false;

// Marker color based on risk
function getColor(risk) {
  if (risk >= 40) return "red";
  if (risk >= 30) return "orange";
  if (risk >= 20) return "yellow";
  return "green";
}


// Add markers and alerts
floodRiskAreas.forEach(area => {

  // Create popup content
  var popupContent = `
    <b>${area.name}</b><br>
    ${area.status}<br><br>
    🌊 <b>Flood Cause:</b> ${area.reason}<br>
    📊 <b>Estimated Flood Risk:</b> ${area.risk}%<br><br>
    🚨 <i>Stay alert and follow local emergency guidance.</i>
  `;


  // Trigger alert for high flood risk
  if (area.risk >= ALERT_THRESHOLD && !alertShown) {
    alert(
      "🚨 FLOOD ALERT 🚨\n\n" +
      area.name + " is experiencing HIGH flood risk (" +
      area.risk + "%).\n\n" +
      "Please stay alert and monitor local emergency updates."
    );
    alertShown = true;
  }
});

// Add circle markers
floodRiskAreas.forEach(area => {
  L.circleMarker(area.coords, {
    radius: 10,
    fillColor: getColor(area.risk),
    color: "#000",
    weight: 1,
    fillOpacity: 0.8
  })
  .addTo(map)
  .bindPopup(
    `<b>${area.name}</b><br>
     🌊 ${area.reason}<br>
     📊 Risk Level: <b>${area.risk}%</b>`
  );
});

// Add legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Flood Risk</h4>";
  div.innerHTML += '<i style="background:green"></i> Low<br>';
  div.innerHTML += '<i style="background:yellow"></i> Moderate<br>';
  div.innerHTML += '<i style="background:orange"></i> High<br>';
  div.innerHTML += '<i style="background:red"></i> Severe<br>';
  return div;
};

legend.addTo(map);

