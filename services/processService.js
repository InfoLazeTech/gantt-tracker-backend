const Process = require('../Models/process.model');
const { getPagination } = require('../utils/pagination');

exports.getAllProcessesService = async (query) => {
  const { page, limit, skip } = getPagination(query);

  const [processes, total] = await Promise.all([
    Process.find().skip(skip).limit(limit),
    Process.countDocuments()
  ]);

  return {
    processes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
