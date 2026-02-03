
let highestRainfall = 0;
let rainCity = "—";

let highestRisk = 0;
let riskCity = "—";

// Create the map centered on Georgia
var map = L.map('map').setView([32.7, -83.3], 7);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Get live rainfall data from Open-Meteo
async function getRainfall(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation&forecast_days=1`;
  const response = await fetch(url);
  const data = await response.json();

  // Get the most recent hourly rainfall value
  return data.hourly.precipitation[0];
}


// Flood risk data
var floodRiskAreas = [
  { name: "Savannah", coords: [32.0809, -81.0912], risk: 45, reason: "Coastal flooding" },
  { name: "Brunswick", coords: [31.1499, -81.4915], risk: 40, reason: "Tidal flooding" },
  { name: "Albany", coords: [31.5785, -84.1557], risk: 35, reason: "Flint River flooding" },
  { name: "Macon", coords: [32.8407, -83.6324], risk: 30, reason: "Ocmulgee River floodplain" },
  { name: "Columbus", coords: [32.4609, -84.9877], risk: 28, reason: "Chattahoochee River flooding" },
  { name: "Atlanta", coords: [33.7490, -84.3880], risk: 22, reason: "Urban flooding" }
];


// Marker color based on risk
function getColor(risk) {
  if (risk >= 40) return "red";
  if (risk >= 30) return "orange";
  if (risk >= 20) return "yellow";
  return "green";
}

floodRiskAreas.forEach(async area => {

  const rainfall = await getRainfall(area.coords[0], area.coords[1]);

  // Track highest rainfall
  if (rainfall > highestRainfall) {
    highestRainfall = rainfall;
    rainCity = area.name;
  }

  // Track highest flood risk
  if (area.risk > highestRisk) {
    highestRisk = area.risk;
    riskCity = area.name;
  }

  // Update dashboard
  document.getElementById("maxRain").textContent =
    `${rainCity} (${highestRainfall} mm)`;

  document.getElementById("maxRisk").textContent =
    `${riskCity} (${highestRisk}%)`;

// Trigger alert for high flood risk
if (rainfall >= 15) {
  alert(`🚨 FLOOD ALERT 🚨\n\nHeavy rainfall detected in ${area.name}.\nRainfall: ${rainfall} mm`);
}

  // Add marker
  L.circleMarker(area.coords, {
    radius: 10,
    fillColor: getColor(area.risk),
    color: "#000",
    weight: 1,
    fillOpacity: 0.8
  })
  .addTo(map)
  .bindPopup(`
    <b>${area.name}</b><br><br>
    🌧️ <b>Live Rainfall:</b> ${rainfall} mm<br>
    🌊 <b>Flood Risk:</b> ${area.risk}%
  `);

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


