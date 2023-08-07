const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 4000;

const server = http.createServer(app);

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let formValues = null;
let formTouchedFields = null;
let formEdits = null;

io.on("connection", (socket) => {
  io.emit("listen_to_formValues", formValues);
  io.emit("listen_to_touchedFields", formTouchedFields);
  io.emit("listen_to_formEdits", formEdits);

  socket.on("formValues", (values) => {
    if (!values) {
      formValues = values;
    } else {
      formValues = { ...formValues, ...values };
    }

    socket.broadcast.emit("listen_to_formValues", formValues);
  });

  socket.on("touchedFields", (fields) => {
    formTouchedFields = fields;
    io.emit("listen_to_touchedFields", formTouchedFields);
  });

  socket.on("formEdits", (fields) => {
    formEdits = fields;
    io.emit("listen_to_formEdits", formEdits);
  });
});

server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
