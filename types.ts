
export enum Category {
  GENERAL = 'General Notice',
  GOVERNMENT = 'Government Notices',
  NON_GOVERNMENT = 'Non-Government',
  RESULTS = 'Results',
  VACCINE = 'Vaccine/Public Health',
  PDFS = 'PDF Resources',
  ARTICLES = 'Articles & Tips',
  NEWS = 'Flash News',
  BLOG = 'Portal Blog',
  NOTES = 'Study Notes',
  VACANCY = 'Job Vacancies'
}

export interface Post {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: Category | string;
  date: string;
  imageUrl?: string;
  pdfUrl?: string;
  author: string;
  isImportant?: boolean;
  isLatest?: boolean;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
}
