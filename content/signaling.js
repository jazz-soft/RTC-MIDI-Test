function Signaling() {
  this.connect();
}

Signaling.prototype.connect = function() {
  var self = this;
  try {
    this.ws = new WebSocket((window.location.protocol == 'https:' ? 'wss://' : 'ws://') + window.location.host);
    this.ws.onopen = function(evt) {
      if (self.timeout) {
        clearInterval(self.timeout);
        self.timeout = undefined;
      }
    };
    this.ws.onmessage = function(evt) {
      var data = evt.data;
      try {
        data = JSON.parse(evt.data);
        if (data.peer == 'closed') {
          self.peer = undefined;
          self.onlost();
        }
        else if (data.peer) {
          self.peer = data.peer;
          self.onfound(data.peer);
        }
        else if (data.rtc) {
          self.onrtc(data.rtc);
        }
        else {
          console.log('data:', data);
        }
      }
      catch (e) {
        console.log(e, data);
      }
    };
    this.ws.onclose = function(evt) {
      console.log('WS closed!');
      self.timeout = setTimeout(function() { self.connect(); }, 2000);
      if (self.peer) {
        self.peer = undefined;
        self.onlost();
      }
    };
    this.ws.onerror = function(err) {
      console.error(err);
    };
  }
  catch (e) {
    self.timeout = setTimeout(function() { self.connect(); }, 2000);
  }
}

Signaling.prototype.rtc = function(x) {
  if (this.ws) this.ws.send(JSON.stringify({ rtc: x }));
}

Signaling.prototype.onfound = function(x) {
  console.log('Peer found:', x);
}

Signaling.prototype.onlost = function() {
  console.log('Peer lost');
}

Signaling.prototype.onrtc = function(x) {
  console.log('WebRTC:', x);
}
