# RTC-MIDI-Test
This is a test/demo for the [JZZ-midi-RTC](https://github.com/jazz-soft/JZZ-midi-RTC) package.

You can use it as a starting point for your own applications.

This server establishes a WebRTC session between two clients on a local network.

For simplicity, only two clients are supported simultaneously, and no STUN/TURN servers are involved.

## Usage
`npm install`  
`npm start` or `npm start -- <port>`,  
where `<port>` is the port number, default: `8888`

Optional: to enable `https`, create files `server.key` and `server.crt` in the project directory.  
e.g. `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./server.key -out server.crt`