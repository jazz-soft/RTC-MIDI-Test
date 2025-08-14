function WebRtc(sig) {
  var self = this;
  this.sig = sig;
  this.rtc = new RTCPeerConnection();
  this.sig.onfound = function() { self.start(); };
}

WebRtc.prototype.start = function() {

}
