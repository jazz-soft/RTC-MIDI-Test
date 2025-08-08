function Signaling() {
  var ws = new WebSocket((window.location.protocol == 'https:' ? 'wss://' : 'ws://') + window.location.host);
  ws.onopen = function(evt) {
    console.log('WS opened!');
    ws.send('hello from the client!');
  };
  ws.onmessage = function(evt) {
    console.log(evt.data);
  };
}