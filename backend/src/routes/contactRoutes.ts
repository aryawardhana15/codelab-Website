import { Router } from 'express';
import { body } from 'express-validator';
import * as contactController from '../controllers/contactController';

const router = Router();

router.post(
  '/',
  [
    body('full_name').trim().notEmpty().withMessage('Nama lengkap wajib diisi'),
    body('email').isEmail().withMessage('Email tidak valid'),
    body('subject').trim().notEmpty().withMessage('Subjek wajib diisi'),
    body('message').trim().notEmpty().withMessage('Pesan wajib diisi'),
  ],
  contactController.createContact,
);

export default router;
