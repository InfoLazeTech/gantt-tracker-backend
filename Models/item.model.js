const mongoose = require('mongoose');
const Recipe = require('../Models/recipe.model');
const Counter = require('./counter.model');

const itemSchema = new mongoose.Schema({
    itemId: { type: String, unique: true },
    PONumber: { type: String, unique: true, required: true },
    RefNumber: { type: String, unique: true },
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

// itemSchema.pre('save', async function (next) {
//     if (this.isNew) {
//         // Auto-increment itemId
//         const itemCounter = await Counter.findByIdAndUpdate(
//             { _id: 'itemId' },
//             { $inc: { seq: 1 } },
//             { new: true, upsert: true }
//         );
//         this.itemId = 'I' + itemCounter.seq;

//         // RefNumber generation
//         const refCounter = await Counter.findByIdAndUpdate(
//             { _id: 'refNumber' },
//             { $inc: { seq: 1 } },
//             { new: true, upsert: true }
//         );

//         // Random letter A–Z
//         const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//         const randomLetter = letters[Math.floor(Math.random() * 26)];

//         // Ensure number is always 5-digit (e.g., 10001, 10002...)
//         const baseNumber = 52315+ refCounter.seq;

//         this.RefNumber = randomLetter + baseNumber;
//     }

//     next();
// });
itemSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Auto-increment itemId
        const itemCounter = await Counter.findByIdAndUpdate(
            { _id: 'itemId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.itemId = 'I' + itemCounter.seq;

        // RefNumber with random letter + random 5-digit number
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetter = letters[Math.floor(Math.random() * 26)];
        const randomFiveDigit = Math.floor(10000 + Math.random() * 90000); // Always 5 digits
        this.RefNumber = randomLetter + randomFiveDigit;
    }

    next();
});


module.exports = mongoose.model('Item', itemSchema);