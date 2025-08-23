function WebRtc() {
  var self = this;
  this.sig = new Signaling();
  this.sig.onfound = function(x) { self.imp = (x == 'A'); self.offer(); };
  this.sig.onrtc = function(x) { self.onrtc(x); };
  this.sig.onlost = function() { self.rtc.close(); self.init(); };
  this.init();
}

WebRtc.prototype.init = function() {
  var self = this;
  this.rtc = new RTCPeerConnection();
  this.rtc.onicecandidate = function(x) { self.onicecandidate(x); };
  this.rtc.onnegotiationneeded = function() { self.offer(); };
  setTimeout(function() { self.start(self.rtc); }, 0);
};

WebRtc.prototype.start = function(rtc) {
  console.log('Place your WebRTC start code here!');
};

WebRtc.prototype.onrtc = async function(x) {
  try {
    if (x.offer) {
      if (this.imp && (this.inprogress || this.rtc.signalingState != 'stable' && !this.pending)) return;
      await this.rtc.setRemoteDescription(new RTCSessionDescription(x.offer));
      await this.rtc.setLocalDescription();
      this.sig.rtc({ answer: this.rtc.localDescription });
    }
    else if (x.answer) {
      this.pending = true;
      await this.rtc.setRemoteDescription(new RTCSessionDescription(x.answer));
      this.pending = undefined;
    }
    else if (x.candidate) {
      await this.rtc.addIceCandidate(new RTCIceCandidate(x.candidate));
    }
  }
  catch (e) { error(e); }
};

WebRtc.prototype.onicecandidate = function(x) {
  if (x.candidate !== null) this.sig.rtc({ candidate: x.candidate });
};

WebRtc.prototype.offer = async function() {
  this.inprogress = true;
  try {
    await this.rtc.setLocalDescription();
    this.sig.rtc({ offer: this.rtc.localDescription });
  }
  catch (e) { error(e); }
  this.inprogress = undefined;
};

function error(e) { console.log('Error:', e.message); }