import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import multer from 'multer';
import path from 'path';
import { log } from 'console';
import Partner from '../models/partner/partner.Model.js'

// Protect middleware (JWT authentication)
export const protect = async (req, res, next) => {

  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      // Logging allowed roles for debugging
      console.log('Allowed roles:', roles);

      // Check if req.user exists and role is authorized
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // If user role is not in the allowed roles array
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `User role (${req.user.role}) is not authorized to access this resource`,
        });
      }

      // Proceed to the next middleware if role is authorized
      next();
    } catch (error) {
      // Log the error for debugging
      console.error('Authorization error:', error.message);

      // Return a server error response
      return res.status(500).json({
        message: 'Server error occurred while authorizing roles',
      });
    }
  };
};

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Path to save the uploaded files
  },
  filename: (req, file, cb) => {

    const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname); 
    cb(null, fileName);
  },
});


// Middleware to verify admin token
export const verifyAdminToken = (req, res, next) => {
  try {
    debugger;
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
    
   

    jwt.verify(token, '1234', async (err, decoded) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to authenticate token', error: err.message });
      }

      try {
        req.userId = decoded.id;
        const user = await User.findById(req.userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
      } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const checkRole = (roles) => (req, res, next) => {
  if (!roles.some(role => req.user.roles.includes(role))) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};



// Initialize multer with storage configuration
export const upload = multer({ storage });


export const accessPermissionStudioOwner = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    console.log(user, "user");
    const { roles } = user;
    console.log(roles, "roles");
    if(!roles.includes('studio owner') ){  
      return res.status(403).json({ message: 'Access denied...' });
    }
    req.body.id = decoded.id;
    req.body.currentRole = 'studio owner';
    next();

  } catch (error) {

    console.error('Error identifying user role and ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const identifyUserRoleAndId = async (req, res, next) => {
  try {
    debugger;
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const user = await User.findById(decoded.id);
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.roles.includes('admin') || user.roles.includes('super admin')) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    
   
    if (!req.body.userId) {
      req.body.userId = user._id;
    }

    if (!req.body.userRole) {
      // req.body.userRole = "user";
      req.body.userRole = "studio owner";

    }

    next();
  } catch (error) {
    console.error('Error identifying user role and ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { identifyUserRoleAndId };
