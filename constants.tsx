
import { Scheme, GovDocument, HealthCamp, Helpline } from './types';

export const SCHEMES: Scheme[] = [
  // FARMER SCHEMES
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Agriculture',
    description: 'Direct income support of ₹6,000 per year to all landholding farmer families.',
    benefits: ['₹6,000 per year in 3 installments'],
    eligibility: ['Small and marginal farmers', 'Must own cultivable land'],
    documentsRequired: ['Aadhaar Card', 'Land Records', 'Bank Passbook']
  },
  {
    id: 'pm-fasal-bima',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Agriculture',
    description: 'Crop insurance against non-preventable natural risks.',
    benefits: ['Financial support to farmers suffering crop loss', 'Low premium rates'],
    eligibility: ['Farmers growing notified crops in notified areas'],
    documentsRequired: ['Land Possession Certificate', 'Sowing Certificate']
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    category: 'Agriculture',
    description: 'Timely credit for the comprehensive credit requirements of farmers.',
    benefits: ['Low-interest farm loans', 'ATM enabled debit card'],
    eligibility: ['Individual/Joint farmers', 'Tenant farmers', 'Self Help Groups'],
    documentsRequired: ['Land Document', 'KYC Documents']
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card Scheme',
    category: 'Agriculture',
    description: 'Provides information to farmers on nutrient status of their soil.',
    benefits: ['Soil testing report', 'Advice on fertilizer dosage'],
    eligibility: ['All farmers in the country'],
    documentsRequired: ['Soil Sample', 'Farmer Identity Proof']
  },
  {
    id: 'pmksy',
    name: 'PM Krishi Sinchayee Yojana (PMKSY)',
    category: 'Agriculture',
    description: 'Motto of "Har Khet Ko Pani" - extending coverage of irrigation.',
    benefits: ['Subsidy on micro-irrigation systems', 'Improved water use efficiency'],
    eligibility: ['All farmers having agricultural land'],
    documentsRequired: ['Land Records', 'Aadhaar']
  },
  {
    id: 'pm-pranam',
    name: 'PM-PRANAM',
    category: 'Agriculture',
    description: 'Programme for Restoration, Awareness, Nourishment and Amelioration of Mother Earth to promote alternative fertilizers.',
    benefits: ['Subsidies for organic farming', 'Grants for states reducing chemical fertilizer use'],
    eligibility: ['State governments', 'Farmer cooperatives', 'Individual farmers'],
    documentsRequired: ['Soil Test Report', 'Land Records']
  },

  // HOUSING & BASIC NEEDS
  {
    id: 'pmay-urban',
    name: 'Pradhan Mantri Awas Yojana (Urban)',
    category: 'Housing',
    description: 'Housing for all in urban areas.',
    benefits: ['Subsidized interest on home loans', 'Financial assistance for house construction'],
    eligibility: ['EWS/LIG families', 'Families with no pucca house'],
    documentsRequired: ['Aadhaar', 'Income Certificate', 'Affidavit']
  },
  {
    id: 'pmay-rural',
    name: 'Pradhan Mantri Awas Yojana (Gramin)',
    category: 'Housing',
    description: 'Provision of pucca houses with basic amenities to rural homeless.',
    benefits: ['Financial grant of ₹1.2 Lakh (Plains) or ₹1.3 Lakh (Hilly)'],
    eligibility: ['Rural households in SECC 2011 data', 'Homeless'],
    documentsRequired: ['Aadhaar', 'Bank Details', 'Job Card Number']
  },
  {
    id: 'swachh-bharat',
    name: 'Swachh Bharat Mission (Grameen)',
    category: 'Sanitation',
    description: 'Promoting sanitation and eliminating open defecation.',
    benefits: ['₹12,000 for toilet construction'],
    eligibility: ['Rural households without toilets'],
    documentsRequired: ['Aadhaar', 'Bank Passbook']
  },
  {
    id: 'jal-jeevan',
    name: 'Jal Jeevan Mission',
    category: 'Utility',
    description: 'Har Ghar Jal - providing functional tap connections to rural homes.',
    benefits: ['Regular and long-term supply of potable water'],
    eligibility: ['All rural households'],
    documentsRequired: ['Address Proof']
  },
  {
    id: 'pm-surya-ghar',
    name: 'PM Surya Ghar: Muft Bijli Yojana',
    category: 'Utility',
    description: 'Scheme to provide free electricity to households by installing rooftop solar systems.',
    benefits: ['Subsidy up to ₹78,000 for 3kW system', 'Free electricity up to 300 units monthly'],
    eligibility: ['Indian citizens with own roof/house', 'Valid electricity connection'],
    documentsRequired: ['Electricity Bill', 'Aadhaar Card', 'Rooftop Photo']
  },

  // HEALTH & INSURANCE
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat PMJAY',
    category: 'Health',
    description: 'World\'s largest health insurance scheme.',
    benefits: ['₹5 lakh health cover per family per year'],
    eligibility: ['SECC 2011 beneficiaries', 'BPL Families'],
    documentsRequired: ['Aadhaar', 'Ration Card']
  },
  {
    id: 'janani-suraksha',
    name: 'Janani Suraksha Yojana (JSY)',
    category: 'Health',
    description: 'Safe motherhood intervention under the NHM.',
    benefits: ['Cash assistance for institutional delivery'],
    eligibility: ['Pregnant women from BPL/SC/ST categories'],
    documentsRequired: ['JSY Card', 'Bank Details', 'Medical Certificate']
  },
  {
    id: 'nhm',
    name: 'National Health Mission',
    category: 'Health',
    description: 'Universal access to equitable, affordable, and quality health care.',
    benefits: ['Free medicines', 'Free diagnostic services', 'Emergency transport'],
    eligibility: ['All citizens', 'Priority for rural population'],
    documentsRequired: ['Aadhaar (preferred)']
  },

  // SENIOR CITIZEN & SOCIAL SECURITY
  {
    id: 'old-age-pension',
    name: 'Indira Gandhi National Old Age Pension Scheme',
    category: 'Social Welfare',
    description: 'Monthly pension for senior citizens from BPL families.',
    benefits: ['Monthly financial assistance'],
    eligibility: ['Age 60+', 'Belong to BPL category'],
    documentsRequired: ['Age Proof', 'BPL Card', 'Bank Account']
  },
  {
    id: 'widow-pension',
    name: 'Indira Gandhi National Widow Pension Scheme',
    category: 'Social Welfare',
    description: 'Pension for widows from BPL households.',
    benefits: ['Monthly cash transfer'],
    eligibility: ['Age 40-79', 'BPL Widow'],
    documentsRequired: ['Death Certificate of Husband', 'BPL Certificate']
  },
  {
    id: 'disability-pension',
    name: 'Indira Gandhi National Disability Pension Scheme',
    category: 'Social Welfare',
    description: 'Financial support for persons with severe disabilities.',
    benefits: ['Monthly pension'],
    eligibility: ['Age 18-79', '80% or more disability', 'BPL'],
    documentsRequired: ['Disability Certificate', 'BPL Card']
  },
  {
    id: 'atal-pension',
    name: 'Atal Pension Yojana (APY)',
    category: 'Social Welfare',
    description: 'Guaranteed pension for workers in the unorganized sector.',
    benefits: ['Pension of ₹1000 - ₹5000 after 60 years'],
    eligibility: ['Age 18-40', 'Saving Bank account holders'],
    documentsRequired: ['Aadhaar', 'Mobile Number']
  },

  // WOMEN & GIRL CHILD
  {
    id: 'beti-bachao',
    name: 'Beti Bachao Beti Padhao',
    category: 'Women & Child',
    description: 'Addressing the issue of declining Child Sex Ratio and women empowerment.',
    benefits: ['Educational support', 'Awareness campaigns', 'Survival protection'],
    eligibility: ['All families with girl children'],
    documentsRequired: ['Birth Certificate', 'Identity Proof']
  },
  {
    id: 'sukanya-samriddhi',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    category: 'Women & Child',
    description: 'Small deposit scheme for the girl child part of "Beti Bachao Beti Padhao".',
    benefits: ['High interest rate', 'Tax benefits under 80C'],
    eligibility: ['Parents of girl child aged < 10 years'],
    documentsRequired: ['Birth Certificate of Girl', 'Parent KYC']
  },
  {
    id: 'pmmv-yojana',
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    category: 'Women & Child',
    description: 'Maternity benefit for first-time mothers.',
    benefits: ['₹5,000 in three installments'],
    eligibility: ['Pregnant Women & Lactating Mothers'],
    documentsRequired: ['MCP Card', 'Aadhaar', 'Bank Details']
  },
  {
    id: 'ujjwala-yojana',
    name: 'Pradhan Mantri Ujjwala Yojana',
    category: 'Utility',
    description: 'Clean cooking fuel to BPL households.',
    benefits: ['Free LPG connection', 'Subsidy on cylinders'],
    eligibility: ['BPL adult women'],
    documentsRequired: ['BPL Card', 'Aadhaar', 'Ration Card']
  },
  {
    id: 'lakhpati-didi',
    name: 'Lakhpati Didi Scheme',
    category: 'Women & Child',
    description: 'Initiative to empower women in Self Help Groups (SHGs) to earn at least ₹1 Lakh per year.',
    benefits: ['Skill training (Drone pilot, tailoring, etc.)', 'Financial literacy', 'Market access'],
    eligibility: ['Women members of SHGs'],
    documentsRequired: ['SHG Membership ID', 'Aadhaar Card', 'Bank Details']
  },
  {
    id: 'mission-shakti',
    name: 'Mission Shakti',
    category: 'Women & Child',
    description: 'Integrated women empowerment programme including Sambal and Samarthya sub-schemes.',
    benefits: ['Safety and security (Sambal)', 'Empowerment and livelihood (Samarthya)'],
    eligibility: ['All Indian women', 'Distressed women', 'Working women'],
    documentsRequired: ['Aadhaar Card', 'Income Proof']
  },

  // EDUCATION & STUDENTS
  {
    id: 'nsp-scholarships',
    name: 'National Scholarship Portal Schemes',
    category: 'Education',
    description: 'One-stop solution for various scholarship schemes offered by Central/State Govts.',
    benefits: ['Direct benefit transfer of scholarship amount'],
    eligibility: ['Meritorious students', 'SC/ST/OBC/Minority students'],
    documentsRequired: ['Marksheet', 'Income Certificate', 'Caste Certificate']
  },
  {
    id: 'pm-scholarship',
    name: 'PM Scholarship Scheme',
    category: 'Education',
    description: 'Scholarship for wards of Ex-Servicemen and Coast Guard personnel.',
    benefits: ['Financial aid for higher professional education'],
    eligibility: ['Wards of deceased/ex-servicemen'],
    documentsRequired: ['Service Certificate', 'Bonafide Certificate']
  },
  {
    id: 'nmms-scholarship',
    name: 'National Means cum Merit Scholarship (NMMS)',
    category: 'Education',
    description: 'Assistance to meritorious students of economically weaker sections.',
    benefits: ['₹12,000 per annum for students of class 9-12'],
    eligibility: ['Class 8 passed with 55%', 'Parental income < 3.5L'],
    documentsRequired: ['Income Proof', 'Marksheet']
  },
  {
    id: 'post-matric-scholarship',
    name: 'Post Matric Scholarship (SC/ST/OBC)',
    category: 'Education',
    description: 'Providing financial assistance to students belonging to backward classes.',
    benefits: ['Maintenance allowance', 'Reimbursement of non-refundable fees'],
    eligibility: ['Students of class 11 to post-graduation'],
    documentsRequired: ['Caste Certificate', 'Income Certificate']
  },
  {
    id: 'pm-shri',
    name: 'PM SHRI Schools',
    category: 'Education',
    description: 'Pradhan Mantri Schools for Rising India - upgrading schools to showcase the National Education Policy.',
    benefits: ['High quality education infrastructure', 'Equitable and inclusive school environment'],
    eligibility: ['Government school students'],
    documentsRequired: ['School Admission Record', 'Aadhaar Card']
  },

  // EMPLOYMENT & SKILL
  {
    id: 'mgnrega',
    name: 'MGNREGA (National Rural Employment Guarantee Act)',
    category: 'Employment',
    description: 'Guaranteeing 100 days of unskilled manual work to rural households.',
    benefits: ['Guaranteed wages', 'Unemployment allowance if work not provided'],
    eligibility: ['Adult members of rural households'],
    documentsRequired: ['Job Card', 'Aadhaar']
  },
  {
    id: 'pmkvy',
    name: 'Pradhan Mantri Kaushal Vikas Yojana',
    category: 'Skills',
    description: 'Flagship skill certification scheme of MSDE.',
    benefits: ['Industry-relevant skill training', 'Certification', 'Placement support'],
    eligibility: ['Unemployed youth or school/college dropouts'],
    documentsRequired: ['Aadhaar', 'Educational Certificates']
  },
  {
    id: 'ddu-gky',
    name: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana',
    category: 'Skills',
    description: 'Placement linked skill training program for rural youth.',
    benefits: ['Free residential training', 'Guaranteed placement'],
    eligibility: ['Rural youth aged 15-35 years'],
    documentsRequired: ['BPL Card/MGNREGA Job Card', 'Age Proof']
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma',
    category: 'Skills',
    description: 'Support for artisans and craftspeople using hands and tools.',
    benefits: ['Recognition through ID card', 'Skill upgradation', 'Collateral-free credit support up to ₹3 Lakh'],
    eligibility: ['Artisans and craftspeople (18 trades like Carpentry, Pottery, etc.)'],
    documentsRequired: ['Aadhaar Card', 'Bank Account', 'Trade Certificate/Self-declaration']
  },

  // BUSINESS & ENTREPRENEURSHIP
  {
    id: 'pm-mudra',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    category: 'Business',
    description: 'Funding the unfunded - loans up to ₹10 Lakh to non-corporate, non-farm small/micro enterprises.',
    benefits: ['Collateral-free loans (Shishu, Kishore, Tarun)'],
    eligibility: ['Small business owners', 'Entrepreneurs'],
    documentsRequired: ['Business Plan', 'KYC Documents']
  },
  {
    id: 'stand-up-india',
    name: 'Stand-Up India',
    category: 'Business',
    description: 'Facilitating bank loans between ₹10 Lakh and ₹1 Crore to SC/ST and women.',
    benefits: ['Bank loans for greenfield enterprises'],
    eligibility: ['SC/ST or Woman entrepreneurs aged 18+'],
    documentsRequired: ['Caste Certificate', 'Business Details']
  },
  {
    id: 'startup-india',
    name: 'Startup India',
    category: 'Business',
    description: 'Building a strong ecosystem for nurturing innovation and startups.',
    benefits: ['Tax exemptions', 'Patent filing support', 'Self-certification'],
    eligibility: ['Innovators with registered entities < 10 years old'],
    documentsRequired: ['Certificate of Incorporation']
  },
  {
    id: 'pm-svanidhi',
    name: 'PM SVANidhi',
    category: 'Business',
    description: 'Micro-credit facility for street vendors.',
    benefits: ['Working capital loan up to ₹10,000', 'Interest subsidy on timely repayment'],
    eligibility: ['Street vendors in urban areas'],
    documentsRequired: ['Vendor ID Card', 'Letter of Recommendation']
  },

  // FINANCIAL INCLUSION
  {
    id: 'jan-dhan',
    name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    category: 'Banking',
    description: 'National Mission for Financial Inclusion.',
    benefits: ['No minimum balance account', 'Accident insurance of ₹2 Lakh'],
    eligibility: ['Any Indian citizen aged 10+'],
    documentsRequired: ['Aadhaar', 'PAN (Optional)']
  },
  {
    id: 'jeevan-jyoti',
    name: 'PM Jeevan Jyoti Bima Yojana (PMJJBY)',
    category: 'Banking',
    description: 'One-year life insurance scheme.',
    benefits: ['Life cover of ₹2 Lakh on death'],
    eligibility: ['Age 18-50', 'Savings bank account holders'],
    documentsRequired: ['Aadhaar linked Bank Account']
  },
  {
    id: 'suraksha-bima',
    name: 'PM Suraksha Bima Yojana (PMSBY)',
    category: 'Banking',
    description: 'Accident insurance scheme with very low premium.',
    benefits: ['₹2 Lakh for accidental death/disability'],
    eligibility: ['Age 18-70', 'Savings bank account holders'],
    documentsRequired: ['Aadhaar linked Bank Account']
  },
  {
    id: 'mahila-samman',
    name: 'Mahila Samman Savings Certificate',
    category: 'Banking',
    description: 'Small savings scheme for women and girls.',
    benefits: ['Fixed interest rate of 7.5%', 'Partial withdrawal facility'],
    eligibility: ['Women and girls (Guardian can apply for minor)'],
    documentsRequired: ['KYC Documents', 'Initial Deposit']
  },

  // DISABILITY
  {
    id: 'adip-scheme',
    name: 'ADIP Scheme',
    category: 'Disability',
    description: 'Assistance to disabled persons for purchase/fitting of aids and appliances.',
    benefits: ['Free or subsidized hearing aids, wheelchairs, prosthetics'],
    eligibility: ['Indian citizen with 40%+ disability', 'Income < ₹30,000/mo'],
    documentsRequired: ['Disability Certificate', 'Income Certificate']
  },

  // REGIONAL / SPECIAL TARGET
  {
    id: 'pm-janman',
    name: 'Pradhan Mantri Janman',
    category: 'Social Welfare',
    description: 'PM Janjati Adivasi Nyaya Maha Abhiyan for the holistic development of Particularly Vulnerable Tribal Groups (PVTGs).',
    benefits: ['Housing', 'Clean water', 'Electricity', 'Education in remote areas'],
    eligibility: ['Members of PVTG communities'],
    documentsRequired: ['Caste Certificate (Tribal)', 'Residence Proof']
  }
];

