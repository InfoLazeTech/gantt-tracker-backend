const Recipe = require('../Models/recipe.model');
const Process = require('../Models/process.model');
const mongoose = require('mongoose');
const { getAllRecipesService } = require('../services/recipeService');

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const result = await getAllRecipesService(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    const { name, description, processes } = req.body;
    if (processes && processes.length > 0) {
      // Filter only valid ObjectIds
      const validObjectIds = processes.filter(id => mongoose.Types.ObjectId.isValid(id));
      // Find which ones exist in the database
      const foundProcesses = await Process.find({ _id: { $in: validObjectIds } });
      const foundIds = foundProcesses.map(p => p._id.toString());
      const missingIds = processes.filter(id => !foundIds.includes(id));
      if (missingIds.length > 0) {
        return res.status(400).json({ error: 'One or more process IDs do not exist in the database.', missingIds });
      }
    }
    const recipe = new Recipe({ name, description, processes });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 

exports.updateRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { name, description, processes } = req.body;
    // Validate processes if provided
    if (processes && processes.length > 0) {
      const validObjectIds = processes.filter(id => mongoose.Types.ObjectId.isValid(id));
      const foundProcesses = await Process.find({ _id: { $in: validObjectIds } });
      const foundIds = foundProcesses.map(p => p._id.toString());
      const missingIds = processes.filter(id => !foundIds.includes(id));
      if (missingIds.length > 0) {
        return res.status(400).json({ error: 'One or more process IDs do not exist in the database.', missingIds });
      }
    }
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { recipeId },
      { name, description, processes, updatedAt: Date.now() },
      { new: true }
    );  
    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const deletedRecipe = await Recipe.findOneAndDelete({ recipeId });
    if(!deletedRecipe){
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe deletd successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
};