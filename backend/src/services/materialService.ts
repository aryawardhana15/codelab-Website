import Material from '../models/Material';
import MaterialProgress from '../models/MaterialProgress';
import Course from '../models/Course';
import sequelize from '../config/database';
import { addXP, updateMissionProgress } from './gamificationService';

interface CreateMaterialInput {
  course_id: number;
  title: string;
  description?: string;
  content?: string;
  video_url?: string;
  file_url?: string;
  order_index: number;
  is_locked?: boolean;
  lock_password?: string;
}

interface UpdateMaterialInput {
  title?: string;
  description?: string;
  content?: string;
  video_url?: string;
  file_url?: string;
  order_index?: number;
  is_locked?: boolean;
  lock_password?: string;
}

// Check if mentor owns the course
const checkMentorOwnership = async (courseId: number, mentorId: number) => {
  const course = await Course.findByPk(courseId);

  if (!course) {
    throw new Error('Kursus tidak ditemukan');
  }

  if (course.mentor_id !== mentorId) {
    throw new Error('Anda tidak memiliki akses ke kursus ini');
  }

  return course;
};

export const createMaterial = async (input: CreateMaterialInput, mentorId: number) => {
  // Check ownership
  await checkMentorOwnership(input.course_id, mentorId);

  const material = await Material.create(input);
  return material;
};

export const getMaterialsByCourse = async (courseId: number, userId?: number) => {
  const materials = await Material.findAll({
    where: { course_id: courseId },
    order: [['order_index', 'ASC']]
  });

  // Check if requesting user is the mentor (to decide whether to show content of locked materials)
  let isMentor = false;
  if (userId) {
    const course = await Course.findByPk(courseId);
    if (course && course.mentor_id === userId) {
      isMentor = true;
    }
  }

  // Helper to process material visibility
  const processMaterial = (material: any, overrides: any = {}) => {
    const json = material.toJSON ? material.toJSON() : material;
    const { lock_password, ...rest } = json;

    // If locked and not mentor, mask content
    if (rest.is_locked && !isMentor) {
      return {
        ...rest,
        ...overrides,
        content: null,
        video_url: null,
        file_url: null
      };
    }

    return { ...rest, ...overrides };
  };

  // If user is provided, get progress for each material
  if (userId) {
    const materialsWithProgress = await Promise.all(
      materials.map(async (material) => {
        const progress = await MaterialProgress.findOne({
          where: {
            user_id: userId,
            material_id: material.id
          }
        });

        return processMaterial(material, {
          is_completed: progress?.is_completed || false,
          completed_at: progress?.completed_at || null
        });
      })
    );

    return materialsWithProgress;
  }

  return materials.map(m => processMaterial(m));
};

export const getMaterialById = async (materialId: number, userId?: number, password?: string) => {
  const material = await Material.findByPk(materialId);

  if (!material) {
    throw new Error('Materi tidak ditemukan');
  }

  // Get progress if user provided
  let progress = null;
  if (userId) {
    progress = await MaterialProgress.findOne({
      where: {
        user_id: userId,
        material_id: materialId
      }
    });
  }

  const materialJson = material.toJSON();

  // Check if requesting user is the mentor (owner)
  let isMentor = false;
  if (userId) {
    const course = await Course.findByPk(material.course_id);
    if (course && course.mentor_id === userId) {
      isMentor = true;
    }
  }

  // If mentor, return everything including password
  if (isMentor) {
    return {
      ...materialJson,
      is_completed: false, // Mentor doesn't track progress really
      completed_at: null
    };
  }

  // Check locking logic
  // If user is accessing it, we should check ownership or role, but here we just check password for locking
  // Ideally we should bypass lock for the course mentor. But `userId` here is generic.
  // Let's assume for now if it's locked, we require password unless we verify mentor ownership (which is expensive here without more context).
  // But wait, the frontend student view sends the password.

  // Logic: If locked AND password does not match -> Hide content
  if (material.is_locked) {
    if (material.lock_password && material.lock_password !== password) {
      // Return limited data
      return {
        id: material.id,
        course_id: material.course_id,
        title: material.title,
        description: material.description,
        order_index: material.order_index,
        is_locked: true,
        is_completed: progress?.is_completed || false,
        completed_at: progress?.completed_at || null,
        // Content masked
        content: null,
        video_url: null,
        file_url: null
      };
    }
  }

  // If unlocked or password match, return full data
  // But strictly exclude lock_password from response unless needed (e.g. for mentor edit)
  // For 'learn' page, we don't need the password back.
  // For 'edit' page, we might.
  // Let's keep it safe: Don't return lock_password here typically. 
  // But wait, the "Edit" page uses this too? If so, the mentor needs to see the password.
  // We can add a flag `isMentor` or similar, but for now let's just return everything if unlocked/matched.
  // Be careful: if I learn the course, and I input the password, I get the content. Do I get the password back? 
  // Better not to send `lock_password` back to student.

  const { lock_password, ...rest } = materialJson;
  return {
    ...rest,
    is_locked: false, // Return as unlocked since password matched
    is_completed: progress?.is_completed || false,
    completed_at: progress?.completed_at || null
  };
};

