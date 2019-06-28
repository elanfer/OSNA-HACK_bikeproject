var mymap = L.map('mapid').setView([52.281554, 8.042814], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoibGVubmFyZHZrIiwiYSI6ImNqeGVvczJlcjBwMjUzb21qdWRtYzdxbjQifQ.QNSNzwAg-_pDSAHbmV-RxA'
}).addTo(mymap);

$( document ).ready(function(){

  $.get("http://10.229.54.121:8080/ways?maxLat=52.277676&minlat=52.279927&maxLng=8.033865&minLng=8.078091", function(){
    console.log('succes')
  });

  function createLines(dataArr) {
    
    dataArr.map(way => {
      var nodes = way.nodes
      var normalizedTags = way.normalizedTags
      var stateColor = ""
      var indexNum = Math.floor((Math.random() * 10000) + 1);
  
      var objOfNodes = nodes.map(function(obj) {
        return Object.keys(obj).sort().map(function(key) { 
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

      var index = 0.1
      function setPopUpColor(val){
        var polyLine = document.getElementsByClassName('my_polyline' + indexNum + '');
        var newStateColor
        if (val <= 0.3){
          newStateColor = stateColor = "#DF4848"
        }else if(val > 0.3 && val <= 0.6 ) {
          newStateColor = stateColor = "#FF9C07"
        }else if(val >= 0.6) {
          console.log('val', val)
          newStateColor = stateColor = "#57C571"
        }
        console.log(polyLine[0].style.stroke = newStateColor)
        return newStateColor
      }  
      
      console.log(arrOfNodes)
      var polyline = L.polyline(arrOfNodes,  { className: 'my_polyline' + indexNum + ''}).addTo(mymap);
      polyline.bindPopup(
        "<div id='popUp-header'>Urgent</div>"+
          "<div id='popUp-wrapper' style='background:" + setPopUpColor(index) + "'>"+
            "<div id='popUp-container-wrapper'>"+
              "<div id='popUp-container'>"+ 
                "<img src=''></img>"+
                "<div>"+ 'normalizedTags.smoothness' +"</div>"+
              "</div>"+
              "<div id='popUp-container'>"+ 
                "<img src=''></img>"+
                "<div>"+ 'normalizedTags.smoothness' +"</div>"+
              "</div>"+
            "</div>"+
          "</div>"
        +"</div>"
        
      ,{
        showOnMouseOver: true
      });
      mymap.fitBounds(polyline.getBounds());
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