var data;

// Function to manage slider
var slideIndex = 0;
showSlides(slideIndex);

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"; 
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1} 
    slides[slideIndex-1].style.display = "block"; 
  setTimeout(showSlides, 7000);
}

// Active class for menu
(function($) {
  $("#mainNav li a").on("click", function(e) {
    e.preventDefault();
    $("#mainNav li a").removeClass("activemenu");
    $(this).addClass("activemenu");
  });
  $("#logo").on("click", function(e) {
    e.preventDefault();
    $("#mainNav li a").removeClass("activemenu");
  });
})(jQuery);

// Smooth scroll for menu anchors
// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
  // On-page links
  if (
    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
    && 
    location.hostname == this.hostname
    ) {
    // Figure out element to scroll to
  var target = $(this.hash);
  var navHeight = $('#mainNav').height();
  var scrollToPosition = target.offset().top;
  target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    // Does a scroll target exist?
    if (target.length) {
      // Only prevent default if animation is actually gonna happen
      event.preventDefault();
      $('html, body').animate({
        scrollTop: scrollToPosition
      }, 1500, function() {
        // Callback after animation
        // Must change focus!
        var $target = $(target);
        $target.focus();
      });
    }
  }
});

// Smooth scroll on 'what' section button
$("#btndown").click(function() {
  $('html,body').animate({
    scrollTop: $("#info").offset().top},
    2000);
});

// Automatic close the navigation bar
$('.navbar-collapse a').click(function(){
  $(".navbar-collapse").collapse('hide');
});


// Function to get data from json url file
// and covert it to js object
var txtFile = new XMLHttpRequest();
txtFile.open("GET", "https://s3-us-west-2.amazonaws.com/lgoveabucket/data_melp.json", true);
txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4) {
    if (txtFile.status === 200) {
      var string = "0,1";
      allText = txtFile.responseText;
      var stringArray = (new Function("return [" + string+ "];")());
      var objectStringArray = (new Function("return " + allText+ ";")());
      data = objectStringArray;
      render(data);
    }
  }
}
txtFile.send(null);

// Function to show data object on frontend
var latlngarray =[];
function render(data){
  var html = data.map(function(message,index){
    latlngarray.push(message.address.location.lat +','+message.address.location.lng);
    return(`
      <div class="cardContainer my-3 p-3 d-flex flex-column justify-content-around" style="width: 20rem;">
      <div class="card-name">
      <h4>${message.name}</h4>
      <a class="card-site" href="${message.contact.site}"><i class="fa fa-globe" aria-hidden="true"></i>&nbsp;${message.contact.site}</a>
      </div>
      <div id="map-${index}" class="map"></div>
      <ul id="contact" class="list-group list-group-flush">
      <li class="list-group-item card-email"><i class="fa fa-envelope-o" aria-hidden="true"></i>&nbsp;${message.contact.email}</li>
      <li class="list-group-item card-phone"><i class="fa fa-phone" aria-hidden="true"></i>&nbsp;${message.contact.phone}</li>
      </ul>
      <ul id="address" class="list-group list-group-flush">
      <li class="list-group-item card-street"><i class="fa fa-location-arrow" aria-hidden="true"></i>&nbsp;${message.address.street}</li>
      <li class="list-group-item card-city"><i class="fa fa-map-signs" aria-hidden="true"></i>&nbsp;${message.address.city}</li>
      <li class="list-group-item card-state"><i class="fa fa-map-signs" aria-hidden="true"></i>&nbsp;${message.address.state}</li>
      </ul>
      <div id="rate">
      <p>${message.rating}</p>
      <i class="fa fa-star-o star-icon" aria-hidden="true"></i>
      </div>
      </div>
      `);
  }).join('  ');
  document.getElementById('cards').innerHTML = html;
  // initMap(latlngarray);
  mainMap(data);
}

// Function to load each restaurant map
function initMap(array) {
  $.each( array, function( key, value ) {
    var latLng = new google.maps.LatLng(array[key].split(",")[0], array[key].split(",")[1]);
    console.log(latLng);
    var map = new google.maps.Map(document.getElementById('map-'+[key]), {
      zoom: 14,
      center: latLng
    });

    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
  });
}


// Map to show all positions
function mainMap(array) {
  var uluru = {lat: 19.44005705371313, lng: -99.12704709742486};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: uluru
  });

  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });

  var Circle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.1,
    map: map,
    center: uluru,
    radius: 100
  });

  $.each( array, function( key, value ) {
    var latLng = new google.maps.LatLng(array[key].address.location.lat, array[key].address.location.lng);
    
    var contentString =`
    <div id="content">
    <div id="siteNotice">
    </div>
    <h1 id="firstHeading" class="firstHeading">${array[key].name}</h1>
    <div id="bodyContent">
    <p>${array[key].contact.site}<br>${array[key].rating}<i class="fa fa-star-o" aria-hidden="true"></i></p>
    </div>
    </div>
    `;

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 200
    });

    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  });

  google.maps.event.addListener(map, 'click', function(event) {
    var result = [event.latLng.lat(), event.latLng.lng()];
    transition(result);
  });

  // Move marker on map
  var numDeltas = 100;
  var delay = 10;
  var i = 0;
  var deltaLat;
  var deltaLng;
  var currpos = [19.44005705371313, -99.12704709742486];

  function transition(result){
    i = 0;
    deltaLat = (result[0] - currpos[0])/numDeltas;
    deltaLng = (result[1] - currpos[1])/numDeltas;
    moveMarker();
  }

  function moveMarker(){
    currpos[0] += deltaLat;
    currpos[1] += deltaLng;
    var latlng = new google.maps.LatLng(currpos[0], currpos[1]);
    marker.setTitle("Latitude:"+currpos[0]+" | Longitude:"+currpos[1]);
    marker.setPosition(latlng);
    Circle.setMap(null);
    Circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: latlng,
      radius: 100
    });
    if(i!=numDeltas){
      i++;
      setTimeout(moveMarker, delay);
    }
  }
}




// Facebook like and share
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.12';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));