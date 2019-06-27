var mymap = L.map('mapid').setView([52.281554, 8.042814], 13);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGVubmFyZHZrIiwiYSI6ImNqeGVvczJlcjBwMjUzb21qdWRtYzdxbjQifQ.QNSNzwAg-_pDSAHbmV-RxA'
  }).addTo(mymap);