function Signaling() {
  this.connect();
}

Signaling.prototype.connect = function() {
  var self = this;
  try {
    var ws = new WebSocket((window.location.protocol == 'https:' ? 'wss://' : 'ws://') + window.location.host);
    ws.onopen = function(evt) {
      if (self.timeout) {
        clearInterval(self.timeout);
        self.timeout = undefined;
      }
      console.log('WS opened!');
      ws.send('{"hello":"hello from the client!"}');
    };
    ws.onmessage = function(evt) {
      var data = evt.data;
      try {
        data = JSON.parse(evt.data);
        console.log(data);
      }
      catch (e) {
        console.log(e, data.text());
      }
    };
    ws.onclose = function(evt) {
      console.log('WS closed!');
      self.timeout = setTimeout(function() { self.connect(); }, 2000);
    };
    ws.onerror = function(err) {
      console.error(err);
    };
  }
  catch (e) {
    self.timeout = setTimeout(function() { self.connect(); }, 2000);
  }
}