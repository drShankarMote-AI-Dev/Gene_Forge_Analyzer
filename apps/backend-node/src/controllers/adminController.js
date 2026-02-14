const User = require('../models/User');
const Log = require('../models/Log');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot delete admin' });
            }
            await user.deleteOne();
            await Log.create({
                userId: req.user._id,
                action: `Admin Deleted User ${user.email}`,
                metadata: { deletedUserId: user._id }
            });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private/Admin
exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.find({})
            .populate('userId', 'name email')
            .sort({ timestamp: -1 })
            .limit(100); // Pagination recommended for prod
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const logCount = await Log.countDocuments();
        const recentLogs = await Log.find({})
            .sort({ timestamp: -1 })
            .limit(5);

        res.json({
            totalUsers: userCount,
            totalLogs: logCount,
            recentActivity: recentLogs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
