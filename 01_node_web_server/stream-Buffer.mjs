import fs from 'fs';
import { createServer } from 'http';
import { buffer } from 'stream/consumers';

const stream = fs.createReadStream('./DL Application.pdf') // we use stream instance as a event emitter
const writestream = fs.createWriteStream("output.pdf");


// 1st method to read stream
// stream.on('data',(buffer) => {
//     console.log(buffer.toString());
// });

// 2nd method to read stream
// const stream1 = fs.createReadStream('./DL Application.pdf',{encoding: 'utf-8'})
// stream1.on('data',(buffer) => {
//     console.log(buffer);
// })

// 3rd method to read stream
// let content = []
// stream.on('data', (buffer) => {
//     content.push(buffer);
// })

// stream.on('end', () => {  
//     const actualData = Buffer.concat(content).toString();
//     console.log(actualData);
// });


// 1st method to write stream
// stream.on('data',(buffer) => {
//     writestream.write(buffer);
// })

// 2nd method to write stream
// stream.pipe(writestream)


const server = createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, {
          "Content-Type": "application/pdf",
        });
        //sending the stream to the client  [ write the stream into the response ]
        stream.pipe(res);
    }
    else {
        res.setHeader("Content-Type", "text/json");
        res.statusCode = 404
        res.end("Page Not Found");
    }
    
});

server.listen(3000,()=>{
    console.log("server started at http://localhost:3000");
});