
getGPSCoordonates();

async function getGPSCoordonates() {
  const reponse = await fetch('/GPSCoffeesCoordonates');
  
  const allCoordonates = await reponse.json();
  console.log(allCoordonates);

  let marker;
  let coordonateCurrent;
  let circleIndication;

  allCoordonates.forEach(oneCoordonate => {

    coordonateCurrent = [oneCoordonate.latitude , oneCoordonate.longitude];
    
    // Link For Seach all Cofee for a country
    const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/coffeeByLocation/${oneCoordonate.id}`;
    console.log(url);

    const link = document.createElement('a');
    link.href = url;
    link.textContent = 'Voir les cafées';
    const linkHTML = link.outerHTML;     // Convert in STRING

    marker = L.marker(coordonateCurrent).addTo(map);
    marker.bindPopup(`<b>${oneCoordonate.name}</b><BR> ${linkHTML}`).openPopup();

    circleIndication = L.circle(coordonateCurrent, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map);

    circleIndication.bindPopup(`<b>${oneCoordonate.name}</b> ${link}`);
  });
}




// var map = L.map('map').setView([51.505, -0.09], 13);
var map = L.map('map').setView([48.862725, 2.287592], 2); //France coordonate

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// map.on('click', onMapClick);

// function onMapClick(e) {
//   alert("You clicked the map at " + e.latlng);
// }

var popup2 = L.popup();

function onMapClick(e) {
  popup2
    .setLatLng(e.latlng)
    .setContent("You clickeddddd the map at " + e.latlng.toString())
    .openOn(map);
}

map.on('click', onMapClick);