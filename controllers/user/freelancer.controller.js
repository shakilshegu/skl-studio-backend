import Freelancer from '../../models/partner/freelancer.model.js';
import Equipment from "../../models/partner/equipment.model.js";
import Helper from "../../models/partner/helper.model.js";
import Package from "../../models/partner/package.model.js";
import Service from "../../models/partner/service.model.js";


const fetchFreelancerById = async (req, res) => {
    try {
      const { id } = req.params;
      
      const freelancer = await Freelancer.findOne({ _id: id });
      
      if (!freelancer) {
        return res.status(404).json({ message: "Freelancer not found" });
      }
      
      return res.json({ success: true, freelancer });
    } catch (error) {
      console.error("Error fetching freelancer:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  const fetchAllFreelancers = async (req, res) => {
    try {
      const freelancers = await Freelancer.find().populate('categories')
      
      if (!freelancers) {
        return res.status(404).json({ message: "Freelancers not found" });
      }
      
      return res.json({ success: true, freelancers });
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };

const fetchEquipmentsByFreelancerId = async (req, res) => {
    try {
      const { freelancerId } = req.params;
      
      const equipments = await Equipment.find({ 
        freelancerId, 
        isDeleted: false 
      });
      
      return res.json({ success: true, equipments });
    } catch (error) {
      console.error("Error fetching equipments:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  const fetchPackagesByFreelancerId = async (req, res) => {
    try {
      const { freelancerId } = req.params;
      
      const packages = await Package.find({ 
        freelancerId, 
        isDeleted: false 
      });
      
      return res.json({ success: true, packages });
    } catch (error) {
      console.error("Error fetching packages:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  const fetchServicesByFreelancerId = async (req, res) => {
    try {
      const { freelancerId } = req.params;
      
      const services = await Service.find({ 
        freelancerId, 
        isDeleted: false 
      });
      
      return res.json({ success: true, services });
    } catch (error) {
      console.error("Error fetching services:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  const fetchHelpersByFreelancerId = async (req, res) => {
    try {
      const { freelancerId } = req.params;
      
      const helpers = await Helper.find({ 
        freelancerId, 
        isDeleted: false 
      });
      
      return res.json({ success: true, helpers });
    } catch (error) {
      console.error("Error fetching helpers:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };



  export {
    fetchFreelancerById,
    fetchAllFreelancers,
    fetchEquipmentsByFreelancerId,
    fetchPackagesByFreelancerId,
    fetchServicesByFreelancerId,
    fetchHelpersByFreelancerId
  };