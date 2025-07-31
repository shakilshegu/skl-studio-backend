import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


// export const protect = async (req, res, next) => {

//     let token;
    
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     }
  
//     if (!token) {
//       return res.status(401).json({ message: 'Not authorized, no token' });
//     }
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id).select('-password');
//       if (!user) {
//         return res.status(401).json({ message: 'Not authorized, user not found' });
//       }
//       const primaryRole = user.roles.find(role => role !== 'user') || user.roles[0];
//       req.user = user;
//       req.primaryRole = primaryRole;
//       console.log("primaryRole",primaryRole);
//       next();
//     } catch (error) {
//       console.log(error);
  
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   };



export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    const primaryRole = user.roles.find(role => role !== 'user') || user.roles[0];
    const isStudio = primaryRole === 'studio';
    const isFreelancer = primaryRole === 'freelancer';
    

    // Attach user and role data to the request object
    req.user = user;
    req.primaryRole = primaryRole;
    req.isStudio = isStudio;
    req.isFreelancer = isFreelancer;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};









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
  