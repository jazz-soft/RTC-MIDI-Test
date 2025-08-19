coming soon...

## Usage
`npm install`  
`npm start` or `npm start -- <port>`,  
where `<port>` is the port number, default: `8888`

Optional: to enable `https`, create files `server.key` and `server.crt` in the project directory.  
e.g. `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./server.key -out server.crt`