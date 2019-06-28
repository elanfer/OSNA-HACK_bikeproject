var mymap = L.map('mapid').setView([52.281554, 8.042814], 13);

// custom marker iconUrl
var customMarker = L.icon({
    iconUrl: 'assets/images/positionSvgator (5).svg',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
});

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVubmFyZHZrIiwiYSI6ImNqeGVvczJlcjBwMjUzb21qdWRtYzdxbjQifQ.QNSNzwAg-_pDSAHbmV-RxA', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  maxZoom: 100,
  id: 'larathle.Light-copy',
  accessToken: 'pk.eyJ1IjoibGVubmFyZHZrIiwiYSI6ImNqeGVvczJlcjBwMjUzb21qdWRtYzdxbjQifQ.QNSNzwAg-_pDSAHbmV-RxA'
}).addTo(mymap);

this.mymap.locate({
  setView: true
}).on("locationfound", e => {

L.marker([e.latitude, e.longitude], {icon: customMarker}).addTo(this.mymap);
});

$( document ).ready(function(){

  $.get("http://10.229.54.121:8080/ways?maxLat=52.277676&minlat=52.279927&maxLng=8.033865&minLng=8.078091", function(){
    console.log('succes')
  });

  function createLines(dataArr) {

    dataArr.map(way => {
      var nodes = way.nodes
      var normalizedTags = way.normalizedTags
      var stateColor = ""

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



      var index = 0.8
      function setPopUpColor(val){

        var newStateColor
        if (val <= 0.3){
          newStateColor = stateColor = "#DF4848"
        }else if(val > 0.3 && val <= 0.6 ) {
          newStateColor = stateColor = "#FF9C07"
        }else if(val >= 0.6) {
          console.log('val', val)
          newStateColor = stateColor = "#57C571"
        }
        return newStateColor

      }



      var polyline = L.polyline(arrOfNodes,  { className: 'my_polyline', id: 'my_polyline' }).addTo(mymap);
      polyline.bindPopup(
        "<div id='popUp-wrapper' style='background:" + setPopUpColor(index) + "'>"+
          "<div id='popUp' class=''>"+
            "<p>"+ normalizedTags.robots +"</p>"+"<p>"+ normalizedTags.love +"</p>"+"<p>"+ normalizedTags.state +"</p>"
          +"</div>"
        +"</div>"

        , {
        showOnMouseOver: true
      });






    });
  }

  $.getJSON("data.json", function(json) {
    createLines(json)
  });




});





/*fetch('./data.json')
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data){
    console.log(data);
  });*/
