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
      console.log(data);
      render(data);
    }
  }
}
txtFile.send(null);

// Function to show data object on frontend
var latlngarray =[];
function render(){
  var html = data.map(function(message,index){
    latlngarray.push(message.address.location.lat +','+message.address.location.lng);
    return(`
      <div class="cardContainer my-3 p-3 d-flex flex-column justify-content-around" style="width: 20rem;">
      <div class="card-name">
      <h4>${message.name}</h4>
      <a class="card-site" href="${message.contact.site}"><img class="contact-icon" src="assets/images/site.png" alt="rest info">${message.contact.site}</a>
      </div>
      <ul id="contact" class="list-group list-group-flush">
      <li class="list-group-item card-email"><img class="contact-icon" src="assets/images/mail.png" alt="rest info"> ${message.contact.email}</li>
      <li class="list-group-item card-phone"><img class="contact-icon" src="assets/images/phone.png" alt="rest info"> ${message.contact.phone}</li>
      </ul>
      <ul id="address" class="list-group list-group-flush">
      <li class="list-group-item card-street"><img class="contact-icon" src="assets/images/map.png" alt="rest info">${message.address.street}</li>
      <li class="list-group-item card-city"><img class="contact-icon" src="assets/images/minus.png" alt="rest info">${message.address.city}</li>
      <li class="list-group-item card-state"><img class="contact-icon" src="assets/images/minus.png" alt="rest info">${message.address.state}</li>
      </ul>
      <div id="rate">
      ${message.rating}
      <img class="star-icon" src="assets/images/star.png" alt="rest info">
      </div>
      </div>
      `);
  }).join('  ');
  document.getElementById('cards').innerHTML = html;
}

function initMap() {
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}