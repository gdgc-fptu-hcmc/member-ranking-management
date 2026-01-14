import express from 'express';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', (req, res) => {
  res.send('This is the GET users route');
});

// @route   POST /api/users
// @desc    Create a user
// @access  Public
router.post('/', (req, res) => {
  res.send('This is the CREATE user route');
});

export default router;