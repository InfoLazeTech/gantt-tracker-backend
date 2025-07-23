const mongoose = require('mongoose');
const Counter = require('./counter.model');
const Process = require('../Models/process.model');

const recipeSchema = new mongoose.Schema({
    recipeId: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    processes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Process',
            required: true,
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

recipeSchema.pre('save', async function (next) {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'recipeId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.recipeId = 'R' + counter.seq;
    }
    next();
});

module.exports = mongoose.model('Recipe', recipeSchema); 