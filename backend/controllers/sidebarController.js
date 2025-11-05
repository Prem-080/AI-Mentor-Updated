import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get sidebar navigation items
// @route   GET /api/sidebar/navigation
// @access  Private
const getNavigationItems = async (req, res) => {
  try {
    // Read the sidebar.json file
    const sidebarPath = path.join(__dirname, '../../frontend/public/data/sidebar.json');
    const sidebarData = fs.readFileSync(sidebarPath, 'utf8');
    const navigationItems = JSON.parse(sidebarData);

    // Filter items based on user role
    const userRole = req.user.role;
    let filteredItems = navigationItems;

    if (userRole !== 'admin') {
      // Hide admin panel for non-admin users
      filteredItems = navigationItems.filter(item => item.id !== 'admin');
    }

    res.json(filteredItems);
  } catch (error) {
    console.error('Error reading sidebar data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getNavigationItems };
