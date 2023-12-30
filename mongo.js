const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please send password as argument");
  process.exit(1);
}
const password = process.argv[2];
console.log("password", password);
const content = process.argv[3];

// const url = `mongodb+srv://fullstacknotes:${password}@cluster0.vb4raga.mongodb.net/noteApp?retryWrites=true&w=majority`;
const url = `mongodb+srv://fullstacknotes:${password}@cluster0.vb4raga.mongodb.net/testNoteApp?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});
const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: content,
  important: false,
});

if (content) {
  note.save().then(() => {
    console.log(`notes ${content} added`);
    mongoose.connection.close();
  });
} else {
  Note.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note);
    });
    mongoose.connection.close();
  });
}
