

import express from 'express';
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../../controllers/partner/teamMember.Controller.js';
import { protect, upload } from '../../middleware/auth.js';

const router = express.Router();


router.get('/', getAllTeamMembers);

router.post('/', upload.single('photo'), createTeamMember);
// router.post('/', upload.single('photo'),protect, createTeamMember);

router.put('/:id', upload.single('photo'), updateTeamMember);

router.delete('/:id', deleteTeamMember);

export default router;
