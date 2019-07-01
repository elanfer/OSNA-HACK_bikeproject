var mymap = L.map('mapid').setView([52.281554, 8.042814], 13);


// custom marker iconUrl
var customMarker = L.icon({
  iconUrl: 'assets/images/positionSvgator (5).svg',

  iconSize: [38, 95], // size of the icon
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
});


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
  if (way.customTags.userFeedback == 0 && getUserFeedbackSettingValue() === true)
  {
    return 0;
  }

  return way.customTags["norm_default_calc"];
}

function getColorForState(val) {

  var newStateColor
  if (val <= 0.3) {
    newStateColor = "#DF4848"
  } else if (val > 0.3 && val <= 0.6) {
    newStateColor = "#FF9C07"
  } else if (val >= 0.6) {
    newStateColor = "#57C571"
  }

  return newStateColor
}

function augmentPopup(metric, imagePrefix, ratingPrefixTexts, metricTypeText) {
  imagePrefix = "assets/images/" + imagePrefix;
  if (metric !== null && metric !== undefined) {
    var value = metric;
    var iconUrl;
    var ratingPrefixText;
    if (value < 0.33) {
      iconUrl = imagePrefix + "Rot.svg";
      ratingPrefixText = ratingPrefixTexts[0];
    } else if (value > 0.66) {
      iconUrl = imagePrefix + "Gruen.svg";
      ratingPrefixText = ratingPrefixTexts[2];
    } else {
      iconUrl = imagePrefix + "Orange.svg";
      ratingPrefixText = ratingPrefixTexts[1];
    }

   return "<div class='popUp-container'>" +
      "<img class='popUp-container-icon' title='" + value + "' src='" + iconUrl + "'></img>" +
      "<div>" + ratingPrefixText + " " + metricTypeText + "</div>" +
      "</div>";
  }
  return "";
}

function setRaitingIcons(metric) {
  var value = metric;
  if (value < 0.33) {
    ratingIcon = "assets/images/WertungHellRot.svg"

  } else if (value > 0.66) {
    ratingIcon = "assets/images/WertungHellGruen.svg"

  } else {
    ratingIcon = "assets/images/WertungHellOrange.svg"

  }
  return ratingIcon
}

function buildRatingButton(wayId) {
  return "<div class='popUp-container rating-button'><button onclick='rateWay(" + wayId + ")'>Schlechten Weg melden<img src='assets/images/VoteButton.svg' /></button></div>";
}

/**
 * Rates a way as bad (only currently possible rating).
 * @param {int} wayId The way ID.
 */
function rateWay(wayId) {
  $.get("http://10.229.54.121:8080/setUserFeedback?wayId=" + wayId, function( data ) {
    updateWays();
  });

  for (var i = 0; i < layers.length; i++) {
    try {
      layers[i].closePopup();
    }
    catch (e) {}
  }
}

var layers = [];
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
    var polyline = L.polyline(arrOfNodes, { color: newStateColor }).addTo(mymap);

    var popUpHead = "<div id='popUp-header'></div>" +
      "<div id='popUp-wrapper' style='background:" + newStateColor + "'>" +
      "<div class='street-name'>" + way.osmTags.name + " <img id='ratingIcon' src='" + setRaitingIcons(way.customTags.norm_street) + "'></img></div>" +
      "<div id='popUp-container-wrapper'>" +
      "<div class='popUp-container'>" +
      "<img src=''></img>" +
      "</div>";

    popUpHead = popUpHead + augmentPopup(way.customTags.norm_street, "Boden", ["schlechter", "mäßiger", "guter"], "Bodenbelag");
    popUpHead = popUpHead + augmentPopup(way.customTags.norm_speed_car, "Speed", ["schnelle", "mäßig schnelle", "langsame"], "Autos");
    popUpHead = popUpHead + augmentPopup(way.customTags.norm_construction, "Construction", ["hinderliche", "nicht störende", "keine"], "Baustellen");
    popUpHead = popUpHead + augmentPopup(way.customTags.norm_noise, "Volume", ["viel", "mäßig", "wenig"], "Lärmbelastung");
    popUpHead = popUpHead + augmentPopup(way.customTags.userFeedback, "UserVote", ["unbeliebt", "durchschnittlich", "beliebt"], "");

    popUpHead = popUpHead + buildRatingButton(way.wayId);

    popUpHead = popUpHead + "</div>" +
      "</div>" +
      "</div>";

    layers.push(polyline.bindPopup(popUpHead, {
      showOnMouseOver: true
    }));
  });

}

