import { Op, literal } from 'sequelize';
import Event from '../models/Event';

interface CreateEventInput {
  title: string;
  description: string;
  date?: string | Date | null;
  thumbnail_image_url?: string | null;
  meeting_url?: string | null;
  published: boolean;
}

interface UpdateEventInput {
  title?: string;
  description?: string;
  date?: string | Date | null;
  thumbnail_image_url?: string | null;
  meeting_url?: string | null;
  published?: boolean;
}

export const createEvent = async (input: CreateEventInput) => {
  const event = await Event.create({
    title: input.title,
    description: input.description,
    date: input.date ? new Date(input.date) : null,
    thumbnail_image_url: input.thumbnail_image_url ?? null,
    meeting_url: input.meeting_url ?? null,
    published: input.published,
  });
  return event;
};

export const updateEvent = async (eventId: number, input: UpdateEventInput) => {
  const event = await Event.findByPk(eventId);

  if (!event) {
    throw new Error('Event tidak ditemukan');
  }

  const payload: any = {};
  if (input.title !== undefined) payload.title = input.title;
  if (input.description !== undefined) payload.description = input.description;
  if (input.date !== undefined) payload.date = input.date ? new Date(input.date) : null;
  if (input.thumbnail_image_url !== undefined) payload.thumbnail_image_url = input.thumbnail_image_url;
  if (input.meeting_url !== undefined) payload.meeting_url = input.meeting_url;
  if (input.published !== undefined) payload.published = input.published;

  await event.update(payload);
  return event;
};

export const setEventPublished = async (eventId: number, published: boolean) => {
  const event = await Event.findByPk(eventId);

  if (!event) {
    throw new Error('Event tidak ditemukan');
  }

  await event.update({ published });
  return event;
};

export const deleteEvent = async (eventId: number) => {
  const event = await Event.findByPk(eventId);

  if (!event) {
    throw new Error('Event tidak ditemukan');
  }

  await event.destroy();
  return { message: 'Event berhasil dihapus' };
};

export const getAllEvents = async (filters: {
  page?: number;
  limit?: number;
  onlyPublished?: boolean;
}) => {
  const { page = 1, limit = 20, onlyPublished = false } = filters;
  const offset = (page - 1) * limit;

  const { rows, count } = await Event.findAndCountAll({
    where: onlyPublished ? { published: true } : undefined,
    order: [
      [
        literal(`CASE WHEN "date" IS NOT NULL AND "date" >= NOW() THEN 0 ELSE 1 END`),
        'ASC',
      ],
      ['date', 'ASC'],
      ['created_at', 'DESC'],
    ],
    limit,
    offset,
  });

  return {
    events: rows,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalEvents: count,
      limit,
    },
  };
};

export const getEventById = async (eventId: number) => {
  const event = await Event.findByPk(eventId);

  if (!event) {
    throw new Error('Event tidak ditemukan');
  }

  return event;
};

export const getNearestEvent = async () => {
  const now = new Date();

  const upcoming = await Event.findOne({
    where: {
      published: true,
      date: { [Op.gte]: now },
    },
    order: [['date', 'ASC']],
  });

  if (upcoming) return upcoming;

  // Fallback: newest published event by created_at
  const newest = await Event.findOne({
    where: { published: true },
    order: [['created_at', 'DESC']],
  });

  return newest;
};
