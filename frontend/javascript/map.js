var mymap = L.map('mapid').setView([52.281554, 8.042814], 13);


// custom marker iconUrl
var customMarker = L.icon({
  iconUrl: 'assets/images/positionSvgator (5).svg',

  iconSize: [38, 95], // size of the icon
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
});


function disableLine(color) {

  var paths = document.getElementsByTagName('path')
  var arr = [].slice.call(paths);

  arr.map(path => {
    console.log(path.style.stroke)
    if (path.style.stroke == color) {
      console.log(path.style.stroke)
      path.style.display = "none";
    }
  })
}

var active = false;
function toggle() {
  var el = document.getElementById('settings')
  if (active) {
    el.style.width = "0px"
    el.style.padding = "0rem;"
    active = false
  } else {
    el.style.width = "300px"
    el.style.padding = "2rem;"
    active = true
  }
}

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVubmFyZHZrIiwiYSI6ImNqeGVvczJlcjBwMjUzb21qdWRtYzdxbjQifQ.QNSNzwAg-_pDSAHbmV-RxA', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  maxZoom: 100,
  id: 'mapbox.light-v9',
  accessToken: 'pk.eyJ1IjoibGVubmFyZHZrIiwiYSI6ImNqeGVvczJlcjBwMjUzb21qdWRtYzdxbjQifQ.QNSNzwAg-_pDSAHbmV-RxA'
}).addTo(mymap);

this.mymap.locate({
  setView: true,
  maxZoom: 140
}).on("locationfound", e => {

  L.marker([e.latitude, e.longitude], { icon: customMarker }).addTo(this.mymap);
});

function calcIndex(way) {
  return way.customTags["norm_default_calc"];
}

function getColorForState(val) {

  var newStateColor
  if (val <= 0.3) {
    newStateColor = "#DF4848"
  } else if (val > 0.3 && val <= 0.6) {
    newStateColor =  "#FF9C07"
  } else if (val >= 0.6) {
    newStateColor = "#57C571"
  }

  return newStateColor
}


function augmentPopup(metric, imagePrefix, ratingPrefixTexts, metricTypeText) {
  imagePrefix = "assets/images/" + imagePrefix;
  if (metric != null) {
    var value = metric;
    var iconUrl;
    var ratingPrefixText;
    if (value < 0.33) {
      iconUrl = imagePrefix+"Rot.svg";
      ratingPrefixText = ratingPrefixTexts[0];
    } else if (value > 0.66) {
      iconUrl = imagePrefix+"Gruen.svg";
      ratingPrefixText = ratingPrefixTexts[2];
    } else {
      iconUrl = imagePrefix+"Orange.svg";
      ratingPrefixText = ratingPrefixTexts[1];
    }

   return  "<div id='popUp-container'>" +
      "<img class='popUp-container-icon' title='" + value + "' src='" + iconUrl + "'></img>" +
      "<div>" + ratingPrefixText + " " + metricTypeText + "</div>" +
      "</div>";
  }
  return "";
}

function createLines(dataArr) {

  dataArr.map(way => {
    var nodes = way.nodes;

    var objOfNodes = nodes.map(function (obj) {
      return Object.keys(obj).sort().map(function (key) {
        return obj[key];
      });
    });

    var arrOfNodes = objOfNodes.map(function (el) {
      var arr = [];
      for (var key in el) {
        arr.push(el[key]);
      }
      return arr;
    });

    var newStateColor = getColorForState(calcIndex(way));
    var polyline = L.polyline(arrOfNodes, { color: newStateColor}).addTo(mymap);
    

    var popUpHead = "<div id='popUp-header'></div>" +
      "<div id='popUp-wrapper' style='background:" + newStateColor + "'>" +
      "<div id='popUp-container-wrapper'>" +
      "<div id='popUp-container'>" +
      "<img src=''></img>" +
      "<div class='street-name'>" + way.osmTags.name + "</div>" +
      "</div>";

    popUpHead = popUpHead + augmentPopup(way.customTags.norm_street, "Boden", ["schlechter", "mäßiger", "guter"], "Bodenbelag");
    popUpHead = popUpHead + augmentPopup(way.customTags.norm_speed_car, "Speed", ["schnelle", "mäßig schnelle", "langsame"], "Autos");
    popUpHead = popUpHead + augmentPopup(way.customTags.norm_construction, "Construction", ["hinderliche", "nicht störende", "keine"], "Baustellen");
    popUpHead = popUpHead + augmentPopup(way.customTags.norm_noise, "Volume", ["viel", "mäßig", "wenig"], "Lärmbelastung");

    if(way.customTags.userFeedback === 0){
      popUpHead = popUpHead + "<div id='popUp-container'>" +
      "<img src='LogoUrbanBikingWeiß.svg'></img>" +
      "</div>";
    }

    popUpHead = popUpHead + "</div>" +
      "</div>" +
      "</div>";

    polyline.bindPopup(popUpHead, {
      showOnMouseOver: true
    });
    // mymap.fitBounds(polyline.getBounds());
  });
}

function updateWays(){
  $.getJSON("http://10.229.54.121:8080/ways?top=" + mymap.getBounds().getNorth() + "&left=" + mymap.getBounds().getWest() + "&bottom=" + mymap.getBounds().getSouth() + "&right=" + mymap.getBounds().getEast(), function (response) {
    createLines(response);
  });
}

$(document).ready(function () {

  mymap.on('moveend', function () {
    updateWays();
  });
  updateWays();
});

/*fetch('./data.json')
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data){
    console.log(data);
  });*/