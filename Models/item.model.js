const mongoose = require('mongoose');
const Recipe = require('../Models/recipe.model');
const Counter = require('./counter.model');

const itemSchema = new mongoose.Schema({
    itemId: { type: String, unique: true },
    PONumber: { type: String, unique: true, required: true },
    customerName: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    estimatedEndDate: { type: Date },
    description: { type: String },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
    processes: [
        {
            processId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Process'
            },
            startDateTime: { type: Date },
            endDateTime: { type: Date },
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

itemSchema.pre('save', async function (next) {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'itemId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.itemId = 'I' + counter.seq;
    }
    next();
});

module.exports = mongoose.model('Item', itemSchema);