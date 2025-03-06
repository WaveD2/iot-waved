const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config();

const port = process.env.PORT || 4000;
const server = http.createServer(app);

mongoose.connect("mongodb+srv://tungdev64:8FtxSZp9VAjQla0F@iot.vbunp.mongodb.net", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB!");
}).catch(err => {
  console.error("Failed to connect to MongoDB:", err.message);
});


server.listen(port, () => {
  console.log(`HTTP + WebSocket server running on port: ${port}`);
});
