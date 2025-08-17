function WebRtc() {
  var self = this;
  this.sig = new Signaling();
  this.rtc = new RTCPeerConnection();
  this.sig.onfound = function() { self.start(); };
  this.sig.onrtc = function(x) { self.onrtc(x); };
  this.rtc.onicecandidate = function(x) { self.onicecandidate(x); };
  this.rtc.onnegotiationneeded = function() { self.onnegotiationneeded(); };
}

WebRtc.prototype.start = function() {
  var self = this;
  self.rtc.createOffer().then(function(offer) {
    return self.rtc.setLocalDescription(offer);
  }).then(function() {
    self.sig.rtc({ offer: self.rtc.localDescription });
  });
}

WebRtc.prototype.onrtc = function(x) {
  console.log('RTC:', x);
  var self = this;
  if (x.offer) {
    const desc = new RTCSessionDescription(x.offer);
    self.rtc.setRemoteDescription(desc).then(function() {
      return self.rtc.createAnswer();
    });
  }
  else if (x.candidate) {
    const candidate = new RTCIceCandidate(x.candidate);
    self.rtc.addIceCandidate(candidate).catch(error);
  }
}

WebRtc.prototype.onicecandidate = function(x) {
  if (x.candidate !== null) this.sig.rtc({ candidate: x.candidate });
}

WebRtc.prototype.onnegotiationneeded = function() {
  console.log('onnegotiationneeded');
}

function error(e) { console.log('Error:', e.message); }