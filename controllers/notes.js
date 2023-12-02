const notesRouter = require("express").Router();
const Note = require("../models/notes");
const logger = require("../utils/logger");

notesRouter.get("/", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

notesRouter.get("/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      logger.info("error", err);
      next(err);
    });
});
notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

notesRouter.put("/:id", (req, res, next) => {
  const { content, important } = req.body;
  logger.info("content", content);
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

notesRouter.post("/", (req, res, next) => {
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

module.exports = notesRouter;
