function WebRtc() {
  var self = this;
  this.sig = new Signaling();
  this.rtc = new RTCPeerConnection();
  this.sig.onfound = function(x) { self.start(x); };
  this.sig.onrtc = function(x) { self.onrtc(x); };
  this.rtc.onicecandidate = function(x) { self.onicecandidate(x); };
  this.rtc.onnegotiationneeded = function() { self.onnegotiationneeded(); };
}

WebRtc.prototype.start = function(x) {
  if (x != 'polite') return;
  var self = this;
  self.rtc.createOffer().then(function(offer) {
    return self.rtc.setLocalDescription(offer);
  }).then(function() {
    self.sig.rtc({ offer: self.rtc.localDescription });
  });
}

WebRtc.prototype.onrtc = function(x) {
  //console.log('RTC:', x);
  var self = this;
  if (x.offer) {
    const desc = new RTCSessionDescription(x.offer);
    self.rtc.setRemoteDescription(desc).then(function() {
      return self.rtc.createAnswer();
    }).then(function(answer) {
      return self.rtc.setLocalDescription(answer);
    }).then(function() {
      self.sig.rtc({ answer: self.rtc.localDescription });
    });
  }
  else if (x.answer) {
    const desc = new RTCSessionDescription(x.answer);
    self.rtc.setRemoteDescription(desc);
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
  console.log('negotiationneeded');
  var self = this;
  self.rtc.createOffer().then(function(offer) {
    return self.rtc.setLocalDescription(offer);
  }).then(function() {
    self.sig.rtc({ offer: self.rtc.localDescription });
  });
}

function error(e) { console.log('Error:', e.message); }