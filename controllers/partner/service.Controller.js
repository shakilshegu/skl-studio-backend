import Service from "../../models/partner/service.model.js";
import { uploadFile } from "../../utils/media.helper.js";
import { sendResponse } from "../../utils/responseUtils.js";
import partnerstudios from "../../models/partner/studio.model.js"
import FreelancerModel from "../../models/partner/freelancer.model.js";
import { getEntityId } from "../../utils/roleUtils.js";



// const addServiceById = async (req, res) => {
//   try {
    
//     // const { studioId } = req.params;
//     const {name, price, description } = req.body;
//     const file = req.file;
//     const userId = req.user._id

//     if (!file) {
//       return res.status(400).json({ message: 'Photo is required.' });
//     }
 
//     const studio = await partnerstudios.findOne({ "owner.userId" : userId });
//     if (!studio) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Studio not found.' 
//       });
//     }
//    // Upload photo
//    const photoUrl = await uploadFile(file, `services/${studio._id}/${file.filename}`);
//     const newService = new Service({
//       name,
//       price,
//       description,
//       photo: photoUrl,
//       studioId:studio._id
//     });
//     const savedService = await newService.save();
//     return sendResponse(res, true, 'Service added successfully.', savedService);
//   } catch (error) {
//     console.error(error.message);
//     return sendResponse(res, false, 'Error adding service', null, error.message);
//   }
// };

// const getServicesByStudioId = async (req, res) => {
//   try {
  
//     const userId = req.user._id

//     let services;

//     if(req.isStudio){
//       const studio = await partnerstudios.findOne({ "owner.userId" : userId });

//       const studioId=studio._id
          
  
//       if (!studioId) {
//         return res.status(400).json({ message: 'Studio ID is required.' });
//       }
//        services = await Service.find({ studioId: studioId, isDeleted: false });

//     }
//     else if(req.isFreelancer){
//       const freelancer = await FreelancerModel.findOne({ user : userId });

//       const freelancerId=freelancer._id
          
  
//       if (!freelancerId) {
//         return res.status(400).json({ message: 'Freelancer ID is required.' });
//       }
//        services = await Service.find({ freelancerId: freelancerId, isDeleted: false });
//     }
    

//     if (services.length === 0) {    
//       return res.status(404).json({ message: 'No services found for this studio.' });
//     }
//     return sendResponse(res, true, 'Services retrieved successfully.', services);
//   } catch (error) {
//     console.error(error.message);
//     return sendResponse(res, false, 'Error fetching services', null, error.message);
//   }
// };


const addServiceById = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Photo is required.' });
    }

    // Get the entity ID and type (studio or freelancer)
    const { entityId, entityType } = await getEntityId(req);

    // Upload photo
    const photoUrl = await uploadFile(file, `services/${entityId}/${file.filename}`);

    // Create and save the new service
    const newService = new Service({
      name,
      price,
      description,
      photo: photoUrl,
      [`${entityType}Id`]: entityId, // dynamically set studioId or freelancerId
    });

    const savedService = await newService.save();
    return sendResponse(res, true, 'Service added successfully.', savedService);
  } catch (error) {
    console.error(error.message);
    return sendResponse(res, false, 'Error adding service', null, error.message);
  }
};


const getServicesByPartnerId = async (req, res) => {
  try {
    const { entityId, entityType } = await getEntityId(req);
    
    const services = await Service.find({ [`${entityType}Id`]: entityId, isDeleted: false });

    if (services.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No services found for this ${entityType}.`,
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Services retrieved successfully.',
      data: services
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};


// Controller
const updateService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { name, price, description } = req.body;
    
    const file = req.file;

    const service = await Service.findById(serviceId);
    if (!service || service.isDeleted) {
      return sendResponse(res, false, 'Service not found or deleted', null);
    }

    if (file) {
      const photoUrl = await uploadFile(file, `service/${file.filename}`);
      service.photo = photoUrl;
    }

    service.name = serviceName || service.name;
    service.price = price || service.price;
    service.description = description || service.description;

    const updatedService = await service.save();
    return sendResponse(res, true, 'Service updated successfully', updatedService);
  } catch (error) {
    console.error('Error updating service:', error); // Log for debugging
    return sendResponse(res, false, 'Failed to update service', error.message);
  }
};


const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (!service || service.isDeleted) {
      return sendResponse(res, false, 'Service not found or already deleted', null);
    }

    service.isDeleted = true;
    await service.save();
    return sendResponse(res, true, 'Service deleted successfully', null);
  } catch (error) {
    console.error('Error deleting service:', error); // Log for debugging
    return sendResponse(res, false, 'Failed to delete service', error.message);
  }
};

const getServicesByFilter = async (req, res) => {
  try {
    const { minPrice, maxPrice, ratings } = req.query;

    const query = {};

    // Price filter with validation
    if (minPrice || maxPrice) {
      // Check if both minPrice and maxPrice are provided
      if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        return res.status(400).json({
          message: 'Invalid price range: minPrice should be less than or equal to maxPrice.',
        });
      }

      query.price = {}; // Create the filter object only once
      if (minPrice) query.price.$gte = Number(minPrice); // Greater than or equal to minPrice
      if (maxPrice) query.price.$lte = Number(maxPrice); // Less than or equal to maxPrice
    }

    // Ratings filter
    if (ratings) {
      query['reviews.rating'] = { $gte: Number(ratings) }; // Filter for reviews rating greater than or equal to the provided value
    }

    console.log('Query:', query); // Log the final query to debug

    // Fetch the services from the database
    const services = await Service.find(query);

    // Send the response
    if (services.length > 0) {
      res.status(200).json({
        message: 'Filtered services retrieved successfully',
        data: services,
      });
    } else {
      res.status(200).json({
        message: 'No services found matching the criteria',
        data: [],
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};




export {
  addServiceById, getServicesByFilter, getServicesByPartnerId,
 updateService, deleteService
}