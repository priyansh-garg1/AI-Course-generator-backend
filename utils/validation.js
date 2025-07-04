export const validateCourseData = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Course name is required';
    } else if (data.name.trim().length < 3) {
      errors.name = 'Course name must be at least 3 characters long';
    } else if (data.name.trim().length > 100) {
      errors.name = 'Course name must be less than 100 characters';
    }
  }

  if (!isUpdate || data.description !== undefined) {
    if (!data.description || data.description.trim().length === 0) {
      errors.description = 'Course description is required';
    } else if (data.description.trim().length < 10) {
      errors.description = 'Course description must be at least 10 characters long';
    } else if (data.description.trim().length > 1000) {
      errors.description = 'Course description must be less than 1000 characters';
    }
  }

  if (!isUpdate || data.chapters !== undefined) {
    if (!data.chapters || isNaN(data.chapters)) {
      errors.chapters = 'Number of chapters is required';
    } else if (data.chapters < 1 || data.chapters > 20) {
      errors.chapters = 'Number of chapters must be between 1 and 20';
    }
  }

  if (!isUpdate || data.category !== undefined) {
    const validCategories = ['Technology', 'Programming', 'Business', 'Marketing', 'Design', 'Health', 'Education', 'Science', 'Arts', 'Language'];
    if (!data.category || !validCategories.includes(data.category)) {
      errors.category = 'Valid category is required';
    }
  }

  if (!isUpdate || data.difficulty !== undefined) {
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    if (!data.difficulty || !validDifficulties.includes(data.difficulty)) {
      errors.difficulty = 'Valid difficulty level is required';
    }
  }

  if (data.includeVideos !== undefined && typeof data.includeVideos !== 'boolean') {
    errors.includeVideos = 'Include videos must be a boolean value';
  }

  if (data.generatedChapters && Array.isArray(data.generatedChapters)) {
    data.generatedChapters.forEach((chapter, index) => {
      if (!chapter.title || chapter.title.trim().length === 0) {
        errors[`generatedChapters.${index}.title`] = 'Chapter title is required';
      }
      if (!chapter.description || chapter.description.trim().length === 0) {
        errors[`generatedChapters.${index}.description`] = 'Chapter description is required';
      }
      if (chapter.objectives && !Array.isArray(chapter.objectives)) {
        errors[`generatedChapters.${index}.objectives`] = 'Chapter objectives must be an array';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePaginationParams = (page, limit) => {
  const errors = {};

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    errors.page = 'Page must be a positive number';
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    errors.limit = 'Limit must be between 1 and 100';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 