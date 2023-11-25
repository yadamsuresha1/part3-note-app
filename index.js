require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/notes");
const requestLogger = (req, res, next) => {
  console.log("Method", req.method);
  console.log("Path", req.path);
  console.log("Body", req.body);
  console.log("----");
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error("error", err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(404).json({ error: err.message });
  }
  next(err);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: "unknown endpoint",
  });
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("dist"));

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      console.log("error", err);
      next(err);
    });
});
app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.put("/api/notes/:id", (req, res, next) => {
  const { content, important } = req.body;
  console.log("content", content);
  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((err) => next(err));
});

app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });
  note
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((err) => next(err));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
