var sys  = require('sys'),
    http = require('http'),
    url  = require('url'),
    ws   = require('./ws.js');

var clients = [];

var wsConf = {
    host: '192.168.2.2',
    port: 8880
};
var httpConf = {
    host: '192.168.2.2',
    port: 5672
};
var localhost = '127.0.0.1';

// a bit of security. Only allowed hosts can connect to node server
var allowedIP = [
    wsConf.host,
    httpConf.host,
    localhost,
    ];

http.createServer(function (req, res) {
    var remoteAdrress = req.socket.remoteAddress;
    if (allowedIP.indexOf(remoteAdrress) >= 0) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Ok\n');
        try {
            var parsedUrl = url.parse(req.url, true);
            var type = parsedUrl.query.type;
            var logString = parsedUrl.query.logString;
            var ip = eval(parsedUrl.query.logString)[0];
 
            if (inspectingUrl == "" ||  inspectingUrl == ip) {
                clients.forEach(function(client) {
                    client.write(logString);
                });
            }
        } catch(err) {
            console.log("500 to " + remoteAdrress);
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end('System Error\n');
        }
  
      
    } else {
        console.log("401 to " + remoteAdrress);
        res.writeHead(401, {
            'Content-Type': 'text/plain'
        });
        res.end('Not Authorized\n');
    }
}).listen(httpConf.port, httpConf.host);

var inspectingUrl = undefined;

ws.createServer(function(websocket) {
    websocket.on('connect', function(resource) {
        var parsedUrl = url.parse(resource, true);
        inspectingUrl = parsedUrl.query.ip;
        clients.push(websocket);
    });
  
    websocket.on('close', function() {
        var pos = clients.indexOf(websocket);
        if (pos >= 0) {
            clients.splice(pos, 1);
        }
    });
  
}).listen(wsConf.port, wsConf.host);

console.log("HTTP server started at " + httpConf.host + "::" + httpConf.port);
console.log("Web Socket server started at " + wsConf.host + "::" + wsConf.port);
