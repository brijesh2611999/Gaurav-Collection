const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    author: { type: String, required: true },
    likes: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    resolution: { type: String },
    format: { type: String },
    aspectRatio: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', imageSchema);
