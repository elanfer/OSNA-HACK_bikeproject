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

    polyline.bindPopup(popUpHead, {
      showOnMouseOver: true
    });
    // mymap.fitBounds(polyline.getBounds());
  });

}

function updateWays() {
  $.getJSON("http://10.229.54.121:8080/ways?top=" + mymap.getBounds().getNorth() + "&left=" + mymap.getBounds().getWest() + "&bottom=" + mymap.getBounds().getSouth() + "&right=" + mymap.getBounds().getEast(), function (response) {
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

  mymap.on('moveend', function () {
    updateWays();
  });
  updateWays();

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