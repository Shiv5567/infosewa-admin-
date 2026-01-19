
export enum Category {
  GOVERNMENT = 'Government Notices',
  NON_GOVERNMENT = 'Non-Government',
  RESULTS = 'Results',
  VACCINE = 'Vaccine/Public Health',
  PDFS = 'PDF Resources',
  ARTICLES = 'Articles & Tips'
}

export interface Post {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: Category;
  date: string;
  imageUrl?: string;
  pdfUrl?: string;
  author: string;
  isImportant?: boolean;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
}
