"use strict";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

const app = express();
app.use(
  helmet({
    dnsPrefetchControl: false,
    contentSecurityPolicy: {
      directives: {
        "img-src": [
          " https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8c3RvY2slMjBtYXJrZXR8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
        ],
        // Allows loading of scripts and CSS from your server only.
        scriptSrc: ["'self'", "https://code.jquery.com/"],
        styleSrc: ["'self'"],
      },
    },
  })
);

app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route("/").get(function (req, res) {
  // instag;
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log("Tests are not valid:");
        console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