export const GOV_DOCUMENTS: GovDocument[] = [
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    category: 'Identity',
    procedure: 'Visit nearest Aadhaar Enrolment Centre with identity and address proof. Provide biometric data.',
    eligibility: 'Resident of India (stayed for 182 days or more in the last 12 months).',
    benefits: 'Universal ID, direct benefit transfers, digital authentication.',
    link: 'https://uidai.gov.in/',
    helpline: '1947'
  },
  {
    id: 'pan',
    name: 'PAN Card (Permanent Account Number)',
    category: 'Financial',
    procedure: 'Apply online via NSDL or UTIITSL website with identity, address, and DOB proof.',
    eligibility: 'Any individual, firm, or entity paying taxes.',
    benefits: 'Necessary for financial transactions, filing income tax returns.',
    link: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    helpline: '1800-180-1961'
  },
  {
    id: 'voter-id',
    name: 'Voter ID (EPIC)',
    category: 'Identity',
    procedure: 'Apply via Voter Service Portal (NVSP) Form 6 online or visit local ERO.',
    eligibility: 'Indian citizen aged 18 or above.',
    benefits: 'Right to vote, identity proof for government services.',
    link: 'https://voters.eci.gov.in/',
    helpline: '1950'
  },
  {
    id: 'bpl-card',
    name: 'BPL Ration Card (Antyodaya Anna Yojana)',
    category: 'Social Welfare',
    procedure: 'Apply through the State Food & Civil Supplies Department portal. Submit income certificate, residence proof, and family photographs to the local Tehsil or Block office.',
    eligibility: 'Families identified as living Below the Poverty Line based on state-specific economic criteria.',
    benefits: 'Highly subsidized food grains (Rice, Wheat, Coarse Grains), sugar, and kerosene. Priority in various state and central welfare schemes.',
    link: 'https://nfsa.gov.in/',
    helpline: '1967'
  },
  {
    id: 'caste-certificate',
    name: 'Caste Certificate (SC/ST/OBC)',
    category: 'Social Welfare',
    procedure: 'Apply online through the State e-District portal or at the Revenue Office/Tehsil. Provide proof of caste (e.g., father\'s certificate) and residence.',
    eligibility: 'Citizens belonging to Scheduled Castes, Scheduled Tribes, or Other Backward Classes as per the government list.',
    benefits: 'Reservations in educational institutions, government jobs, and access to specific scholarships and financial aid.',
    link: 'https://edistrict.delhigovt.nic.in/',
    helpline: '1800-11-0033'
  },
  {
    id: 'income-certificate',
    name: 'Income Certificate',
    category: 'Social Welfare',
    procedure: 'File an application at the local Revenue Office (Tehsildar) or through the e-District portal. Submit salary slips or an affidavit along with address and identity proof.',
    eligibility: 'Any resident needing to prove their annual family income for welfare or educational purposes.',
    benefits: 'Requirement for claiming fee waivers, scholarships, and eligibility for BPL and other income-based government schemes.',
    link: 'https://india.gov.in/service/apply-income-certificate',
    helpline: 'Local e-District Helpline'
  },
  {
    id: 'birth-certificate',
    name: 'Birth Certificate',
    category: 'Vital Records',
    procedure: 'Register the birth at the local Municipal Corporation or Gram Panchayat within 21 days of occurrence. Apply online via the Civil Registration System (CRS) portal.',
    eligibility: 'Every individual born in India is eligible and required to be registered.',
    benefits: 'Primary proof of age for school admission, voter registration, marriage registration, and obtaining other IDs like Passport.',
    link: 'https://crsorgi.gov.in/',
    helpline: '1800-11-4444'
  },
  {
    id: 'mgnrega-job-card',
    name: 'MGNREGA Job Card',
    category: 'Social Welfare',
    procedure: 'Submit a written or oral application to the local Gram Panchayat. Provide name, age, and address of all household members.',
    eligibility: 'Any adult member of a rural household willing to do unskilled manual work.',
    benefits: 'Right to 100 days of guaranteed wage employment in a financial year. Direct wage payment into bank accounts.',
    link: 'https://nrega.nic.in/',
    helpline: '1800-110-707'
  }
];

