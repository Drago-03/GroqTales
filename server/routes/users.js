/**
 * Users API Routes
 * Handles user authentication, profiles, and preferences
 */

const express = require('express');
const router = express.Router();

// GET /api/v1/users/profile - Get user profile
router.get('/profile', async (req, res) => {
  try {
    const profile = {
      id: 'user123',
      username: 'storyteller',
      email: 'user@example.com',
      preferences: {
        favoriteGenres: ['fantasy', 'sci-fi'],
        theme: 'dark'
      },
      createdAt: new Date().toISOString()
    };
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/v1/users/profile - Update user profile
router.put('/profile', async (req, res) => {
  try {
    const updates = req.body;
    
    const updatedProfile = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