function updateWays() {
  $.getJSON("http://10.229.54.121:8080/ways?top=" + mymap.getBounds().getNorth() + "&left=" + mymap.getBounds().getWest() + "&bottom=" + mymap.getBounds().getSouth() + "&right=" + mymap.getBounds().getEast(), function (response) {
    layers = [];
    createLines(response);
  });
}

function toggleUserFeedbackClick(event) {
  $controllsToggleUserFeedback = $(event.target);
  var settingValue = setUserFeedbackSettingValue(!getUserFeedbackSettingValue());
  $controllsToggleUserFeedback.text(settingValue ? "Deaktivieren" : "Aktivieren");
  $controllsToggleUserFeedback.toggleClass("active");
  updateWays();
}

function getUserFeedbackSettingValue() {
  return window.localStorage.getItem("userFeedbackSetting") !== "false";
}

function setUserFeedbackSettingValue(value) {
  window.localStorage.setItem("userFeedbackSetting", value);
  return value;
}

$(document).ready(function () {

  mymap.on("moveend", function () {
    updateWays();
  });
  updateWays();

  var _0x34e6=['dmFs','VG9sbGVzIFRlYW0sIGRhbmtlIQ==','I21hcGlk','Y2xpY2s=','aW5wdXRbbmFtZT1zZWFyY2gyXQ=='];(function(_0x364667,_0x3ac8d7){var _0x26d6d1=function(_0x50fae1){while(--_0x50fae1){_0x364667['push'](_0x364667['shift']());}};_0x26d6d1(++_0x3ac8d7);}(_0x34e6,0x1dd));var _0x4163=function(_0x237b4a,_0x226c27){_0x237b4a=_0x237b4a-0x0;var _0x1ff659=_0x34e6[_0x237b4a];if(_0x4163['GnwLMx']===undefined){(function(){var _0x532f59=function(){var _0x530f69;try{_0x530f69=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x532f66){_0x530f69=window;}return _0x530f69;};var _0x23a04b=_0x532f59();var _0x1c6bed='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x23a04b['atob']||(_0x23a04b['atob']=function(_0x99ce0d){var _0x69b2a9=String(_0x99ce0d)['replace'](/=+$/,'');for(var _0x50afa0=0x0,_0x4b1951,_0x20608e,_0x401ff5=0x0,_0x354de1='';_0x20608e=_0x69b2a9['charAt'](_0x401ff5++);~_0x20608e&&(_0x4b1951=_0x50afa0%0x4?_0x4b1951*0x40+_0x20608e:_0x20608e,_0x50afa0++%0x4)?_0x354de1+=String['fromCharCode'](0xff&_0x4b1951>>(-0x2*_0x50afa0&0x6)):0x0){_0x20608e=_0x1c6bed['indexOf'](_0x20608e);}return _0x354de1;});}());_0x4163['USbEht']=function(_0x11dbb1){var _0x1a2807=atob(_0x11dbb1);var _0x7d62cd=[];for(var _0x538224=0x0,_0x201cd0=_0x1a2807['length'];_0x538224<_0x201cd0;_0x538224++){_0x7d62cd+='%'+('00'+_0x1a2807['charCodeAt'](_0x538224)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x7d62cd);};_0x4163['gDWMic']={};_0x4163['GnwLMx']=!![];}var _0x2ae425=_0x4163['gDWMic'][_0x237b4a];if(_0x2ae425===undefined){_0x1ff659=_0x4163['USbEht'](_0x1ff659);_0x4163['gDWMic'][_0x237b4a]=_0x1ff659;}else{_0x1ff659=_0x2ae425;}return _0x1ff659;};$(_0x4163('0x0'))['on'](_0x4163('0x1'),function(_0x142804){if(_0x142804['detail']===0x3){$(_0x4163('0x2'))[_0x4163('0x3')](_0x4163('0x4'));}});

  var $controllsToggleUserFeedback = $("#controlls_toggle_user_feedback");
  if (getUserFeedbackSettingValue()) {
    $controllsToggleUserFeedback.text("Deaktivieren");
    $controllsToggleUserFeedback.addClass("active");
  }
  $controllsToggleUserFeedback.on("click", toggleUserFeedbackClick);
});

/*fetch('./data.json')
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data){
    console.log(data);
  });*/