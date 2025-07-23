const Item = require('../Models/item.model');
const { getPagination } = require('../utils/pagination');

exports.getAllItemsService = async (query) => {
  const { page, limit, skip } = getPagination(query);

  const [items, total] = await Promise.all([
    Item.find()
      .skip(skip)
      .limit(limit),
      // .populate({
      //   path: 'recipes',
      //   populate: {
      //     path: 'processes',
      //     select: 'name'
      //   },
      //   select: 'name processes'
      // }),
    Item.countDocuments()
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
