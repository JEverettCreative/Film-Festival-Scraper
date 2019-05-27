var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema ({
    _ArticleId: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    },

    noteText: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;