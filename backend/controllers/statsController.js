const User = require('../models/userModel');
const CourtCase = require('../models/courtCaseModel');

exports.getSummary = async (_req, res) => {
  try {
    const agg = await User.aggregate([
      { $group: { _id: { $ifNull: ['$division', 'Unknown'] }, count: { $sum: 1 } } },
      { $project: { _id: 0, division: '$_id', count: 1 } },
      { $sort: { division: 1 } },
    ]);

    const membersTotal = agg.reduce((a, b) => a + (b.count || 0), 0);
    const divisionsTotal = agg.length;
    const courtCasesTotal = await CourtCase.countDocuments();

    return res.json({
      memberCounts: agg,
      totals: { divisions: divisionsTotal, members: membersTotal, courtCases: courtCasesTotal },
    });
  } catch (e) {
    console.error('stats summary error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};
