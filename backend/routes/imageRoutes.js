const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public Routes
router.get('/', imageController.getImages);
router.get('/:id', imageController.getImageById);

// Admin Only Routes
router.post('/', protect, admin, upload.single('image'), imageController.createImage);
router.delete('/:id', protect, admin, imageController.deleteImage);

module.exports = router;