export const updateMaterial = async (
  materialId: number,
  mentorId: number,
  input: UpdateMaterialInput
) => {
  const material = await Material.findByPk(materialId);

  if (!material) {
    throw new Error('Materi tidak ditemukan');
  }

  // Check ownership
  await checkMentorOwnership(material.course_id, mentorId);

  await material.update(input);
  return material;
};

export const deleteMaterial = async (materialId: number, mentorId: number) => {
  const material = await Material.findByPk(materialId);

  if (!material) {
    throw new Error('Materi tidak ditemukan');
  }

  // Check ownership
  await checkMentorOwnership(material.course_id, mentorId);

  await material.destroy();
  return { message: 'Materi berhasil dihapus' };
};

export const markMaterialComplete = async (materialId: number, userId: number) => {
  const material = await Material.findByPk(materialId);

  if (!material) {
    throw new Error('Materi tidak ditemukan');
  }

  // Check if user is enrolled in the course
  const [enrollmentResult] = await sequelize.query(
    'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
    { replacements: [userId, material.course_id] }
  );

  if (!enrollmentResult || (enrollmentResult as any[]).length === 0) {
    throw new Error('Anda belum terdaftar di kursus ini');
  }

  // Check if progress already exists
  let progress = await MaterialProgress.findOne({
    where: {
      user_id: userId,
      material_id: materialId
    }
  });

  if (progress) {
    // Update existing progress
    await progress.update({
      is_completed: true,
      completed_at: new Date()
    });
  } else {
    // Create new progress
    progress = await MaterialProgress.create({
      user_id: userId,
      material_id: materialId,
      is_completed: true,
      completed_at: new Date()
    });
  }

  // Update enrollment progress
  await updateEnrollmentProgress(userId, material.course_id);

  // Give XP reward (10 XP for completing material)
  await addXP(userId, 10, 'complete_material');

  // Update mission progress
  await updateMissionProgress(userId, 'complete_material', 1);

  // Check badges
  const { checkAndAwardBadges } = await import('./gamificationService');
  await checkAndAwardBadges(userId);

  return progress;
};

// Helper function to update enrollment progress
const updateEnrollmentProgress = async (userId: number, courseId: number) => {
  // Get total materials count
  const [totalResult] = await sequelize.query(
    'SELECT COUNT(*) as total FROM materials WHERE course_id = ?',
    { replacements: [courseId] }
  );
  const totalMaterials = (totalResult as any)[0].total;

  // Get completed materials count
  const [completedResult] = await sequelize.query(
    `SELECT COUNT(*) as total FROM material_progress mp
     JOIN materials m ON mp.material_id = m.id
     WHERE mp.user_id = ? AND m.course_id = ? AND mp.is_completed = TRUE`,
    { replacements: [userId, courseId] }
  );
  const completedMaterials = (completedResult as any)[0].total;

  // Calculate progress percentage
  const progress = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0;

  // Update enrollment
  await sequelize.query(
    'UPDATE enrollments SET progress = ? WHERE user_id = ? AND course_id = ?',
    { replacements: [progress, userId, courseId] }
  );

  // If all materials completed, mark course as completed
  if (progress === 100) {
    await sequelize.query(
      'UPDATE enrollments SET completed_at = NOW() WHERE user_id = ? AND course_id = ? AND completed_at IS NULL',
      { replacements: [userId, courseId] }
    );

    // Give bonus XP for completing course (50 XP)
    await addXP(userId, 50, 'complete_course');

    // Update mission progress for course completion
    await updateMissionProgress(userId, 'complete_course', 1);

    // Check and award badges
    const { checkAndAwardBadges } = await import('./gamificationService');
    await checkAndAwardBadges(userId);
  }
};


export const reorderMaterials = async (
  courseId: number,
  mentorId: number,
  materialOrders: { id: number; order_index: number }[]
) => {
  // Check ownership
  await checkMentorOwnership(courseId, mentorId);

  // Update order for each material
  await Promise.all(
    materialOrders.map(async (order) => {
      await Material.update(
        { order_index: order.order_index },
        { where: { id: order.id, course_id: courseId } }
      );
    })
  );

  return { message: 'Urutan materi berhasil diupdate' };
};

