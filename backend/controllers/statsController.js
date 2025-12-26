const User = require('../models/userModel');
const Membership = require('../models/membershipModel');
const CourtCase = require('../models/courtCaseModel');

exports.getSummary = async (_req, res) => {
  try {
    // Use Membership model instead of User model for consistency
    const agg = await Membership.aggregate([
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

exports.getDepartmentStats = async (req, res) => {
  try {
    const { division } = req.query;

    if (!division) {
      return res.status(400).json({ message: 'Division parameter is required' });
    }

    const departmentStats = await Membership.aggregate([
      { $match: { division: division } },
      { $group: { _id: { $ifNull: ['$department', 'Unknown'] }, count: { $sum: 1 } } },
      { $project: { _id: 0, department: '$_id', count: 1 } },
      { $sort: { department: 1 } },
    ]);

    return res.json({ departmentStats });
  } catch (e) {
    console.error('department stats error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};
