const mongoose = require('mongoose');
const Counter = require('./counter.model');

const processSchema = new mongoose.Schema({
  processId: { type: String, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  day: { type: String, required: false }
});

processSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'processId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.processId = 'P' + counter.seq;
  }
  next();
});

module.exports = mongoose.model('Process', processSchema); 