
export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  BENGALI = 'bn',
  TELUGU = 'te',
  MARATHI = 'mr',
  TAMIL = 'ta',
  GUJARATI = 'gu',
  URDU = 'ur',
  KANNADA = 'kn',
  ODIA = 'or',
  MALAYALAM = 'ml',
  PUNJABI = 'pa',
  ASSAMESE = 'as',
  MAITHILI = 'mai',
  SANTALI = 'sat',
  KASHMIRI = 'ks',
  NEPALI = 'ne',
  SINDHI = 'sd',
  KONKANI = 'kok',
  DOGRI = 'doi',
  MANIPURI = 'mni',
  BODO = 'brx',
  BHOJPURI = 'bho',
  MARWARI = 'mwr',
  CHHATTISGARHI = 'hne',
  HARYANVI = 'bgc'
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  [Language.ENGLISH]: 'English',
  [Language.HINDI]: 'हिन्दी (Hindi)',
  [Language.BENGALI]: 'বাংলা (Bengali)',
  [Language.TELUGU]: 'తెలుగు (Telugu)',
  [Language.MARATHI]: 'मরাठी (Marathi)',
  [Language.TAMIL]: 'தமிழ் (Tamil)',
  [Language.GUJARATI]: 'ગુજરાતી (Gujarati)',
  [Language.URDU]: 'اردو (Urdu)',
  [Language.KANNADA]: 'ಕನ್ನಡ (Kannada)',
  [Language.ODIA]: 'ଓଡ଼ିଆ (Odia)',
  [Language.MALAYALAM]: 'മലയാളം (Malayalam)',
  [Language.PUNJABI]: 'ਪੰਜਾਬੀ (Punjabi)',
  [Language.ASSAMESE]: 'অসমীয়া (Assamese)',
  [Language.MAITHILI]: 'मैथिली (Maithili)',
  [Language.SANTALI]: 'Santali',
  [Language.KASHMIRI]: 'कॉशুর (Kashmiri)',
  [Language.NEPALI]: 'नेपाली (Nepali)',
  [Language.SINDHI]: 'سنڌي (Sindhi)',
  [Language.KONKANI]: 'कोंकणी (Konkani)',
  [Language.DOGRI]: 'डोगरी (Dogri)',
  [Language.MANIPURI]: 'ꯃꯩꯇꯩꯂꯣꯟ (Manipuri)',
  [Language.BODO]: 'बड़ो (Bodo)',
  [Language.BHOJPURI]: 'भोजपुरी (Bhojpuri)',
  [Language.MARWARI]: 'मारवाड़ी (Marwari)',
  [Language.CHHATTISGARHI]: 'छत्तीसगढ़ी (Chhattisgarhi)',
  [Language.HARYANVI]: 'हरियाણવી (Haryanvi)'
};

export interface Scheme {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  documentsRequired: string[];
}

export interface Grievance {
  id: string;
  subject: string;
  department: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  date: string;
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'ALERT';
  timestamp: Date;
  isRead: boolean;
  link?: string;
}

export interface GovDocument {
  id: string;
  name: string;
  category: string;
  procedure: string;
  eligibility: string;
  benefits: string;
  link: string;
  helpline?: string;
}

export interface HealthCamp {
  id: string;
  title: string;
  location: string;
  city: string;
  date: string;
  time: string;
  description: string;
}

export interface Helpline {
  id: string;
  title: string;
  number: string;
  category: 'Farmers' | 'Students' | 'Medical' | 'Highway' | 'Senior Citizen' | 'Women & Child' | 'Police' | 'Railway' | 'Disaster' | 'Cyber' | 'Utility' | 'Tourism';
  description: string;
  procedure: string;
}

export interface User {
  phoneNumber: string;
  name: string;
  dob: string;
  email?: string;
  isAuthenticated: boolean;
}
