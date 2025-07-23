const express = require('express');
const router = express.Router();
const recipeController = require('../Controllers/recipe.controller');

router.get('/recipes', recipeController.getAllRecipes);
router.post('/recipes', recipeController.createRecipe);
router.put('/recipes/:recipeId', recipeController.updateRecipe);
router.delete('/recipes/:recipeId', recipeController.deleteRecipe);

module.exports = router; 