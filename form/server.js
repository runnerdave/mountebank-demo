/**
 * This is a sample form implemented in nodeJS, it exposes the following endpoints:
 *  - method GET: 
 *    http://localhost:8124/
 *    Presents a simple form with few fields and a submit button
 * 
 *    http://localhost:8124/favicon.ico
 *    If hit directly, this endpoint returns a 404 status error
 * 
 *  - method POST:
 *    http://localhost:8124/inbound
 *    This endpoint handles the previous form submission displaying the values submitted and a thank you message.
 * 
 *  - any other method returns a 405 status code error
 * 
 *  To run it simply run the following command at the root of this file (will start 
 *  by default on port 8124 but you can change it easily with the variable serverPort):
 *  $ node server.js
 * 
 *  Taken without modifications from: https://stackoverflow.com/questions/15427220/how-to-handle-post-request-in-node-js#19183959
 */
var http = require('http');
var qs = require('querystring');
var formOutput = '<html><body>'
  + '<h1>XYZ Repository Commit Monitor</h1>'
  + '<form method="post" action="inbound" enctype="application/x-www-form-urlencoded"><fieldset>'
  + '<div><label for="UserName">User Name:</label><input type="text" id="UserName" name="UserName" /></div>'
  + '<div><label for="Repository">Repository:</label><input type="text" id="Repository" name="Repository" /></div>'
  + '<div><label for="Branch">Branch:</label><input type="text" id="Branch" name="Branch" value="master" /></div>'
  + '<div><input id="ListCommits" type="submit" value="List Commits" /></div></fieldset></form></body></html>';
var serverPort = 8124;
http.createServer(function (request, response) {
  if(request.method === "GET") {
    if (request.url === "/favicon.ico") {
      response.writeHead(404, {'Content-Type': 'text/html'});
      response.write('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
      response.end();
    } else {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(formOutput);
    }
  } else if(request.method === "POST") {
    if (request.url === "/inbound") {
      var requestBody = '';
      request.on('data', function(data) {
        requestBody += data;
        if(requestBody.length > 1e7) {
          response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
          response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
        }
      });
      request.on('end', function() {
        var formData = qs.parse(requestBody);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<!doctype html><html><head><title>response</title></head><body>');
        response.write('Thanks for the data!<br />User Name: '+formData.UserName);
        response.write('<br />Repository Name: '+formData.Repository);
        response.write('<br />Branch: '+formData.Branch);
        response.end('</body></html>');
      });
    } else {
      response.writeHead(404, 'Resource Not Found', {'Content-Type': 'text/html'});
      response.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
    }
  } else {
    response.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
    return response.end('<!doctype html><html><head><title>405</title></head><body>405: Method Not Supported</body></html>');
  }
}).listen(serverPort);
console.log('Server running at localhost:'+serverPort);
