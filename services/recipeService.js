const Recipe = require('../Models/recipe.model');
const { getPagination } = require('../utils/pagination');

exports.getAllRecipesService = async (query) => {
  const { page, limit, skip } = getPagination(query);

  const [recipes, total] = await Promise.all([
    Recipe.find()
      .skip(skip)
      .limit(limit)
      .populate('processes', 'name day'),
    Recipe.countDocuments()
  ]);

  return {
    recipes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
