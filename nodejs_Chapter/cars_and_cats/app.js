//We know we need the http module installed. This allows us to create the server and respond to HTTP requests.
var http = require('http'),
    fs = require('fs');
//need fs to use our file system to read files and send them back to browser
var server = http.createServer(function(request, response){
//This is how you create a server. Put it in a server variable.
  // SPLIT THE URL IN ORDER TO EXAMINE IT BETTER
  var splitURL = request.url.split('/'),
      firstChunk = splitURL[1]; // Set of characters after the first /

  switch (firstChunk) {
    case "styles":
    // SERVE CSS!
      serveCSS(splitURL[2], response);
      break;
    case "images":
    // SERVE A JPG IMAGE!
      serveJPG(splitURL[2], response);
      break;
    default:
    // SERVE AN HTML FILE!
      switch(splitURL[1]){
        case "cars": // If firstChunk is 'cars', could be one of two routes.
          if (splitURL[2] === "new") {
            serveHTML("new.html", response);
          } else {
            serveHTML("cars.html", response);
          }
          break;
        case "cats":
          serveHTML("cats.html", response);
          break;
        default:
          // We don't recognize this URL -- serve a 404!
          serve404(response);
      }
  }
});

// We call on these help functions, giving each the response object (and filename in most cases) to serve the correctly-configred response.
// If any callback gets an error, meaning the file wasn't found, we serve 404!

function serveHTML(filename, response){
  // Read a particular file...
  //Respond to the browser
  fs.readFile(`views/${filename}`, 'utf8', function(error, contents){
    // Check to see if an error exists
    if (error) { return serve404(response) }
    // Respond to the browser
    response.writeHead(200, {'Content-type' : 'text/html' });
    response.write(contents);
    response.end();
  });
}

function serveCSS(filename, response){
  // Read a particular file...
  fs.readFile(`stylesheets/${filename}`, 'utf8', function(error, contents){
    // Check to see if an error exists
    if (error) { return serve404(response) }
    // Respond to the browser
    response.writeHead(200, {'Content-type' : 'text/css' });
    response.write(contents);
    response.end();
  });
}

function serveJPG(filename, response){
  // Read a particular file...
  fs.readFile(`images/${filename}`, function(error, contents){
    // Check to see if an error exists
    if (error) { return serve404(response) }
    // Respond to the browser
    response.writeHead(200, {'Content-type' : 'image/jpg' });
    response.write(contents);
    response.end();
  });
}

function serve404(response){
  response.writeHead(404);
  response.end("File not found!");
}

//this is how you connect your server to a port.
server.listen(7077);
console.log("Running on 7077");
