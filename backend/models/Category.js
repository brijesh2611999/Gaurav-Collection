const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    itemCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Category', categorySchema);
