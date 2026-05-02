import Contact from '../models/Contact';
import User from '../models/User';
import sequelize from '../config/database';

interface CreateContactInput {
    full_name: string;
    email: string;
    subject: string;
    message: string;
}

export const createContact = async (input: CreateContactInput) => {
    const { full_name, email, subject, message } = input;

    const existingUser = await User.findOne({ where: { email } });

    const contact = await Contact.create({
        full_name,
        email,
        subject,
        message,
        user_id: existingUser ? existingUser.id : null,
    });

    return contact;
};

export const getAllContacts = async (filters: {
    search?: string;
    page?: number;
    limit?: number;
}) => {
    const { search, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    let whereConditions = '1=1';
    const replacements: any[] = [];

    if (search) {
        whereConditions +=
            ' AND (c.full_name LIKE ? OR c.email LIKE ? OR c.subject LIKE ?)';
        const searchPattern = `%${search}%`;
        replacements.push(searchPattern, searchPattern, searchPattern);
    }

    const [contacts] = await sequelize.query(
        `SELECT
      c.*,
      u.name as user_name,
      u.role as user_role,
      u.photo_url as user_photo_url
    FROM contacts c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE ${whereConditions}
    ORDER BY c.created_at DESC
    LIMIT ? OFFSET ?`,
        { replacements: [...replacements, limit, offset] },
    );

    const [countResult] = await sequelize.query(
        `SELECT COUNT(*) as total FROM contacts c WHERE ${whereConditions}`,
        { replacements },
    );
    const totalContacts = (countResult as any)[0].total;

    return {
        contacts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalContacts / limit),
            totalContacts,
            limit,
        },
    };
};
