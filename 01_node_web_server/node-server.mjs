//ECMAScript modules (ES Module).  use new ECMA Script standards. 
// 
import { createServer } from "http";

const hostname = "127.0.0.1";
const port = 3000;

// createing a http server
const server = createServer((req, res) => {
  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/json");
    res.end(" Hello World\n");
  }else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/json");
    res.end(" Page Not Found \n");
  }
});

server.listen(port, hostname, () => {
  console.log("server running at http://" + hostname + ":" + port + "/");
});