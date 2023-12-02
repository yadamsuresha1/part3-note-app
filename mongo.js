const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please send password as argument");
  process.exit(1);
}
const password = process.argv[2];
console.log("password", password);
const url = `mongodb+srv://fullstacknotes:${password}@cluster0.vb4raga.mongodb.net/noteApp?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});
const Note = mongoose.model("Note", noteSchema);

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
