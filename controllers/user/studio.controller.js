import availabilityModel from "../../models/partner/availability.model.js";
import Equipment from "../../models/partner/equipment.model.js";
import Helper from "../../models/partner/helper.model.js";
import Package from "../../models/partner/package.model.js";
import Service from "../../models/partner/service.model.js";
import Studio from "../../models/partner/Studio.model.js";


const fetchStudioById = async (req, res) => {
  try {
    const { id } = req.params;

    const studio = await Studio.findOne({ _id: id, isDeleted: false });

    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }
    return res.json({ success: true, studio });
  } catch (error) {
    console.error("Error fetching studio:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const fetchAllStudio = async (req, res) => {
  try {


    const studios = await Studio.find({ isDeleted: false });

    if (!studios) {
      return res.status(404).json({ message: "Studios not found" });
    }

    return res.json({ success: true, studios });
  } catch (error) {
    console.error("Error fetching studios:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

 const getPartnerAvailability = async (req, res) => {
  try {
    console.log(req.query,"xxxxxxxxxxxxxxx");
    console.log("xxxxxxxxxxxxxxx");
    
    const partnerId = req.params.studioId;
    const { startDate, endDate } = req.query;

    const query = { partnerId };

    // Handle date range
    if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate()
      };
    }

    const availabilityData = await availabilityModel.find(query).sort({ date: 1 });

    console.log(availabilityData,"aaaaaaaaaaa");
    

    // (Insert your formatting logic here...)

    res.status(200).json({
      success: true,
      data: availabilityData // or formatted version
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving availability',
      error: error.message
    });
  }
};


const fetchEquipmentsByStudioId = async (req, res) => {
  try {
    const { studioId } = req.params;
    
    const equipments = await Equipment.find({ 
      studioId, 
      isDeleted: false 
    });
    
    return res.json({ success: true, equipments });
  } catch (error) {
    console.error("Error fetching equipments:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const fetchPackagesByStudioId = async (req, res) => {
  try {
    const { studioId } = req.params;
    
    const packages = await Package.find({ 
      studioId, 
      isDeleted: false 
    }).populate("services").populate("equipments");
    
    return res.json({ success: true, packages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const fetchServicesByStudioId = async (req, res) => {
  try {
    const { studioId } = req.params;
    
    const services = await Service.find({ 
      studioId, 
      isDeleted: false 
    });
    
    return res.json({ success: true, services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const fetchHelpersByStudioId = async (req, res) => {
  try {
    const { studioId } = req.params;
    
    const helpers = await Helper.find({ 
      studioId, 
      isDeleted: false 
    });
    
    return res.json({ success: true, helpers });
  } catch (error) {
    console.error("Error fetching helpers:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




export {
  fetchStudioById,
  fetchAllStudio,
  getPartnerAvailability,
  fetchEquipmentsByStudioId,
  fetchPackagesByStudioId,
  fetchServicesByStudioId,
  fetchHelpersByStudioId
};
