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
  var scrollToPosition = target.offset().top - (navHeight*2);
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
function render(){
  var html = data.map(function(message,index){
    return(`
      <div class="message">
      <p class="card-description">${message.id}</p>
      <h3 class="card-title">${message.name}</h3>
      <p class="card-description">${message.contact.site}</p>
      <div class="card-price">${message.contact.email}</div>
      <div class="card-price">${message.contact.phone}</div>
      <div class="card-price">${message.address.street}</div>
      <div class="card-price">${message.address.city}</div>
      <div class="card-price">${message.address.state}</div>
      <div class="card-price">${message.address.location.lat}</div>
      <div class="card-price">${message.address.location.lng}</div>
      <div class="card-price">${message.rating}</div>
      </div>
      `);
  }).join('  ');

  document.getElementById('images').innerHTML = html;
}