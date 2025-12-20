export interface ValidationError {
  field: string;
  message: string;
}

export interface PortfolioValidation {
  title: string;
  category: string;
  year: string;
}

export interface ResumeValidation {
  title: string;
  content: string;
}

export const validatePortfolioItem = (item: Partial<PortfolioValidation>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!item.title?.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  }

  if (!item.category?.trim()) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  if (!item.year?.trim()) {
    errors.push({ field: 'year', message: 'Year is required' });
  }

  return errors;
};

export const validateResumeItem = (item: Partial<ResumeValidation>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!item.title?.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  }

  if (!item.content?.trim()) {
    errors.push({ field: 'content', message: 'Content is required' });
  }

  return errors;
};
