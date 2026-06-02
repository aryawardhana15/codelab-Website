import { Request, Response } from "express";
import multer from "multer";
import { validationResult } from "express-validator";
import * as eventService from "../services/eventService";

export const upload = multer({ storage: multer.memoryStorage() });

export const createEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
      return;
    }

    let thumbnail_image_url: string | null = null;
    if (req.file) {
      thumbnail_image_url = await eventService.uploadThumbnail(req.file);
    }

    const event = await eventService.createEvent({
      ...req.body,
      thumbnail_image_url,
    });

    res.status(201).json({
      success: true,
      message: "Event berhasil dibuat",
      data: event,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Gagal membuat event",
    });
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
      return;
    }

    const eventId = parseInt(req.params.id);

    let thumbnail_image_url: string | undefined;
    if (req.file) {
      const existing = await eventService.getEventById(eventId);
      if (existing.thumbnail_image_url) {
        await eventService.deleteThumbnail(existing.thumbnail_image_url);
      }
      thumbnail_image_url = await eventService.uploadThumbnail(req.file);
    }

    console.log(thumbnail_image_url);

    const event = await eventService.updateEvent(eventId, {
      ...req.body,
      ...(thumbnail_image_url !== undefined && { thumbnail_image_url }),
    });

    res.status(200).json({
      success: true,
      message: "Event berhasil diupdate",
      data: event,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengupdate event",
    });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id);

    const existing = await eventService.getEventById(eventId);
    if (existing.thumbnail_image_url) {
      await eventService.deleteThumbnail(existing.thumbnail_image_url);
    }

    await eventService.deleteEvent(eventId);

    res.status(200).json({
      success: true,
      message: "Event berhasil dihapus",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Gagal menghapus event",
    });
  }
};

export const getAllEvents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await eventService.getAllEvents({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      onlyPublished: true,
    });

    res.status(200).json({
      success: true,
      message: "Events retrieved",
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get events",
    });
  }
};

export const getAllEventsAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await eventService.getAllEvents({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      onlyPublished: false,
    });

    res.status(200).json({
      success: true,
      message: "Events retrieved",
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get events",
    });
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await eventService.getEventById(eventId);

    res.status(200).json({
      success: true,
      message: "Event retrieved",
      data: event,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Event not found",
    });
  }
};

export const setEventPublished = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
      return;
    }

    const eventId = parseInt(req.params.id);
    const { published } = req.body;
    const event = await eventService.setEventPublished(eventId, published);

    res.status(200).json({
      success: true,
      message: published
        ? "Event berhasil dipublish"
        : "Event berhasil di-unpublish",
      data: event,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengubah status publish event",
    });
  }
};

export const getNearestEvent = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const event = await eventService.getNearestEvent();

    res.status(200).json({
      success: true,
      message: "Nearest event retrieved",
      data: event,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get nearest event",
    });
  }
};
