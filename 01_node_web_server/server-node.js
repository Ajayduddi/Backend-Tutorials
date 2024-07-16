// common JS . For importing use require('filename') .. For exporting use module.exports = ('filename') . 
// CJS modules are loaded synchronously, meaning the code execution waits until a module is fully loaded before moving on.
const http = require("http");
const fs = require("fs");

const hostname = '127.0.0.1';
const port = 3000;

// createing a http server
const server = http.createServer((req,res)=>{ 
    if (req.url === "/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/json");
      res.end(" Hello World\n");
    } 
    else if (req.url === "/dl") {
      fs.readFile("./DL Application.pdf", (error, data) => {
        if (!error) {
          res.end(data);
        }
      });
    }
    // else if (req.url === "/exe") {
    //   fs.readFile("./rufus-4.1.exe", (error, data) => {
    //     if (!error) {
    //       res.end(data);
    //     }
    //   });
    // }
    else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/json");
      res.end(" Page Not Found \n");
    }
});

// the server instance is also a event emitter.
server.on('connection',() => {
    console.log("New Connection established");
})

server.on('request',(req) => {
    console.log("connection made a request to the server");
    console.log("request contains : ",req.url);
})

server.listen(port,hostname,()=>{
    console.log('server running at http://'+hostname+':'+port+'/');
})