export const HEALTH_CAMPS: HealthCamp[] = [
  {
    id: '1',
    title: 'Free Eye Checkup Camp',
    location: 'Community Center, Ward 12, Janakpuri',
    city: 'Delhi',
    date: '2024-06-05',
    time: '09:00 AM - 04:00 PM',
    description: 'Free comprehensive eye examination and basic medicine distribution.'
  },
  {
    id: '2',
    title: 'Maternal & Child Health Camp',
    location: 'District Hospital Grounds, Andheri East',
    city: 'Mumbai',
    date: '2024-06-08',
    time: '10:00 AM - 02:00 PM',
    description: 'Specialist consultation for mothers and immunization for children.'
  },
  {
    id: '3',
    title: 'Geriatric Wellness Program',
    location: 'Senior Citizen Park, Jayanagar',
    city: 'Bangalore',
    date: '2024-06-10',
    time: '08:00 AM - 12:00 PM',
    description: 'Health screening for senior citizens including sugar and blood pressure monitoring.'
  },
  {
    id: '4',
    title: 'Dental Hygiene & Oral Health',
    location: 'Govt School Campus, Salt Lake',
    city: 'Kolkata',
    date: '2024-06-12',
    time: '09:30 AM - 03:30 PM',
    description: 'Free dental checkup and distribution of dental care kits for students and residents.'
  },
  {
    id: '5',
    title: 'Cardiovascular Health Screening',
    location: 'YMCA Grounds, Mylapore',
    city: 'Chennai',
    date: '2024-06-15',
    time: '07:00 AM - 11:00 AM',
    description: 'ECG and specialist heart consultation for adults.'
  },
  {
    id: '6',
    title: 'General Medical Diagnosis',
    location: 'Public Library Hall, Banjara Hills',
    city: 'Hyderabad',
    date: '2024-06-18',
    time: '10:00 AM - 04:00 PM',
    description: 'General checkups and free basic medicine distribution by top city doctors.'
  },
  {
    id: '7',
    title: 'Dermatology & Skin Care',
    location: 'Town Hall Square',
    city: 'Ahmedabad',
    date: '2024-06-20',
    time: '11:00 AM - 05:00 PM',
    description: 'Consultation for skin diseases and allergies with free ointment distribution.'
  },
  {
    id: '8',
    title: 'Women Wellness Drive',
    location: 'Mahila Bhavan, Shivaji Nagar',
    city: 'Pune',
    date: '2024-06-22',
    time: '10:00 AM - 04:00 PM',
    description: 'Gynecological checkups and nutritional advice for women of all ages.'
  },
  {
    id: '9',
    title: 'Free Blood Donation & Health Drive',
    location: 'Civil Lines Community Center',
    city: 'Jaipur',
    date: '2024-06-25',
    time: '09:00 AM - 05:00 PM',
    description: 'Donate blood and get a free complete body health checkup report.'
  },
  {
    id: '10',
    title: 'Diabetes Awareness Camp',
    location: 'Railway Colony Park',
    city: 'Lucknow',
    date: '2024-06-28',
    time: '08:00 AM - 01:00 PM',
    description: 'Sugar testing and consultation with endocrinologists.'
  }
];

