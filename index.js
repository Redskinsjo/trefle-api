// Server created to make api calls and hide token

// import dependencies
const express = require("@feathersjs/express");
const feathers = require("@feathersjs/feathers");
const socketio = require("@feathersjs/socketio");
// const express = require("express");
const cors = require("cors");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const moment = require("moment");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// init the server
const app = express(feathers());
app.use(cors());
app.use(formidable());

class MessageService {
  constructor() {
    this.messages = [];
  }

  async find() {
    return this.messages;
  }

  async create(data) {
    const time = Date.now().toString();
    const colors = ["blue", "red", "pink", "green", "black", "orange"];
    const rand = Math.floor(Math.random() * (colors.length - 1 - 0) + 0);
    const color = colors[rand];
    const message = {
      id: this.messages.length,
      text: data.text,
      datetime: time,
      color,
    };

    this.messages.push(message);

    return message;
  }
}

// use of middlewares
const loginRoute = require("./routes/user/login");
app.use(loginRoute);
const signupRoute = require("./routes/user/signup");
app.use(signupRoute);
const plantsRoute = require("./routes/plants");
app.use(plantsRoute);
const familiesRoute = require("./routes/families");
app.use(familiesRoute);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// host static files from the current folder
app.use(express.static(__dirname));
// Add REST API support
app.configure(express.rest());
app.configure(socketio());
app.use("/messages", new MessageService());
app.use(express.errorHandler());

app.on("connection", (connection) => app.channel("everybody").join(connection));
app.publish((data) => app.channel("everybody"));

app.all("*", (req, res) => {
  res.status(400).json({ error: "This route doesn't exist" });
});

app
  .listen(process.env.PORT || 3000)
  .on("listening", () =>
    console.log("Server started on", process.env.PORT || 3000)
  );

app.service("/messages").create({
  text: "Hello real-time world",
});
app.service("/messages").create({
  text: "Voici un chat pour tous, écrivez ce qu'il vous passe par la tête !",
});
