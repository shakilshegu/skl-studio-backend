

import TeamMember from "../../models/partner/teamMember.model.js";
import { uploadFile } from "../../utils/media.helper.js";
import { getEntityId } from "../../utils/roleUtils.js";

// GET all team members for authenticated entity
export const getAllTeamMembers = async (req, res) => {
  try {
    const { entityId, entityType } = await getEntityId(req);
    
    const members = await TeamMember.find({ 
      entityId, 
      entityType 
    }).populate('entityId', 'name location');
    
    res.status(200).json({
      success: true,
      data: members,
      count: members.length
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch team members',
      error: error.message 
    });
  }
};

// GET single team member by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const { entityId, entityType } = await getEntityId(req);
    
    const member = await TeamMember.findOne({
      _id: id,
      entityId,
      entityType
    }).populate('entityId', 'name location');

    if (!member) {
      return res.status(404).json({ 
        success: false,
        message: 'Team member not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error retrieving team member:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving team member',
      error: error.message 
    });
  }
};

// CREATE new team member
export const createTeamMember = async (req, res) => {
  try {
    const { entityId, entityType } = await getEntityId(req);
    const { name, role, mobile, email, description } = req.body;

    // Check if file is provided
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Photo required",
      });
    }

    // Check if email already exists
    const existingMember = await TeamMember.findOne({ email });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Team member with this email already exists",
      });
    }

    // Upload photo
    const photoUrl = await uploadFile(file, `team-member/${entityId}/${file.filename}`);

    // Create new team member
    const newMember = new TeamMember({
      entityId,
      entityType,
      name,
      role,
      mobile,
      email,
      description,
      image: photoUrl
    });

    await newMember.save();
    
    // Populate the entity details before sending response
    await newMember.populate('entityId', 'name location');

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: newMember
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Failed to create team member',
      error: error.message 
    });
  }
};

// UPDATE team member
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { entityId, entityType } = await getEntityId(req);
    const updatedData = req.body;

    // Check if team member belongs to the authenticated entity
    const existingMember = await TeamMember.findOne({
      _id: id,
      entityId,
      entityType
    });

    if (!existingMember) {
      return res.status(404).json({ 
        success: false,
        message: 'Team member not found or access denied' 
      });
    }

    // Handle file upload if new image is provided
    if (req.file) {
      const photoUrl = await uploadFile(req.file, `team-member/${entityId}/${req.file.filename}`);
      updatedData.image = photoUrl;
    }

    // Update the team member
    const updatedMember = await TeamMember.findByIdAndUpdate(
      id, 
      { ...updatedData, updatedAt: Date.now() }, 
      {
        new: true,
        runValidators: true
      }
    ).populate('entityId', 'name location');

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: updatedMember
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Failed to update team member',
      error: error.message 
    });
  }
};

// DELETE team member
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id,"iiccdd");
    

    const { entityId, entityType } = await getEntityId(req);

    // Check if team member belongs to the authenticated entity
    const member = await TeamMember.findOne({
      _id: id,
      entityId,
      entityType
    });

    if (!member) {
      return res.status(404).json({ 
        success: false,
        message: 'Team member not found or access denied' 
      });
    }

    // Delete the team member
    await TeamMember.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true,
      message: 'Team member deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete team member',
      error: error.message 
    });
  }
};

// GET team members for assignment (dropdown/select options)
// export const getTeamMembersForAssignment = async (req, res) => {
//   try {
//     const { entityId, entityType } = await getEntityId(req);
    
//     const members = await TeamMember.find({ 
//       entityId, 
//       entityType,
//       isActive: true 
//     }).select('name role email image');
    
//     res.status(200).json({
//       success: true,
//       data: members
//     });
//   } catch (error) {
//     console.error('Error fetching team members for assignment:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to fetch team members',
//       error: error.message 
//     });
//   }
// };