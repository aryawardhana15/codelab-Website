import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import * as eventController from '../controllers/eventController';

const router = Router();

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/nearest', eventController.getNearestEvent);

// Admin: list all events including unpublished
router.get('/admin/all', authenticate, authorize('admin'), eventController.getAllEventsAdmin);

router.get('/:id', eventController.getEventById);

// Admin-only routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('title').trim().notEmpty().withMessage('Judul event wajib diisi'),
    body('description').trim().notEmpty().withMessage('Deskripsi event wajib diisi'),
    body('date').optional({ nullable: true }).isISO8601().withMessage('Format tanggal tidak valid'),
    body('thumbnail_image_url').optional({ nullable: true }).isURL().withMessage('Thumbnail URL tidak valid'),
    body('meeting_url').optional({ nullable: true }).isURL().withMessage('Meeting URL tidak valid'),
    body('published').isBoolean().withMessage('Published wajib diisi (boolean)'),
  ],
  eventController.createEvent,
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    body('title').optional().trim().notEmpty().withMessage('Judul tidak boleh kosong'),
    body('description').optional().trim().notEmpty().withMessage('Deskripsi tidak boleh kosong'),
    body('date').optional({ nullable: true }).isISO8601().withMessage('Format tanggal tidak valid'),
    body('thumbnail_image_url').optional({ nullable: true }).isURL().withMessage('Thumbnail URL tidak valid'),
    body('meeting_url').optional({ nullable: true }).isURL().withMessage('Meeting URL tidak valid'),
    body('published').optional().isBoolean().withMessage('Published harus boolean'),
  ],
  eventController.updateEvent,
);

router.patch(
  '/:id/published',
  authenticate,
  authorize('admin'),
  [body('published').isBoolean().withMessage('Published wajib diisi (boolean)')],
  eventController.setEventPublished,
);

router.delete('/:id', authenticate, authorize('admin'), eventController.deleteEvent);

export default router;
