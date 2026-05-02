import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MaterialAttributes {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  content?: string;
  video_url?: string;
  file_url?: string;
  order_index: number;
  is_locked?: boolean;
  lock_password?: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface MaterialCreationAttributes extends Optional<
  MaterialAttributes,
  'id' | 'is_deleted'
> {}

class Material
  extends Model<MaterialAttributes, MaterialCreationAttributes>
  implements MaterialAttributes
{
  public id!: number;
  public course_id!: number;
  public title!: string;
  public description?: string;
  public content?: string;
  public video_url?: string;
  public file_url?: string;
  public order_index!: number;
  public is_locked!: boolean;
  public lock_password?: string;
  public is_deleted!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Material.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    video_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    file_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lock_password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'materials',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Material;
