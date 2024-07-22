const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const dbConnection = require("./config/db");
const PORT = process.env.PORT;
const router = require("./routers/routes");
const cors = require("cors");


app.use(cors({
    origin: ["http://localhost:5173", "https://job-search-portal-frontend.vercel.app"],
    exposedHeaders: ['Authorization'],
    credentials: true,
  }));


dbConnection();

app.use(express.json());


// log every incoming request
// store it in a file
app.use((req, res, next) => {
  const log = `${req.method} - ${req.url} - ${req.ip} - ${new Date()}/n`;
  fs.appendFile("log.txt", log, (err) => {
      if (err) {
          console.log(err);
      }
  });
  next();
});




app.use('/api/v1',router)

app.get("/", (req, res) => {
  res.send("Welcome to the website!");
});



// error handling middleware
app.use((err, req, res, next) => {
  let log;
  log = err.stack;
  log += `/n${req.method} - ${req.url} - ${req.ip} - ${new Date()}/n`;
  fs.appendFile("error.txt", log, (err) => {
      if (err) {
          console.log(err);
      }
  });
  res.status(500).send("Something went wrong");
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
