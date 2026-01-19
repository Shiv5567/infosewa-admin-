
import { Post, Category } from './types';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Loksewa Aayog Kharidar Final Result 2080/81 Published',
    description: 'The Public Service Commission (Loksewa Aayog) central office has officially released the merit list and final results for the Kharidar (Non-Technical) posts. Candidates can check their status using the PDF viewer below.',
    category: Category.RESULTS,
    date: 'Oct 25, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
    pdfUrl: 'https://res.cloudinary.com/demo/image/upload/v1651572140/sample_pdf.pdf',
    author: 'Admin',
    isImportant: true
  },
  {
    id: '2',
    title: 'Urgent: Myadi Police Recruitment 2081 Open for Applications',
    description: 'The Ministry of Home Affairs has announced vacancies for 100,000+ Myadi Police (Temporary Police) personnel for the upcoming local elections. Eligibility criteria include citizenship of Nepal and basic physical fitness.',
    category: Category.GOVERNMENT,
    date: 'Oct 24, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800',
    author: 'InfoSewa News'
  },
  {
    id: '3',
    title: 'Tribhuvan University (TU) BBS 4th Year Exam Schedule Out',
    description: 'Exam Controller Office, Balkhu has released the detailed routine for BBS 4th Year regular and partial examinations starting from next month. View the full routine PDF inside.',
    category: Category.NON_GOVERNMENT,
    date: 'Oct 23, 2023',
    pdfUrl: 'https://res.cloudinary.com/demo/image/upload/v1651572140/sample_pdf.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1523050335192-ce1de907362b?auto=format&fit=crop&q=80&w=800',
    author: 'Academic Desk'
  },
  {
    id: '4',
    title: 'Top 10 Tips to Crack Loksewa Exams in First Attempt',
    description: 'Expert guidance on how to structure your preparation, which books to follow, and time management strategies during the Public Service Commission exams.',
    category: Category.ARTICLES,
    date: 'Oct 22, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    content: 'Full long-form guide content...',
    author: 'Bharat Mani'
  },
  {
    id: '5',
    title: 'COVID-19 Booster Vaccination Drive in Kathmandu Valley',
    description: 'The Ministry of Health and Population is organizing a week-long booster dose campaign across all wards in Kathmandu, Lalitpur, and Bhaktapur. Bring your vaccination card.',
    category: Category.VACCINE,
    date: 'Oct 21, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1618961734760-466979ce35b0?auto=format&fit=crop&q=80&w=800',
    author: 'Health Desk'
  }
];

export const APP_SEO = {
  defaultTitle: 'InfoSewa - Nepal\'s #1 Notices & Results Portal',
  defaultDescription: 'Verified updates on Loksewa, Myadi Police, TU/PU Results, and Career articles in Nepal.',
  defaultKeywords: 'myadi police result, loksewa notice, university exam result, college notice, scholarship nepal, nepali notices'
};
