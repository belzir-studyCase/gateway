const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");


var app = express();

app.use(cors());
app.use(express.json());

// Set default route for '/'
app.get('/', (req, res) => {
  res.send('Welcome to the Gateway URL!');
});


app.use("/account", proxy("http://localhost:3001"));
app.use("/request", proxy("http://localhost:3002"));


app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(3000, () => {
  console.log(`Server is Fire at http://localhost:3000`);
});
module.exports = app;