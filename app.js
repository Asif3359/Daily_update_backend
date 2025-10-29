var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const connectDB = require("./configs/database");

connectDB();

var indexRouter = require("./routes/index");
var notesRouter = require("./routes/notes");

var app = express();

// Configure CORS for multiple environments
const corsOptions = {
  origin: [
    'http://localhost:3000',           // Web localhost
    'http://localhost:3001',           // Alternative web port
    'http://127.0.0.1:3000',           // Web localhost IP
    'http://10.0.2.2:3000',            // Android emulator
    'http://192.168.1.0/24',           // Local network range (update as needed)
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// For development, you might want to allow all origins
// Uncomment the line below if you want to allow all origins
// app.use(cors());

// Use configured CORS
app.use(cors(corsOptions));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/notes", notesRouter);
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
