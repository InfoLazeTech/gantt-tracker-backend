const Process = require('../Models/process.model');
const Recipe = require('../Models/recipe.model');
const { getAllProcessesService } = require('../services/processService');

// Get all processes
exports.getAllProcesses = async (req, res) => {
  try {
    const result = await getAllProcessesService(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new process
exports.createProcess = async (req, res) => {
  try {
    const { name, description, day } = req.body;
    const process = new Process({ name, description, day });
    await process.save();
    res.status(201).json(process);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get process by processId with related recipes
exports.getProcessById = async (req, res) => {
  try {
    const { processId } = req.params;
    const process = await Process.findOne({ processId });
    if (!process) {
      return res.status(404).json({ error: 'Process not found' });
    }
    // Find all recipes that include this processId
    const recipes = await Recipe.find({ processId: processId });
    res.status(200).json({ process, recipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProcess = async (req, res) => {
  try {
    const { processId } = req.params;
    const { name, description, day } = req.body;
    const updatedProcess = await Process.findOneAndUpdate(
      { processId },
      { name, description, day, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedProcess) {
      return res.status(404).json({ error: 'Process not found' });
    }
    res.status(200).json({
      message: 'Process updated successfully',
      process: updatedProcess
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProcess = async (req, res) => {
  try {
    const { processId } = req.params;
    const deletedProcess = await Process.findOneAndDelete({ processId });
    if (!deletedProcess) {
      return res.status(404).json({ error: 'Process not found' });
    }
    res.status(200).json({ message: 'Process deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};