import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EventAttributes {
  id: number;
  title: string;
  description: string;
  date?: Date | null;
  thumbnail_image_url?: string | null;
  meeting_url?: string | null;
  published: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface EventCreationAttributes extends Optional<
  EventAttributes,
  'id' | 'date' | 'thumbnail_image_url' | 'meeting_url' | 'published'
> {}

class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public date?: Date | null;
  public thumbnail_image_url?: string | null;
  public meeting_url?: string | null;
  public published!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    thumbnail_image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    meeting_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'events',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Event;
