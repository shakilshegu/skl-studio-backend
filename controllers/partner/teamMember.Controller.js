import TeamMember from "../../models/partner/teamMember.model.js";
import { uploadFile } from "../../utils/mediaHelper.js";

// GET all team members
export const getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team members' });
  }
};

// GET single team member by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findById(id);

    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving team member' });
  }
};

// CREATE new team member
export const createTeamMember = async (req, res) => {
  try {


    const { name, role, mobile, email, description } = req.body;

    const file = req.file;
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Photo required",
      });
    }
    // const userId = req.user._id;

    const studioId ="67b9a7155244523f8dfccca5"

    // const studio = await partnerStudios.findOne({ "owner.userId": userId });
    // if (!studio) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Studio not found.",
    //   });
    // }
    const photoUrl = await uploadFile(file, `team-member/${studioId}/${file.filename}`);
    // const photoUrl = await uploadFile(file, `team-member/${studio._id}/${file.filename}`);

    const newMember = new TeamMember({
    studioId,
      name,
      role,
      mobile,
      email,
      description,
      image:photoUrl
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create team member' });
  }
};

// UPDATE team member
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedMember = await TeamMember.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updatedMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update team member' });
  }
};

// DELETE team member
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TeamMember.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.status(200).json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete team member' });
  }
};
