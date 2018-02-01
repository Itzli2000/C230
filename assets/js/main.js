var data;
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


function render(){
  var html = data.map(function(message,index){
    return(`
      <div class="message">
      <p class="card-description">${message.id}</p>
      <h3 class="card-title">${message.name}</h3>
      <p class="card-description">${message.contact.site}</p>
      <div class="card-price">${message.contact.email}</div>
      </div>
      `);
  }).join('  ');

  document.getElementById('images').innerHTML = html;
}