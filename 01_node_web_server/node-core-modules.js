const path = require("path");
const os = require("os");
const fs = require("fs");
const events = require('events');


// console.log('\n',path);
console.log(path.parse("E:projectsBackend/01_node_web_server/server-node.js"));
console.log('directory : ',path.dirname("E:projectsBackend/01_node_web_server/server-node.js"));
console.log('file type : ',path.extname('E:projectsBackend/01_node_web_server/server-node.js'));


// console.log('\n',os);
console.log('\n os : ',os.type());
console.log('Achitecture : ',os.arch());
console.log('Hostname : ',os.hostname());
console.log('Platform : ',os.platform());
console.log('Free memory',os.freemem());
console.log("cpu's : ",os.cpus());


// synchronous way to perform file operation
fs.writeFileSync('test.txt','this ia a testing of node js'); // writeing a text in the file
fs.appendFileSync('test.txt', '\nappend a text with out replacing'); // add new line to existing file
console.log('\n',fs.readFileSync('test.txt').toString());
console.log('\n',fs.readFileSync('test.txt',{encoding: 'utf-8'}));
fs.unlinkSync('test.txt'); // delete file


// Asynchronous way to perform file operation
fs.writeFile('asyn.txt', " this is a asynchronous file testing in node js", (error) => {  // writing a content in the file in the asynchronous way
    if (!error) {
        console.log("File created successfully");
    }
});
fs.appendFile('asyn.txt',"\nappend a text with out replacing", (error) => {  // adding new line in the file in aysnchronous way
    if (!error) {
        console.log("File updated successfully");
    }
})
fs.readFile('asyn.txt',(error, data) => {   // reading a file in the asynchronous way
    if (!error) {
        console.log('\n',data.toString());
    }
});

fs.readFile('asyn.txt',{ encoding : 'utf-8' },(error, data) => {
    if (!error) {
        console.log('\n',data);
    }
});
setTimeout(() => {  // Delete file after 1 second in aysnchronous way
    fs.unlink("asyn.txt", (error) => {
      if (!error) {
        console.log("\nFile Deleted successfully");
      }
    });
},1000);
console.log("\ncalling after aync functions calling");

//setting a timeout for 1sec
setTimeout(() => {

  // event emitter
  // console.log(events);
  const eventemitter = new events.EventEmitter();

  // register an event
  eventemitter.on("myevent", () => {
    console.log("\nthis is my event the name of the event is : myevent\n");
  });

  eventemitter.on("event-2", (params) => {
    console.log(params);
  })

  console.log("I am in between register and raise an event");

  // emit or raise an event
  eventemitter.emit("myevent");
  eventemitter.emit('event-2','hello from event 2');

}, 1000);