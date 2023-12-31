const express = require("express");
const http = require("http");
const cors = require("cors");
const formConfig = require("./formConfig/formConfig");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 4000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

let formValues = null;
let formTouchedFields = null;
let formEdits = null;

io.on("connection", (socket) => {
  socket.emit("formConfig", formConfig);
  socket.emit("listen_to_formValues", formValues);
  socket.emit("listen_to_touchedFields", formTouchedFields);
  socket.emit("listen_to_formEdits", formEdits);

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