export const HELPLINES: Helpline[] = [
  { 
    id: '1', 
    title: 'National Emergency Number', 
    number: '112', 
    category: 'Police', 
    description: 'Single emergency response number across India for Police, Fire, and Medical assistance.',
    procedure: 'Dial 112 from any phone. State your location and the type of emergency. The operator will dispatch the nearest respective responders.'
  },
  { 
    id: '2', 
    title: 'Police Emergency', 
    number: '100', 
    category: 'Police', 
    description: 'Dedicated helpline for immediate police intervention and reporting of crimes.',
    procedure: 'Dial 100. Provide clear details of the incident and your current address.'
  },
  { 
    id: '3', 
    title: 'Fire Emergency', 
    number: '101', 
    category: 'Police', 
    description: 'Helpline for reporting fire accidents and requesting fire brigade services.',
    procedure: 'Dial 101. Specify the extent of the fire and precise location.'
  },
  { 
    id: '4', 
    title: 'Ambulance Support', 
    number: '102', 
    category: 'Medical', 
    description: 'National helpline for medical emergencies and hospital transport.',
    procedure: 'Dial 102. Describe the medical condition and state if immediate life support is required.'
  },
  { 
    id: '5', 
    title: 'Disaster Management', 
    number: '108', 
    category: 'Disaster', 
    description: 'Comprehensive emergency services for accidents and natural disasters.',
    procedure: 'Dial 108. Stay calm and follow the operator\'s instructions for safety until help arrives.'
  },
  { 
    id: '6', 
    title: 'Women Helpline', 
    number: '1091', 
    category: 'Women & Child', 
    description: 'Helpline for women in distress, facing domestic violence or harassment.',
    procedure: 'Dial 1091. You can request immediate rescue or psychological support.'
  },
  { 
    id: '7', 
    title: 'Child Helpline', 
    number: '1098', 
    category: 'Women & Child', 
    description: 'Emergency phone outreach service for children in need of care and protection.',
    procedure: 'Dial 1098. Report cases of child labor, abuse, or lost children.'
  },
  { 
    id: '8', 
    title: 'Senior Citizen Helpline', 
    number: '14567', 
    category: 'Senior Citizen', 
    description: 'National helpline for elders to report neglect, abuse, or seek legal aid.',
    procedure: 'Dial 14567. Counselors are available to provide guidance and connect with local authorities.'
  },
  { 
    id: '9', 
    title: 'Kisan Call Center', 
    number: '1800-180-1551', 
    category: 'Farmers', 
    description: 'Expert advice for farmers on crops, fertilizers, and agricultural schemes.',
    procedure: 'Dial the toll-free number. Speak with agricultural experts in your regional language.'
  },
  { 
    id: '10', 
    title: 'Railway Helpline', 
    number: '139', 
    category: 'Railway', 
    description: 'Unified helpline for all rail-related queries, security, and complaints.',
    procedure: 'Dial 139. Follow the IVR to select security, medical aid, or general inquiry.'
  },
  { 
    id: '11', 
    title: 'Cyber Crime Reporting', 
    number: '1930', 
    category: 'Cyber', 
    description: 'Helpline to report financial cyber fraud and social media crimes.',
    procedure: 'Dial 1930 immediately after a fraud occurs. Provide transaction details for potential fund freezing.'
  },
  { 
    id: '12', 
    title: 'Mental Health (KIRAN)', 
    number: '1800-599-0019', 
    category: 'Medical', 
    description: '24/7 helpline providing psychological support and mental health counseling.',
    procedure: 'Dial the toll-free number. Reach out for anonymous and professional counseling.'
  },
  { 
    id: '13', 
    title: 'Anti-Ragging Helpline', 
    number: '1800-180-5522', 
    category: 'Students', 
    description: 'Helpline for students facing ragging or harassment in educational institutions.',
    procedure: 'Dial the toll-free number. Cases are handled with strict confidentiality.'
  },
  { 
    id: '14', 
    title: 'Tourist Helpline', 
    number: '1800-11-1363', 
    category: 'Tourism', 
    description: 'Support for domestic and international tourists in multiple languages.',
    procedure: 'Dial the toll-free number for guidance on travel, safety, and local services.'
  },
  { 
    id: '15', 
    title: 'Voter Helpline', 
    number: '1950', 
    category: 'Utility', 
    description: 'Inquiry line for election-related services, EPIC card status, and polling details.',
    procedure: 'Dial 1950. Keep your EPIC number ready for faster assistance.'
  },
  { 
    id: '16', 
    title: 'LPG Leakage Helpline', 
    number: '1906', 
    category: 'Utility', 
    description: 'Emergency response number for reporting gas leakages.',
    procedure: 'Dial 1906. Extinguish all flames and open windows before calling.'
  },
  { 
    id: '17', 
    title: 'AIDS Helpline', 
    number: '1097', 
    category: 'Medical', 
    description: 'Support and information for HIV/AIDS awareness and treatment.',
    procedure: 'Dial 1097 for anonymous and non-judgmental information.'
  }
];
