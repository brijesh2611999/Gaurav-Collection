const Image = require('../models/Image');

// Get all images with filtering and searching
exports.getImages = async (req, res) => {
    try {
        const { category, q, sortBy } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { author: { $regex: q, $options: 'i' } },
                { id: { $regex: q, $options: 'i' } }
            ];
        }

        let sortOption = {};
        if (sortBy === 'price-low') sortOption = { price: 1 };
        else if (sortBy === 'price-high') sortOption = { price: -1 };
        else if (sortBy === 'recent') sortOption = { createdAt: -1 };
        else if (sortBy === 'downloads') sortOption = { downloads: -1 };
        else sortOption = { likes: -1 };

        const images = await Image.find(query).sort(sortOption);
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get image by ID
exports.getImageById = async (req, res) => {
    try {
        const image = await Image.findOne({ id: req.params.id });
        if (!image) return res.status(404).json({ message: 'Image not found' });
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new image (Admin only)
exports.createImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image file' });
        }

        const { title, description, category, author, tags } = req.body;

        // Generate a unique ID based on title or random string
        const id = title.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substring(2, 7);

        const newImage = new Image({
            id,
            title,
            description,
            url: req.file.path, // Cloudinary URL
            category: category || 'Others',
            author: author || 'Gaurav Collection',
            price: 0,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            likes: 0,
            downloads: 0
        });

        const savedImage = await newImage.save();
        res.status(201).json(savedImage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete image (Admin only)
exports.deleteImage = async (req, res) => {
    try {
        const image = await Image.findOne({ id: req.params.id });
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Extract public_id from Cloudinary URL
        // Example URL: https://res.cloudinary.com/cloudname/image/upload/v12345/folder/public_id.jpg
        const urlParts = image.url.split('/');
        const fileName = urlParts[urlParts.length - 1]; // public_id.jpg
        const folderName = urlParts[urlParts.length - 2]; // folder (if exists)
        const publicId = `${folderName}/${fileName.split('.')[0]}`;

        const { cloudinary } = require('../config/cloudinary');

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Delete from MongoDB
        await Image.deleteOne({ id: req.params.id });

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
