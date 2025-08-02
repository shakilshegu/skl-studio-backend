// utils/roleUtils.js
import partnerstudios from "../models/partner/Studio.model.js";
import FreelancerModel from "../models/partner/freelancer.model.js";

export const isStudio = (role) => role === "studio";
export const isFreelancer = (role) => role === "freelancer";



export const getEntityId = async (req) => {
  const userId = req.user._id;
  
console.log(userId,"uid");


  if (req.isStudio) {
    const studio = await partnerstudios.findOne({ "owner.userId": userId });
    
    if (!studio) {
      throw new Error("Studio not found");
    }
    return { entityId: studio._id, entityType: "studio" };
  } 

  if (req.isFreelancer) {
    const freelancer = await FreelancerModel.findOne({ user: userId });
    if (!freelancer) {
      throw new Error("Freelancer not found");
    }
    return { entityId: freelancer._id, entityType: "freelancer" };
  }

  throw new Error("Invalid role");
};
