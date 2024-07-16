// we doesn't need dotenv in latest version of node, but in production side servers doesn't use latest node version for that we need .env file
import "dotenv/config";
import express from "express";
import logger from "../utilities/logger.js"; // Add custom logger
import morgan from "morgan";

// Express Setup
const app = express();
const port = process.env.PORT || 3000;

// Settings for Frontend side using middlewares
app.use(express.json()); // Accepting data from the frontend in JSON format

// Setup Logger
const morganFormat = ":method :url :status :response-time ms"; // set Format

app.use(
  // Add Middleware for the logger
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// store data in array
let teaData = [];
let nextId = 1;

// hello message
app.get("/", (req, res) => {
  res.send("Hello from Ajay Duddi! A tea manager !");
});

// Add Tea
app.post("/teas", (req, res) => {
  const { name, price } = req.body;
  const newTea = { id: nextId++, name: name, price: price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

// Get all Teas
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

// Get Tea by id [ route params ]
app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((tea) => tea.id === parseInt(req.params.id));
  if (!tea) {
    res.status(404).send("Tea not found");
  }
  res.status(200).send(tea);
});

// Update Tea [ route params ]
app.put("/teas/:id", (req, res) => {
  const tea = teaData.findIndex((tea) => tea.id === parseInt(req.params.id));
  if (tea !== -1) {
    const { name, price } = req.body;
    const u = (teaData[tea] = {
      id: parseInt(req.params.id),
      name: name,
      price: price,
    });
    if (u) {
      res.status(200).send("Tea updated");
    }
    res.status(500).send("Internal Server Error");
  }
  res.status(404).send("Tea not found");
});

// Delete Tea [ route params ]
app.delete("/teas/:id", (req, res) => {
  const tea = teaData.findIndex((tea) => tea.id === parseInt(req.params.id));
  console.log(tea, req.params.id);
  if (tea) {
    teaData.splice(tea, 1);
    res.status(200).send("Tea deleted");
  }
  res.status(404).send("Tea not found");
});

// add listener
app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
