function WebRtc(sig) {
  this.sig = sig;
  this.rtc = new RTCPeerConnection();
}

WebRtc.prototype.addTrack = function(tr) {

}