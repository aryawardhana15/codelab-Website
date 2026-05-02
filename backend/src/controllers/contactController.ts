import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as contactService from '../services/contactService';

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
      return;
    }

    const { full_name, email, subject, message } = req.body;
    const contact = await contactService.createContact({
      full_name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Pesan berhasil dikirim',
      data: contact
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Gagal mengirim pesan'
    });
  }
};
