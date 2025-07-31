import User from '../../models/userModel.js';

export const getUsersByRole = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search = '' } = req.query;

    if (!role) {
      return res.status(400).json({ message: 'Role query parameter is required' });
    }

    const rolesToFetch = role.split(',');

    // Validate roles
    const validRoles = ['user', 'partner', 'studio owner', 'space owner', 'freelancer', 'super-admin', 'admin'];
    const invalidRoles = rolesToFetch.filter(r => !validRoles.includes(r));
    if (invalidRoles.length > 0) {
      return res.status(400).json({ message: `Invalid roles: ${invalidRoles.join(', ')}` });
    }

    // Calculate pagination values
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Create search criteria
    const searchCriteria = {
      roles: { $in: rolesToFetch },
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } },
        ],
      }),
    };

    // Fetch users based on roles with pagination and search
    const users = await User.find(searchCriteria)
      .skip(skip)
      .limit(pageSize);

    // Get total count of users for the given roles and search criteria
    const totalUsers = await User.countDocuments(searchCriteria);

    res.status(200).json({
      totalUsers,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: pageNumber,
      users,
    });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ message: 'An error occurred while fetching users by role', error: error.message });
  }
};
