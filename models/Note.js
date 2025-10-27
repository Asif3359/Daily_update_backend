// models/Note.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId, // Compatible with Realm.BSON.ObjectId
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "",
  },
  note: {
    type: String,
    required: true,
    default: "",
  },
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false, // Soft delete for sync purposes
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

// Index for efficient sync queries
NoteSchema.index({ userEmail: 1, updatedAt: 1 });
NoteSchema.index({ userEmail: 1, isDeleted: 1 });

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;

