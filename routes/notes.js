// routes/notes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// GET /api/notes - Get all notes for a user, with optional since parameter
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/notes');
    const { since, userEmail } = req.query;
    
    if (!userEmail) {
      console.log('userEmail is required');
      return res.status(400).json({ error: 'userEmail is required' });
    }

    let query = { userEmail };
    
    // If since parameter provided, only get notes updated after that date
    if (since) {
      query.updatedAt = { $gte: new Date(since) };
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 });
    
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes - Create or update a note
router.post('/', async (req, res) => {
  try {
    const { _id, title, note, createdAt, updatedAt, userEmail } = req.body;

    if (!_id || !title || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upsert - create if doesn't exist, update if it does
    const result = await Note.findOneAndUpdate(
      { _id },
      {
        title,
        note,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        userEmail,
      },
      { 
        upsert: true, 
        new: true, 
        runValidators: true 
      }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error saving note:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// GET /api/notes/:id - Get specific note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    const { title, note } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id },
      { 
        title,
        note,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id });
    
    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;