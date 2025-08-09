const os = require('os');
const http = require('http');
const openurl = require('openurl');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const ws = require('ws');
const wss = new ws.WebSocketServer({ noServer: true });

const app = express();
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.set('views', path.join(__dirname, '/content'));
app.use(express.static(path.join(__dirname, '/content')));

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = process.argv[2] || 8888;
app.set('port', port);
const server = http.createServer(app);
server.on('listening', function() {
  console.log(`http://${myIP()}:${port}`);
  openurl.open(`http://localhost:${port}`);
});

server.on('upgrade', function(req, socket, head) {
  wss.handleUpgrade(req, socket, head, function(ws) { wss.emit('connection', ws, req); });
});
server.listen(port);

function myIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family == 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

var wsA, wsB;

wss.on('connection', function(ws) {
  ws.on('error', console.error);
  if (!wsA) {
    wsA = ws;
    ws.on('message', function message(data) {
      if (wsB) wsB.send(data.toString());
    });
    ws.on('close', function message() {
      wsA = undefined;
      if (wsB) wsB.send(JSON.stringify({ peer: 'closed'}));
    });
    if (wsB) {
      wsA.send(JSON.stringify({ peer: 'polite'}));
      wsB.send(JSON.stringify({ peer: 'impolite'}));
    }
  }
  else if (!wsB) {
    wsB = ws;
    ws.on('message', function message(data) {
      if (wsA) wsA.send(data.toString());
    });
    ws.on('close', function message() {
      wsB = undefined;
      if (wsA) wsA.send(JSON.stringify({ peer: 'closed'}));
    });
    if (wsA) {
      wsA.send(JSON.stringify({ peer: 'polite'}));
      wsB.send(JSON.stringify({ peer: 'impolite'}));
    }
  }
  else ws.close();
});
