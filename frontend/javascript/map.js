var mymap = L.map('mapid').setView([52.281554, 8.042814], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoibGVubmFyZHZrIiwiYSI6ImNqeGVvczJlcjBwMjUzb21qdWRtYzdxbjQifQ.QNSNzwAg-_pDSAHbmV-RxA'
}).addTo(mymap);

function createLines(dataArr) {
  
  dataArr.map(way => {
    var nodes = way.nodes
    var normalizedTags = way.normalizedTags

    var objOfNodes = nodes.map(function(obj) {
      return Object.keys(obj).sort().reverse().map(function(key) { 
        return obj[key];
      });
    });
    
    var arrOfNodes = objOfNodes.map(function(el){
      var arr=[];
      for(var key in el){
        arr.push(el[key]);
      }
      return arr;
    });
    
    var index =  Math.round(arrOfNodes.length / 2)
    var midPos = arrOfNodes[index];
    
    var polyline = L.polyline(arrOfNodes,  { className: 'my_polyline' }).addTo(mymap);
    
    polyline.bindPopup("<p>"+ normalizedTags.robots +"</p>"+"<p>"+ normalizedTags.love +"</p>"+"<p>"+ normalizedTags.state +"</p>", {
      showOnMouseOver: true
    });
  });
}

$.getJSON("data.json", function(json) {
  //console.log(json); 
  createLines(json)
});

/*fetch('./data.json')
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data){
    console.log(data);
  });*/