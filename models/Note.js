// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  _id: {
    type: String, // Store Realm ObjectId as string
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  note: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    index: true, // For faster queries by user
  },
  syncStatus: {
    type: Number,
    default: 1, // Backend notes are always synced
    enum: [0, 1]
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Compound index for efficient querying
noteSchema.index({ userEmail: 1, updatedAt: -1 });

module.exports = mongoose.model('Note', noteSchema);