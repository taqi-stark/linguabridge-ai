export interface DocumentRequirement {
  name: string;
  description?: string;
  required: boolean;
}

export interface ProcessStep {
  step: number;
  title: string;
  timeline: string;
  documents: DocumentRequirement[];
  notes?: string;
}

export interface GuideCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  processSteps: ProcessStep[];
  estimatedTotalTime: string;
  totalCost: string;
  sources: string[];
  roleplayScenario?: string;
}

export interface CountryGuide {
  country: string;
  countryCode: string;
  categories: Record<string, GuideCategory>;
}

export const studentGuideData: Record<string, CountryGuide> = {
  de: {
    country: "Germany",
    countryCode: "DE",
    categories: {
      visa: {
        id: "visa",
        name: "Student Visa",
        icon: "🛂",
        description: "Complete process to obtain a German student visa",
        estimatedTotalTime: "3-4 months",
        totalCost: "€75",
        roleplayScenario: "Practice visa interview questions in German",
        sources: ["make-it-in-germany.com", "DAAD", "German Embassy"],
        processSteps: [
          {
            step: 1,
            title: "Get Letter of Admission",
            timeline: "1-2 months",
            documents: [
              { name: "High school diploma", required: true },
              { name: "Language certificate (B1 or higher)", required: true },
              { name: "CV/Resume", required: true },
              { name: "Motivation letter", required: false },
            ],
            notes: "Apply directly to universities through their application portal",
          },
          {
            step: 2,
            title: "Open Blocked Account (Sperrkonto)",
            timeline: "1-2 weeks",
            documents: [
              { name: "Passport", required: true },
              { name: "Letter of admission", required: true },
              { name: "€934 per month for 12 months (€11,208 total)", required: true },
            ],
            notes:
              "Required proof of funds. Blocked account companies: Fintiba, Deutsche Bank, Dresdner Bank",
          },
          {
            step: 3,
            title: "Apply for Student Visa",
            timeline: "2-4 weeks",
            documents: [
              { name: "Completed visa application form", required: true },
              { name: "Valid passport (min 6 months validity)", required: true },
              { name: "Proof of funds (blocked account certificate)", required: true },
              { name: "Letter of admission from university", required: true },
              { name: "Health insurance confirmation", required: true },
              { name: "CV/Resume", required: true },
            ],
            notes:
              "Apply at your nearest German embassy or consulate. Processing time varies by location",
          },
          {
            step: 4,
            title: "Arrange Accommodation",
            timeline: "2-3 months (parallel to visa)",
            documents: [
              { name: "Proof of accommodation (dormitory or rental contract)", required: true },
            ],
            notes:
              "Universities often help with accommodation. Start searching early on housing websites",
          },
        ],
      },
      housing: {
        id: "housing",
        name: "Student Housing",
        icon: "🏠",
        description: "Find and secure accommodation as an international student",
        estimatedTotalTime: "2-3 months",
        totalCost: "€300-600/month",
        roleplayScenario: "Practice asking about apartment rental in German",
        sources: ["WG-Gesucht", "ImmobilienScout24", "Wohnen-im-Studium"],
        processSteps: [
          {
            step: 1,
            title: "Research Housing Options",
            timeline: "1 month before arrival",
            documents: [
              { name: "University housing list", required: false },
              { name: "Budget plan", required: true },
            ],
            notes:
              "Options: University dorms (cheapest, €250-400), WG (shared flat, €300-500), private room (€400-800)",
          },
          {
            step: 2,
            title: "Apply for University Dorm",
            timeline: "2-3 months before",
            documents: [
              { name: "Student ID or admission letter", required: true },
              { name: "Application form", required: true },
            ],
            notes: "High demand, early application increases chances",
          },
          {
            step: 3,
            title: "Sign Rental Contract",
            timeline: "1-2 weeks",
            documents: [
              { name: "Signed rental contract (Mietvertrag)", required: true },
              { name: "Copy of passport", required: true },
              { name: "Bank details for security deposit transfer", required: true },
            ],
            notes: "Usually requires 2-3 months deposit + 1 month advance rent",
          },
          {
            step: 4,
            title: "Register Residence (Anmeldung)",
            timeline: "Within 2 weeks of arrival",
            documents: [
              { name: "Passport", required: true },
              { name: "Rental contract", required: true },
              { name: "Confirmation from landlord (Wohnungsgeberbestaetigung)", required: true },
            ],
            notes: "Register at local registration office (Bürgeramt). Mandatory for all residents",
          },
        ],
      },
      banking: {
        id: "banking",
        name: "Banking & Finance",
        icon: "🏦",
        description: "Open a bank account and manage finances",
        estimatedTotalTime: "1-2 weeks",
        totalCost: "Free (most student accounts)",
        roleplayScenario: "Practice opening bank account conversation",
        sources: ["Deutsche Bank", "Commerzbank", "Sparkasse"],
        processSteps: [
          {
            step: 1,
            title: "Choose a Bank",
            timeline: "1 week before arrival",
            documents: [{ name: "Comparison of student-friendly banks", required: false }],
            notes: "Popular: Deutsche Bank, Commerzbank, Sparkasse, ING, Comdirect",
          },
          {
            step: 2,
            title: "Prepare Documents",
            timeline: "Before visit",
            documents: [
              { name: "Passport or ID card", required: true },
              { name: "Proof of address (rental contract or Anmeldung)", required: true },
              { name: "Student enrollment confirmation", required: false },
            ],
            notes: "Some banks accept online registration, others require in-person visit",
          },
          {
            step: 3,
            title: "Open Bank Account",
            timeline: "1 week",
            documents: [
              { name: "Completed application form", required: true },
              { name: "Video verification (if online)", required: false },
            ],
            notes: "Instant opening at many banks. Card and account access within days",
          },
          {
            step: 4,
            title: "Set Up Online Banking",
            timeline: "1-2 days",
            documents: [
              { name: "Login credentials", required: true },
              { name: "TAN/2FA device or app", required: true },
            ],
            notes: "Enable online banking for transfers and payments",
          },
        ],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "💼",
        description: "Learn about student work regulations and find employment",
        estimatedTotalTime: "Ongoing (find job after arrival)",
        totalCost: "N/A",
        roleplayScenario: "Practice job interview in German",
        sources: ["DAAD", "StaBa", "German Employment Law"],
        processSteps: [
          {
            step: 1,
            title: "Understand Work Regulations",
            timeline: "Before arrival",
            documents: [{ name: "Student work guidelines document", required: false }],
            notes:
              "International students: 120 full days or 240 half days per year. Must not exceed 20 hours/week during semester",
          },
          {
            step: 2,
            title: "Register with Employment Agency (Agentur für Arbeit)",
            timeline: "First month",
            documents: [
              { name: "Passport", required: true },
              { name: "Proof of address", required: true },
              { name: "Student enrollment letter", required: true },
            ],
            notes: "Optional but helpful for job search support",
          },
          {
            step: 3,
            title: "Find Student Job",
            timeline: "1-3 months",
            documents: [{ name: "Valid work permit status", required: true }],
            notes:
              "Popular: student assistant at university (€520/month mini-job), bar/restaurant (€12/hour), tutoring",
          },
          {
            step: 4,
            title: "Get Tax ID (Steuer-ID) & Register",
            timeline: "When hired",
            documents: [
              { name: "Job contract", required: true },
              { name: "Steuer-ID (usually automatic after Anmeldung)", required: true },
            ],
            notes: "Mini-jobs (up to €520/month) are tax-free",
          },
        ],
      },
      health: {
        id: "health",
        name: "Health Insurance",
        icon: "⚕️",
        description: "Mandatory health insurance for all students",
        estimatedTotalTime: "1-2 weeks",
        totalCost: "€110-120/month (student rate)",
        roleplayScenario: "Practice explaining health issues to doctor in German",
        sources: ["Techniker Krankenkasse", "AOK", "Barmer"],
        processSteps: [
          {
            step: 1,
            title: "Choose Health Insurance Provider (Krankenkasse)",
            timeline: "Before enrollment",
            documents: [{ name: "Comparison of providers", required: false }],
            notes: "Popular: TK, AOK, Barmer, DAK. Most offer student rates (~€110-120/month)",
          },
          {
            step: 2,
            title: "Apply for Student Health Insurance",
            timeline: "1-2 weeks",
            documents: [
              { name: "Proof of student enrollment", required: true },
              { name: "Passport/ID", required: true },
              { name: "Income statement (if employed)", required: false },
            ],
            notes: "Required to complete university enrollment",
          },
          {
            step: 3,
            title: "Receive Insurance Card (Versichertenkarte)",
            timeline: "1-2 weeks after approval",
            documents: [{ name: "Digital insurance card confirmation", required: true }],
            notes: "Use card for doctor visits, prescriptions, dental care",
          },
          {
            step: 4,
            title: "Register with Family Doctor (optional)",
            timeline: "After receiving card",
            documents: [{ name: "Health insurance card", required: true }],
            notes: "Recommended for coordinated care. Many international students skip this",
          },
        ],
      },
      transport: {
        id: "transport",
        name: "Public Transport",
        icon: "🚌",
        description: "Get student transit card and navigate the transport system",
        estimatedTotalTime: "1 week",
        totalCost: "€20-60/month (student pass)",
        roleplayScenario: "Practice asking for directions and buying tickets",
        sources: ["Local MVG/VBB", "University Transport Office"],
        processSteps: [
          {
            step: 1,
            title: "Get Student Transport Card (BahnCard)",
            timeline: "After enrollment",
            documents: [
              { name: "Student enrollment confirmation", required: true },
              { name: "Photo ID", required: true },
            ],
            notes:
              "Many universities include transit pass in semester fees. Otherwise ~€60/month for unlimited access",
          },
          {
            step: 2,
            title: "Understand Local Transport System",
            timeline: "First week",
            documents: [
              { name: "Transit map", required: false },
              { name: "Planner app (Citymapper, MVG App)", required: false },
            ],
            notes: "Germany: U-Bahn (subway), S-Bahn (trains), Tram, Bus",
          },
          {
            step: 3,
            title: "Set Up Digital Ticket App",
            timeline: "1-2 days",
            documents: [
              { name: "DB Navigator or local transit app", required: false },
              { name: "Bank account for payment", required: true },
            ],
            notes: "Can buy single tickets via app or at machines",
          },
          {
            step: 4,
            title: "Apply for Bike Registration (optional)",
            timeline: "If buying bike",
            documents: [
              { name: "Proof of bike ownership", required: true },
              { name: "ID for registration", required: true },
            ],
            notes: "Biking is popular in Germany. Register to prevent theft",
          },
        ],
      },
    },
  },
  gb: {
    country: "United Kingdom",
    countryCode: "GB",
    categories: {
      visa: {
        id: "visa",
        name: "Student Visa",
        icon: "🛂",
        description: "UK Student Visa (Tier 4/Student Route) application process",
        estimatedTotalTime: "2-3 months",
        totalCost: "£719 (visa fee) + £1,035 (healthcare surcharge)",
        roleplayScenario: "Practice visa interview in English",
        sources: ["gov.uk", "UK Visas and Immigration", "British Council"],
        processSteps: [
          {
            step: 1,
            title: "Receive Offer from UK University",
            timeline: "1-6 months",
            documents: [
              { name: "GCSEs/A-Levels or equivalent qualifications", required: true },
              { name: "English language proof (IELTS, TOEFL)", required: true },
              { name: "Personal statement and references", required: true },
            ],
            notes: "Apply through UCAS portal before January 15 for intake in September",
          },
          {
            step: 2,
            title: "Confirm Enrollment & Get CAS",
            timeline: "1-2 weeks after accepting offer",
            documents: [
              { name: "Acceptance confirmation", required: true },
              { name: "Proof of finance (usually £15,000-25,000)", required: true },
            ],
            notes: "CAS (Confirmation of Acceptance for Studies) issued by university",
          },
          {
            step: 3,
            title: "Prepare Visa Application",
            timeline: "3-4 weeks",
            documents: [
              { name: "Valid passport (min 6 months validity)", required: true },
              { name: "CAS number", required: true },
              { name: "Proof of funds", required: true },
              { name: "IELTS certificate", required: true },
              { name: "Academic transcripts", required: true },
              { name: "Tuberculosis test certificate", required: true },
            ],
            notes: "Apply online at UK Visas and Immigration",
          },
          {
            step: 4,
            title: "Attend Biometrics Appointment",
            timeline: "1 week after application",
            documents: [
              { name: "Passport", required: true },
              { name: "Appointment confirmation", required: true },
            ],
            notes: "Provide fingerprints and photo at local application centre",
          },
        ],
      },
      housing: {
        id: "housing",
        name: "Student Housing",
        icon: "🏠",
        description: "Accommodation options for international students in the UK",
        estimatedTotalTime: "3-4 months",
        totalCost: "£100-300/week",
        roleplayScenario: "Practice renting flat and understanding contracts",
        sources: ["StudentRoom.co.uk", "SpareRoom", "University Halls"],
        processSteps: [
          {
            step: 1,
            title: "Explore Housing Options",
            timeline: "Before arrival",
            documents: [{ name: "University housing guide", required: false }],
            notes:
              "Options: University halls (£100-200/week), private halls (£120-250/week), house share (£120-200/week)",
          },
          {
            step: 2,
            title: "Apply for University Halls",
            timeline: "March-May (for September intake)",
            documents: [
              { name: "Student ID or admission letter", required: true },
              { name: "Application form", required: true },
            ],
            notes: "Priority given to first-year international students",
          },
          {
            step: 3,
            title: "Sign Tenancy Agreement",
            timeline: "1-2 weeks",
            documents: [
              { name: "Signed tenancy agreement", required: true },
              { name: "Passport", required: true },
              { name: "Proof of identity", required: true },
            ],
            notes: "Understand your rights under UK tenancy law",
          },
          {
            step: 4,
            title: "Pay Deposit & Rent",
            timeline: "Before move-in",
            documents: [
              { name: "Deposit (usually 5 weeks rent)", required: true },
              { name: "First month rent", required: true },
            ],
            notes: "Deposits protected in official scheme. Get prescribed information",
          },
        ],
      },
      banking: {
        id: "banking",
        name: "Banking & Finance",
        icon: "🏦",
        description: "Open UK bank account and manage student finances",
        estimatedTotalTime: "2-3 weeks",
        totalCost: "Free",
        roleplayScenario: "Practice opening bank account conversation",
        sources: ["Nationwide", "Barclays", "HSBC"],
        processSteps: [
          {
            step: 1,
            title: "Choose a Bank",
            timeline: "Before arrival",
            documents: [{ name: "Student bank comparison", required: false }],
            notes: "Popular: Barclays, Nationwide, NatWest, Santander (offer perks for students)",
          },
          {
            step: 2,
            title: "Prepare Documents",
            timeline: "Before visit",
            documents: [
              { name: "Passport", required: true },
              { name: "Proof of address (enrollment letter or tenancy agreement)", required: true },
              { name: "Student enrollment confirmation", required: false },
            ],
            notes: "Some banks accept online applications, others require branch visit",
          },
          {
            step: 3,
            title: "Open Bank Account",
            timeline: "1-2 weeks",
            documents: [{ name: "Completed application form", required: true }],
            notes: "Student accounts usually have interest-free overdraft (up to £1,000-3,000)",
          },
          {
            step: 4,
            title: "Set Up Online & Mobile Banking",
            timeline: "1-2 days",
            documents: [{ name: "Login credentials", required: true }],
            notes: "Essential for managing finances and receiving student finance payments",
          },
        ],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "💼",
        description: "Working while studying in the UK as international student",
        estimatedTotalTime: "Ongoing",
        totalCost: "N/A",
        roleplayScenario: "Practice job interview in English",
        sources: ["UK Government", "UKCISA", "UniversityCareers.ac.uk"],
        processSteps: [
          {
            step: 1,
            title: "Check Work Restrictions",
            timeline: "Before arrival",
            documents: [{ name: "Student visa documentation", required: true }],
            notes:
              "International students on Student visa can work: up to 20 hours/week during term, full-time during holidays",
          },
          {
            step: 2,
            title: "Get National Insurance Number (NIN)",
            timeline: "First month",
            documents: [
              { name: "Passport", required: true },
              { name: "Proof of address", required: true },
              { name: "University enrollment letter", required: true },
            ],
            notes: "Required by employers. Apply at local JCP/HMRC office",
          },
          {
            step: 3,
            title: "Find Student Job",
            timeline: "1-3 months",
            documents: [{ name: "Valid student visa", required: true }],
            notes:
              "Popular: university library, part-time retail, hospitality, tutoring (£8-12/hour)",
          },
          {
            step: 4,
            title: "Register for Tax & NI Contributions",
            timeline: "When hired",
            documents: [
              { name: "Job contract", required: true },
              { name: "National Insurance Number", required: true },
            ],
            notes: "Employers will handle PAYE (tax) automatically",
          },
        ],
      },
      health: {
        id: "health",
        name: "Health & Healthcare",
        icon: "⚕️",
        description: "Access NHS (health) services and understand UK healthcare",
        estimatedTotalTime: "1-2 weeks",
        totalCost: "Free (via visa surcharge already paid)",
        roleplayScenario: "Practice describing symptoms to doctor",
        sources: ["NHS", "Student Health Service", "UK Government"],
        processSteps: [
          {
            step: 1,
            title: "Register with GP (General Practitioner)",
            timeline: "First month",
            documents: [
              { name: "Passport", required: true },
              { name: "Proof of address (tenancy agreement)", required: true },
            ],
            notes: "GP is your primary healthcare contact. Free through NHS",
          },
          {
            step: 2,
            title: "Get NHS Number",
            timeline: "1-2 weeks after GP registration",
            documents: [{ name: "GP registration confirmation", required: true }],
            notes: "Used for all NHS appointments and prescriptions",
          },
          {
            step: 3,
            title: "Register with University Health Service",
            timeline: "First week",
            documents: [
              { name: "Student ID", required: true },
              { name: "NHS number (once received)", required: false },
            ],
            notes: "Many universities offer dedicated student health centres",
          },
          {
            step: 4,
            title: "Understand Emergency Services",
            timeline: "As needed",
            documents: [{ name: "Emergency contact numbers", required: false }],
            notes:
              "A&E (Accident & Emergency) for emergencies. Dial 999 for serious injuries/illness",
          },
        ],
      },
      transport: {
        id: "transport",
        name: "Transport & Travel",
        icon: "🚌",
        description: "Navigate UK transport systems and get student discounts",
        estimatedTotalTime: "1 week",
        totalCost: "£0-40/month (varies by city)",
        roleplayScenario: "Practice buying train/bus tickets and asking directions",
        sources: ["Transport Authority", "Railcard", "Local Buses"],
        processSteps: [
          {
            step: 1,
            title: "Get Student Railcard",
            timeline: "First month",
            documents: [
              { name: "Student ID card", required: true },
              { name: "Proof of age", required: true },
            ],
            notes: "Costs £30 and gives 1/3 discount on most UK train tickets",
          },
          {
            step: 2,
            title: "Understand Local Transport",
            timeline: "First week",
            documents: [{ name: "Local transport app or map", required: false }],
            notes:
              "London (Oyster card), Manchester (Bee Card), Glasgow (SPT). Different in each city",
          },
          {
            step: 3,
            title: "Apply for Bus Pass (if local)",
            timeline: "First month",
            documents: [{ name: "Student ID", required: true }],
            notes: "Many cities offer discounted student bus passes (£20-40/month unlimited)",
          },
          {
            step: 4,
            title: "Download Travel Apps",
            timeline: "1-2 days",
            documents: [{ name: "Smartphone", required: true }],
            notes: "Citymapper, Trainline, Busbud for trip planning",
          },
        ],
      },
    },
  },
  fr: {
    country: "France",
    countryCode: "FR",
    categories: {
      visa: {
        id: "visa",
        name: "Student Visa",
        icon: "🛂",
        description: "French student visa (Long-stay visa) for international students",
        estimatedTotalTime: "2-3 months",
        totalCost: "€100 (visa fee)",
        roleplayScenario: "Practice visa interview in French",
        sources: ["CampusFrance", "French Embassy", "gov.fr"],
        processSteps: [
          {
            step: 1,
            title: "Get University Admission",
            timeline: "2-3 months",
            documents: [
              { name: "High school diploma/A-Levels", required: true },
              { name: "French language proof (B1 or B2 depending on program)", required: true },
              { name: "Academic transcripts", required: false },
            ],
            notes: "Apply directly to university or through CampusFrance portal",
          },
          {
            step: 2,
            title: "Register on CampusFrance",
            timeline: "After receiving offer",
            documents: [
              { name: "Offer letter from university", required: true },
              { name: "Academic file", required: true },
            ],
            notes: "Online platform for organizing visa application",
          },
          {
            step: 3,
            title: "Prepare Visa Application",
            timeline: "3-4 weeks",
            documents: [
              { name: "Valid passport (min 1 year validity)", required: true },
              { name: "Long-stay visa application form", required: true },
              { name: "University acceptance letter", required: true },
              { name: "Proof of accommodation", required: true },
              { name: "Proof of financial resources (€615/month)", required: true },
              { name: "Health insurance coverage", required: true },
            ],
            notes: "Apply at French embassy/consulate in your country",
          },
          {
            step: 4,
            title: "Attend Visa Interview",
            timeline: "1-3 weeks after application",
            documents: [
              { name: "All application documents", required: true },
              { name: "Passport", required: true },
            ],
            notes: "Sometimes required, sometimes documents are sufficient",
          },
        ],
      },
      housing: {
        id: "housing",
        name: "Student Housing",
        icon: "🏠",
        description: "Find accommodation in French cities for students",
        estimatedTotalTime: "2-3 months",
        totalCost: "€300-600/month",
        roleplayScenario: "Practice renting apartment in French",
        sources: ["SeLoger", "LeBonCoin", "CROUS"],
        processSteps: [
          {
            step: 1,
            title: "Explore Housing Options",
            timeline: "Before arrival",
            documents: [{ name: "University housing list", required: false }],
            notes:
              "Options: University housing/CROUS dorms (€200-350), WC/shared flat (€300-500), private room (€400-800)",
          },
          {
            step: 2,
            title: "Apply for CROUS Dorms",
            timeline: "Before arrival",
            documents: [
              { name: "University enrollment", required: true },
              { name: "Proof of funds", required: false },
            ],
            notes: "CROUS provides cheap university dorms. Deadline: usually May 31",
          },
          {
            step: 3,
            title: "Sign Lease (Bail de Location)",
            timeline: "1-2 weeks",
            documents: [
              { name: "Signed lease agreement", required: true },
              { name: "ID/Passport", required: true },
              { name: "Proof of income or guarantee", required: true },
            ],
            notes:
              "French rental law is tenant-friendly. Get APL (housing allowance) registration form",
          },
          {
            step: 4,
            title: "Register for Housing Allowance (APL)",
            timeline: "After signing lease",
            documents: [
              { name: "Lease copy", required: true },
              { name: "University enrollment", required: true },
              { name: "Proof of income", required: false },
            ],
            notes: "APL can cover 30-80% of rent for students. Apply to CAF",
          },
        ],
      },
      banking: {
        id: "banking",
        name: "Banking & Finance",
        icon: "🏦",
        description: "Open French bank account and manage student finances",
        estimatedTotalTime: "1-2 weeks",
        totalCost: "Free or €30-50/month",
        roleplayScenario: "Practice opening bank account in French",
        sources: ["BNP Paribas", "Crédit Agricole", "SG"],
        processSteps: [
          {
            step: 1,
            title: "Choose a Bank",
            timeline: "Before arrival",
            documents: [{ name: "Bank comparison", required: false }],
            notes: "Big banks: BNP Paribas, SG, Crédit Agricole. Online: Revolut, Wise",
          },
          {
            step: 2,
            title: "Prepare Documents",
            timeline: "Before appointment",
            documents: [
              { name: "Passport or visa", required: true },
              { name: "Proof of French address", required: true },
              { name: "Student enrollment", required: false },
            ],
            notes: "French address can be university accommodation or landlord confirmation",
          },
          {
            step: 3,
            title: "Open Bank Account",
            timeline: "1-2 weeks",
            documents: [{ name: "Completed application", required: true }],
            notes: "Most banks have student accounts with reduced/no fees",
          },
          {
            step: 4,
            title: "Get Debit Card & Online Access",
            timeline: "1 week",
            documents: [{ name: "Bank account number", required: true }],
            notes: "Card sent by mail. Setup online banking for bill payments",
          },
        ],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "💼",
        description: "Working rights and opportunities for international students in France",
        estimatedTotalTime: "Ongoing",
        totalCost: "N/A",
        roleplayScenario: "Practice job interview in French",
        sources: ["CampusFrance", "CIDJ", "French Labour Laws"],
        processSteps: [
          {
            step: 1,
            title: "Understand Work Rights",
            timeline: "Before arrival",
            documents: [{ name: "Student visa terms", required: true }],
            notes:
              "EU students: can work freely. Non-EU: up to 964 hours/year (40h/week legal max). Can work 35h/week as student",
          },
          {
            step: 2,
            title: "Get Social Security Number (Numéro de Sécurité Sociale)",
            timeline: "First month",
            documents: [
              { name: "Passport", required: true },
              { name: "Proof of French address", required: true },
            ],
            notes: "Apply at local CPAM office. Essential for employment",
          },
          {
            step: 3,
            title: "Find Student Job",
            timeline: "1-3 months",
            documents: [{ name: "Work authorization status", required: true }],
            notes: "Popular: university job, babysitting, bar/restaurant, tutoring (€10-15/hour)",
          },
          {
            step: 4,
            title: "Register Employment with Authorities",
            timeline: "When hired",
            documents: [
              { name: "Job contract", required: true },
              { name: "Social security number", required: true },
            ],
            notes: "Employer handles registration. Student minimum wage: €11.27/hour",
          },
        ],
      },
      health: {
        id: "health",
        name: "Health & Insurance",
        icon: "⚕️",
        description: "Healthcare registration and health insurance for students",
        estimatedTotalTime: "2-3 weeks",
        totalCost: "€200-300/year (supplementary insurance)",
        roleplayScenario: "Practice doctor appointment in French",
        sources: ["CPAM", "French Healthcare System", "Campus Healthcare"],
        processSteps: [
          {
            step: 1,
            title: "Register with Social Health Insurance (CPAM)",
            timeline: "First month",
            documents: [
              { name: "Passport", required: true },
              { name: "Proof of residence", required: true },
              { name: "University enrollment", required: true },
            ],
            notes: "Mandatory for all students. Covers majority of healthcare costs",
          },
          {
            step: 2,
            title: "Get Health Insurance Card (Carte Vitale)",
            timeline: "1-2 months",
            documents: [{ name: "CPAM registration confirmation", required: true }],
            notes: "Digital card required for doctor visits and prescriptions",
          },
          {
            step: 3,
            title: "Get Supplementary Insurance (Mutuelle)",
            timeline: "First month (recommended)",
            documents: [{ name: "CPAM coverage proof", required: true }],
            notes: "Covers remaining costs. Universities often offer group plans (~€200-300/year)",
          },
          {
            step: 4,
            title: "Visit University Health Service",
            timeline: "As needed",
            documents: [
              { name: "Student ID", required: true },
              { name: "Health insurance card", required: true },
            ],
            notes: "Most universities have free health centre for students",
          },
        ],
      },
      transport: {
        id: "transport",
        name: "Transport & Passes",
        icon: "🚌",
        description: "Student transport options and public transportation",
        estimatedTotalTime: "1 week",
        totalCost: "€15-25/month (student pass)",
        roleplayScenario: "Practice buying train tickets and asking directions",
        sources: ["SNCF", "RATP", "Local Transport"],
        processSteps: [
          {
            step: 1,
            title: "Get Student Transport Card",
            timeline: "First month",
            documents: [
              { name: "Student ID", required: true },
              { name: "Photo", required: false },
            ],
            notes:
              "Each city has different system. SNCF Jeune gives train discounts. Local cards (€20-50/month)",
          },
          {
            step: 2,
            title: "Understand Local Transport",
            timeline: "First week",
            documents: [{ name: "Transport map and guides", required: false }],
            notes:
              "Paris: RATP (metro, bus, tram). Regional: TER, SNCF trains. Bikes: Vélib stations",
          },
          {
            step: 3,
            title: "Apply for Student Discount on Trains (SNCF)",
            timeline: "Any time",
            documents: [
              { name: "Student ID", required: true },
              { name: "Age proof", required: false },
            ],
            notes: "SNCF Jeune card: €50/year, 25-50% discount on most train tickets",
          },
          {
            step: 4,
            title: "Register with Local Transport Provider",
            timeline: "First month",
            documents: [{ name: "Student ID", required: true }],
            notes: "Most cities: apply at ticket office or online for student subscription",
          },
        ],
      },
    },
  },
  es: {
    country: "Spain",
    countryCode: "ES",
    categories: {
      visa: {
        id: "visa",
        name: "Student Visa",
        icon: "🛂",
        description: "Spanish student visa (Visado de estudiante) application",
        estimatedTotalTime: "2-3 months",
        totalCost: "€116 (visa fee)",
        roleplayScenario: "Practice visa interview in Spanish",
        sources: ["Spanish Embassy", "Ministerio de Inclusión", "University Spain"],
        processSteps: [
          {
            step: 1,
            title: "Get University Acceptance",
            timeline: "2-3 months",
            documents: [
              { name: "High school diploma", required: true },
              { name: "Spanish language proof (B1)", required: false },
              { name: "Academic transcripts", required: true },
            ],
            notes: "Apply directly to Spanish universities",
          },
          {
            step: 2,
            title: "Prepare Visa Application",
            timeline: "3-4 weeks",
            documents: [
              { name: "Completed visa application form", required: true },
              { name: "Valid passport (min 1 year validity)", required: true },
              { name: "University acceptance letter", required: true },
              { name: "Proof of accommodation", required: true },
              { name: "Proof of financial means (€575/month)", required: true },
              { name: "Criminal record certificate", required: true },
            ],
            notes: "Apply at nearest Spanish embassy/consulate",
          },
          {
            step: 3,
            title: "Attend Visa Interview",
            timeline: "2-3 weeks",
            documents: [
              { name: "All application documents", required: true },
              { name: "Passport", required: true },
            ],
            notes: "Interview may be required depending on embassy",
          },
          {
            step: 4,
            title: "Register for NIE (Foreigner ID)",
            timeline: "30 days after arrival",
            documents: [
              { name: "Visa stamp in passport", required: true },
              { name: "Proof of address", required: true },
              { name: "Proof of university enrollment", required: true },
            ],
            notes: "Essential for opening bank accounts and employment in Spain",
          },
        ],
      },
      housing: {
        id: "housing",
        name: "Student Housing",
        icon: "🏠",
        description: "Find accommodation as a student in Spanish cities",
        estimatedTotalTime: "2-3 months",
        totalCost: "€300-600/month",
        roleplayScenario: "Practice apartment viewing and rental negotiation",
        sources: ["Idealista.com", "Fotocasa", "Universitarios.es"],
        processSteps: [
          {
            step: 1,
            title: "Research Housing Options",
            timeline: "Before arrival",
            documents: [{ name: "University housing list", required: false }],
            notes:
              "Options: Residencia universitaria (€250-400), Piso compartido/WC (€300-500), Private room (€400-700)",
          },
          {
            step: 2,
            title: "Apply for University Housing",
            timeline: "April-May",
            documents: [
              { name: "University enrollment", required: true },
              { name: "Application form", required: true },
            ],
            notes: "Limited spots but cheapest option. Priority for first-year students",
          },
          {
            step: 3,
            title: "Sign Rental Contract (Contrato de Alquiler)",
            timeline: "1-2 weeks",
            documents: [
              { name: "Signed rental contract", required: true },
              { name: "Passport or NIE", required: true },
              { name: "Proof of income/guarantee", required: false },
            ],
            notes: "Contract typically 12 months. Deposit usually 2 months rent",
          },
          {
            step: 4,
            title: "Register Tenancy (Censo de Inquilinos)",
            timeline: "Within 30 days",
            documents: [
              { name: "Rental contract", required: true },
              { name: "NIE number", required: true },
            ],
            notes: "Register with property tax authority (Catastro) and local council",
          },
        ],
      },
      banking: {
        id: "banking",
        name: "Banking & Finance",
        icon: "🏦",
        description: "Open a Spanish bank account and manage finances",
        estimatedTotalTime: "1-2 weeks",
        totalCost: "Free or €50-100/year",
        roleplayScenario: "Practice bank conversation in Spanish",
        sources: ["BBVA", "La Caixa", "Santander"],
        processSteps: [
          {
            step: 1,
            title: "Choose a Bank",
            timeline: "Before or upon arrival",
            documents: [{ name: "Bank comparison", required: false }],
            notes:
              "Major banks: BBVA, Santander, La Caixa, Banco Sabadell. Many have student accounts",
          },
          {
            step: 2,
            title: "Prepare Documents",
            timeline: "Before appointment",
            documents: [
              { name: "Passport", required: true },
              { name: "NIE (if obtained) or temporary NIE certificate", required: true },
              { name: "Proof of Spanish address", required: true },
              { name: "University enrollment", required: false },
            ],
            notes: "Can use utility bill or landlord confirmation as address proof",
          },
          {
            step: 3,
            title: "Open Bank Account",
            timeline: "1 week",
            documents: [{ name: "Completed application", required: true }],
            notes: "Student accounts often free or minimal fees",
          },
          {
            step: 4,
            title: "Get Debit Card & Online Banking",
            timeline: "1-2 weeks",
            documents: [{ name: "Account confirmation", required: true }],
            notes: "Card will be mailed. Setup 'Banca Online' for transfers and payments",
          },
        ],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "💼",
        description: "Working rights and finding part-time work in Spain",
        estimatedTotalTime: "Ongoing",
        totalCost: "N/A",
        roleplayScenario: "Practice job interview in Spanish",
        sources: ["Spanish Labour Ministry", "INFOCAM", "Universidades.es"],
        processSteps: [
          {
            step: 1,
            title: "Understand Work Authorization",
            timeline: "Before arrival",
            documents: [{ name: "Student visa conditions", required: true }],
            notes:
              "International students: with work authorization from university. Typically allowed 30 hours/week during studies",
          },
          {
            step: 2,
            title: "Get NIE Number (Foreigner ID)",
            timeline: "Upon arrival (mandatory)",
            documents: [
              { name: "Passport", required: true },
              { name: "University enrollment", required: true },
              { name: "Proof of address", required: true },
            ],
            notes: "Apply at National Police (Policía Nacional) headquarters",
          },
          {
            step: 3,
            title: "Register with Tax Authority (Hacienda)",
            timeline: "Before starting work",
            documents: [{ name: "NIE number", required: true }],
            notes: "Needed for any employment. Get CIF/NIF for tax purposes",
          },
          {
            step: 4,
            title: "Find Student Job",
            timeline: "1-3 months",
            documents: [{ name: "Work authorization", required: true }],
            notes: "Popular: university jobs, tutoring, hospitality, retail (€9-12/hour minimum)",
          },
        ],
      },
      health: {
        id: "health",
        name: "Health & Insurance",
        icon: "⚕️",
        description: "Healthcare system and health insurance for students",
        estimatedTotalTime: "2-3 weeks",
        totalCost: "Free/included in student status",
        roleplayScenario: "Practice doctor appointment in Spanish",
        sources: ["IMSERSO", "Spanish Health System", "Universities Spain"],
        processSteps: [
          {
            step: 1,
            title: "Get Health Insurance Registration",
            timeline: "First month",
            documents: [
              { name: "University enrollment", required: true },
              { name: "NIE number", required: true },
              { name: "Passport", required: true },
            ],
            notes:
              "Spanish public healthcare (SNS) is free for students. Register at local health centre (Centro de Salud)",
          },
          {
            step: 2,
            title: "Register with Family Doctor (Médico de Cabecera)",
            timeline: "First month",
            documents: [{ name: "Health insurance registration", required: true }],
            notes: "Essential for accessing healthcare system",
          },
          {
            step: 3,
            title: "Get Health Card (Tarjeta Sanitaria)",
            timeline: "1-2 weeks",
            documents: [{ name: "Doctor registration confirmation", required: true }],
            notes: "Used for all medical appointments and prescriptions",
          },
          {
            step: 4,
            title: "Get Private Insurance (Optional)",
            timeline: "Anytime",
            documents: [{ name: "NIE number", required: true }],
            notes: "Supplementary insurance covers services not in public system (~€40-100/month)",
          },
        ],
      },
      transport: {
        id: "transport",
        name: "Transport & Travel",
        icon: "🚌",
        description: "Public transportation and student discounts",
        estimatedTotalTime: "1 week",
        totalCost: "€20-50/month (city pass)",
        roleplayScenario: "Practice buying tickets and asking for directions",
        sources: ["Renfe", "Local Transport", "Student Services"],
        processSteps: [
          {
            step: 1,
            title: "Get Local Transport Card",
            timeline: "First month",
            documents: [
              { name: "Student ID", required: true },
              { name: "Photo", required: false },
            ],
            notes:
              "Each city has different system. Madrid: Tarjeta Transporte Público. Barcelona: T-mobilitat",
          },
          {
            step: 2,
            title: "Understand Public Transport System",
            timeline: "First week",
            documents: [{ name: "Transport map", required: false }],
            notes: "Spain: Metro, autobús (bus), tren (train). Apps: Google Maps, MobileTicket",
          },
          {
            step: 3,
            title: "Get Rail Discount Card (Renfe Joven)",
            timeline: "Anytime",
            documents: [
              { name: "Student ID or passport", required: true },
              { name: "Photo", required: false },
            ],
            notes:
              "€20 card gives 25-50% on train tickets for a year. Great for visiting other cities",
          },
          {
            step: 4,
            title: "Download Transport Apps",
            timeline: "1-2 days",
            documents: [{ name: "Smartphone", required: true }],
            notes: "MobileTicket (official app), Citymapper, Moovit for journey planning",
          },
        ],
      },
    },
  },
  nl: {
    country: "Netherlands",
    countryCode: "NL",
    categories: {
      visa: {
        id: "visa",
        name: "Residence Permit",
        icon: "🛂",
        description: "Residence permit and registration in the Netherlands",
        estimatedTotalTime: "2-3 weeks after arrival",
        totalCost: "Free (registration) or €100 (residence permit if required)",
        roleplayScenario: "Practice IND appointment and residence registration",
        sources: ["IND (Immigration)", "DUO", "Nuffic"],
        processSteps: [
          {
            step: 1,
            title: "Get University Offer Letter",
            timeline: "Before arrival",
            documents: [
              { name: "High school diploma/A-Levels", required: true },
              { name: "English language proof (TOEFL/IELTS or equivalent)", required: false },
              { name: "Bachelor's degree (if for Masters)", required: false },
            ],
            notes:
              "Most Dutch universities teach in English. No separate student visa needed for EU",
          },
          {
            step: 2,
            title: "Apply for Residence Permit (if non-EU)",
            timeline: "Before arrival",
            documents: [
              { name: "University acceptance letter", required: true },
              { name: "Proof of financial resources (€934/month)", required: true },
              { name: "Valid passport", required: true },
              { name: "Criminal record certificate", required: false },
            ],
            notes: "Non-EU students need residence permit. Apply through Dutch embassy",
          },
          {
            step: 3,
            title: "Register at Municipality (Gemeente)",
            timeline: "Within 5 days of arrival",
            documents: [
              { name: "Passport", required: true },
              { name: "Proof of accommodation (lease or landlord letter)", required: true },
              { name: "University enrollment confirmation", required: false },
            ],
            notes: "Mandatory for all residents. Get citizen service number (BSN)",
          },
          {
            step: 4,
            title: "Complete IND Residence Permit (non-EU only)",
            timeline: "First month after registration",
            documents: [
              { name: "BSN number (from gemeente)", required: true },
              { name: "Passport", required: true },
              { name: "Photos", required: true },
            ],
            notes: "Finalize residence permit at local IND office",
          },
        ],
      },
      housing: {
        id: "housing",
        name: "Student Housing",
        icon: "🏠",
        description: "Find accommodation in Dutch cities",
        estimatedTotalTime: "2-4 months",
        totalCost: "€300-700/month",
        roleplayScenario: "Practice apartment viewing and negotiation in Dutch",
        sources: ["DUWO", "Student Housing", "Kamernet.nl"],
        processSteps: [
          {
            step: 1,
            title: "Register with University Housing",
            timeline: "4-6 months before arrival",
            documents: [{ name: "University enrollment confirmation", required: true }],
            notes: "DUWO (largest provider). Register early, demand is high",
          },
          {
            step: 2,
            title: "Explore Private Housing",
            timeline: "3-4 months before",
            documents: [{ name: "Budget plan", required: true }],
            notes: "Kamernet.nl, HousingAnywhere, StudentHousing.com - competitive market",
          },
          {
            step: 3,
            title: "Sign Rental Agreement (Huurcontract)",
            timeline: "1-2 weeks",
            documents: [
              { name: "Signed rental agreement", required: true },
              { name: "Passport or ID", required: true },
              { name: "Proof of income or guarantee", required: false },
            ],
            notes: "Dutch contracts are detailed. Understand your rights under Dutch law",
          },
          {
            step: 4,
            title: "Register at New Address (gemeente)",
            timeline: "Within 5 days of move-in",
            documents: [
              { name: "Rental agreement", required: true },
              { name: "Passport", required: true },
            ],
            notes: "Update BSN registration with new address",
          },
        ],
      },
      banking: {
        id: "banking",
        name: "Banking & Finance",
        icon: "🏦",
        description: "Open a Dutch bank account",
        estimatedTotalTime: "1-2 weeks",
        totalCost: "Free or €5-20/month",
        roleplayScenario: "Practice opening bank account in Dutch",
        sources: ["ING", "ABN AMRO", "Bunq"],
        processSteps: [
          {
            step: 1,
            title: "Choose a Bank",
            timeline: "Before or upon arrival",
            documents: [{ name: "Bank comparison", required: false }],
            notes: "Major: ING, ABN AMRO, Rabobank. Digital: Bunq, N26 (allow remote opening)",
          },
          {
            step: 2,
            title: "Prepare Documents",
            timeline: "Before appointment",
            documents: [
              { name: "Passport", required: true },
              { name: "BSN number (after gemeente registration)", required: true },
              { name: "Proof of address", required: true },
            ],
            notes: "Some banks accept online opening without BSN initially",
          },
          {
            step: 3,
            title: "Open Bank Account",
            timeline: "1-2 weeks",
            documents: [{ name: "Completed application", required: true }],
            notes: "Many banks offer student packages with no/minimal fees",
          },
          {
            step: 4,
            title: "Activate Online Banking",
            timeline: "1 week",
            documents: [{ name: "Bank account details", required: true }],
            notes:
              "Essential for Dutch life (all payments online, no cheques). Setup DigiD if possible",
          },
        ],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "💼",
        description: "Working as a student in the Netherlands",
        estimatedTotalTime: "Ongoing",
        totalCost: "N/A",
        roleplayScenario: "Practice job interview in Dutch",
        sources: ["DUO", "UWV", "Dutch Labour Law"],
        processSteps: [
          {
            step: 1,
            title: "Check Work Eligibility",
            timeline: "Before arrival",
            documents: [{ name: "Student status documentation", required: true }],
            notes:
              "EU students: work freely. Non-EU students: allowed to work 56 hours/week or full-time during June-Aug",
          },
          {
            step: 2,
            title: "Register with Tax Authority (Belastingdienst)",
            timeline: "Before starting work",
            documents: [
              { name: "BSN number", required: true },
              { name: "Job contract", required: true },
            ],
            notes: "Get tax ID (Sofinummer). Employer will handle registration",
          },
          {
            step: 3,
            title: "Find Student Job",
            timeline: "1-3 months",
            documents: [{ name: "CV in Dutch/English", required: true }],
            notes:
              "Popular: university jobs, supermarkets, hospitality, tutoring (€12-15/hour minimum)",
          },
          {
            step: 4,
            title: "Understand Tax Obligations",
            timeline: "First tax year",
            documents: [
              { name: "Work contracts", required: true },
              { name: "Payslips", required: true },
            ],
            notes:
              "Students may be exempt from taxes. Register with Belastingdienst annual tax return",
          },
        ],
      },
      health: {
        id: "health",
        name: "Health Insurance",
        icon: "⚕️",
        description: "Mandatory health insurance in the Netherlands",
        estimatedTotalTime: "1-2 weeks",
        totalCost: "€120-150/month",
        roleplayScenario: "Practice doctor appointment in Dutch",
        sources: ["Zorginstituut Nederland", "Ziekenhuizen", "DUO"],
        processSteps: [
          {
            step: 1,
            title: "Get Mandatory Health Insurance",
            timeline: "First month of residence",
            documents: [
              { name: "BSN number", required: true },
              { name: "Proof of residence", required: true },
              { name: "Passport", required: true },
            ],
            notes: "Legally mandatory. Student insurance plans available (€120-150/month)",
          },
          {
            step: 2,
            title: "Choose Insurance Provider",
            timeline: "Before or upon arrival",
            documents: [{ name: "Insurance comparison", required: false }],
            notes: "Major providers: Ziekenhuizen, Zorgverzekeraars (Ziekenhuizen Nederland)",
          },
          {
            step: 3,
            title: "Register with GP (Huisarts)",
            timeline: "First month",
            documents: [
              { name: "Insurance card (when received)", required: true },
              { name: "Proof of address", required: true },
            ],
            notes: "Mandatory to choose a family doctor for referrals",
          },
          {
            step: 4,
            title: "Get Health Insurance Card",
            timeline: "1-2 weeks after registration",
            documents: [{ name: "Insurance confirmation", required: true }],
            notes: "Card needed for all medical services",
          },
        ],
      },
      transport: {
        id: "transport",
        name: "Transport & Travel",
        icon: "🚌",
        description: "Public transport and cycling in the Netherlands",
        estimatedTotalTime: "1 week",
        totalCost: "€50-100/month",
        roleplayScenario: "Practice buying train ticket and cycling directions",
        sources: ["NS (Train)", "Local Transport", "Fietsersbond"],
        processSteps: [
          {
            step: 1,
            title: "Get Public Transport Card (OV-card)",
            timeline: "First week",
            documents: [
              { name: "Student ID or ID card", required: true },
              { name: "€7.50 card cost", required: true },
            ],
            notes: "Rechargeable card for all public transport (trains, trams, buses)",
          },
          {
            step: 2,
            title: "Get Student Train Discount (NS Studentenkaart)",
            timeline: "Upon arrival",
            documents: [
              { name: "Student enrollment", required: true },
              { name: "ID/Passport", required: true },
              { name: "€2 card cost", required: true },
            ],
            notes: "40% discount on most NS (national rail) journeys",
          },
          {
            step: 3,
            title: "Buy/Register Bicycle",
            timeline: "First month",
            documents: [
              { name: "Bike purchase or registration", required: true },
              { name: "Lock and lights (legally required)", required: true },
            ],
            notes: "Biking is primary transport in Netherlands. Get second-hand bike (~€50-100)",
          },
          {
            step: 4,
            title: "Learn Local Transport Routes",
            timeline: "First week",
            documents: [{ name: "Transport app or map", required: false }],
            notes: "Apps: NS app, 9292.nl, Google Maps. Most cities have detailed cycling maps",
          },
        ],
      },
    },
  },
  it: {
    country: "Italy",
    countryCode: "IT",
    categories: {
      visa: {
        id: "visa",
        name: "Student Visa",
        icon: "🛂",
        description: "Italian student visa (Visto di Soggiorno per Studi)",
        estimatedTotalTime: "2-3 months",
        totalCost: "€50-100 (visa fee)",
        roleplayScenario: "Practice visa interview in Italian",
        sources: ["Italian Embassy", "StudyItaly.net", "Ministero Università"],
        processSteps: [
          {
            step: 1,
            title: "Get Italian University Admission",
            timeline: "2-3 months",
            documents: [
              { name: "High school diploma", required: true },
              { name: "Academic transcript", required: true },
              { name: "Language proof (A2 Italian minimum)", required: false },
            ],
            notes: "Apply directly or through StudyItaly portal",
          },
          {
            step: 2,
            title: "Prepare Visa Application",
            timeline: "3-4 weeks",
            documents: [
              { name: "Completed visa application", required: true },
              { name: "Valid passport (min 3 months validity)", required: true },
              { name: "University acceptance letter", required: true },
              { name: "Proof of accommodation", required: true },
              { name: "Proof of financial means (€400/month)", required: true },
              { name: "Medical certificate", required: false },
            ],
            notes: "Apply at nearest Italian embassy/consulate",
          },
          {
            step: 3,
            title: "Attend Visa Interview",
            timeline: "2-4 weeks",
            documents: [
              { name: "All application documents", required: true },
              { name: "Passport", required: true },
            ],
            notes: "Interview required to verify study intentions",
          },
          {
            step: 4,
            title: "Register at Local Municipality (Anagrafe)",
            timeline: "Within 8 days of arrival",
            documents: [
              { name: "Visa stamp in passport", required: true },
              { name: "Proof of residence", required: true },
              { name: "University enrollment", required: true },
            ],
            notes: "Mandatory registration with local authorities",
          },
        ],
      },
      housing: {
        id: "housing",
        name: "Student Housing",
        icon: "🏠",
        description: "Find accommodation in Italian university cities",
        estimatedTotalTime: "2-3 months",
        totalCost: "€250-600/month",
        roleplayScenario: "Practice apartment viewing and negotiation in Italian",
        sources: ["Immobiliare.it", "Subito.it", "Universitari.net"],
        processSteps: [
          {
            step: 1,
            title: "Research Housing Options",
            timeline: "Before arrival",
            documents: [{ name: "University housing list", required: false }],
            notes:
              "Options: University halls (€200-350), Camera ammobiliata/shared room (€250-400), Private flat (€400-800)",
          },
          {
            step: 2,
            title: "Apply for University Halls",
            timeline: "April-May (before September)",
            documents: [
              { name: "University enrollment", required: true },
              { name: "Application form", required: true },
            ],
            notes: "Limited availability. Apply early through university website",
          },
          {
            step: 3,
            title: "Sign Rental Contract (Contratto di Affitto)",
            timeline: "1-2 weeks",
            documents: [
              { name: "Signed contract", required: true },
              { name: "Passport", required: true },
              { name: "Proof of income or guarantee (for private)", required: false },
            ],
            notes: "Italian contracts are detailed. Request copy and understand all terms",
          },
          {
            step: 4,
            title: "Register Address at Anagrafe",
            timeline: "Within 8 days of move-in",
            documents: [
              { name: "Rental contract", required: true },
              { name: "Passport", required: true },
            ],
            notes: "Essential for all legal/administrative purposes",
          },
        ],
      },
      banking: {
        id: "banking",
        name: "Banking & Finance",
        icon: "🏦",
        description: "Open Italian bank account and manage finances",
        estimatedTotalTime: "1-2 weeks",
        totalCost: "Free or €5-10/month",
        roleplayScenario: "Practice opening bank account in Italian",
        sources: ["Intesa SanPaolo", "UniCredit", "Banco BPM"],
        processSteps: [
          {
            step: 1,
            title: "Choose a Bank",
            timeline: "Before or upon arrival",
            documents: [{ name: "Bank comparison", required: false }],
            notes: "Major banks: Intesa SanPaolo, UniCredit, Banco BPM, Poste Italiane",
          },
          {
            step: 2,
            title: "Prepare Documents",
            timeline: "Before appointment",
            documents: [
              { name: "Passport", required: true },
              { name: "University enrollment letter", required: true },
              {
                name: "Proof of address (rental contract or anagrafe registration)",
                required: true,
              },
            ],
            notes: "Student accounts often have zero/minimal fees",
          },
          {
            step: 3,
            title: "Open Bank Account",
            timeline: "1-2 weeks",
            documents: [{ name: "Completed application", required: true }],
            notes: "Most banks issue account immediately",
          },
          {
            step: 4,
            title: "Get Debit Card & Online Banking (Home Banking)",
            timeline: "1 week",
            documents: [{ name: "Bank account confirmation", required: true }],
            notes: "Card by mail. Setup online banking for transfers and payments",
          },
        ],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "💼",
        description: "Working rights and part-time job opportunities",
        estimatedTotalTime: "Ongoing",
        totalCost: "N/A",
        roleplayScenario: "Practice job interview in Italian",
        sources: ["Italian Labour Laws", "INPS", "Agenzia delle Entrate"],
        processSteps: [
          {
            step: 1,
            title: "Understand Work Authorization",
            timeline: "Before arrival",
            documents: [{ name: "Student visa terms", required: true }],
            notes:
              "International students: allowed to work 20 hours/week during studies (unlimited during holidays)",
          },
          {
            step: 2,
            title: "Get Italian Tax Code (Codice Fiscale)",
            timeline: "First month",
            documents: [
              { name: "Passport", required: true },
              { name: "Anagrafe registration confirmation", required: true },
            ],
            notes: "Apply at Agenzia delle Entrate (tax authority). Usually instant",
          },
          {
            step: 3,
            title: "Find Student Job",
            timeline: "1-3 months",
            documents: [{ name: "Work authorization status", required: true }],
            notes:
              "Popular: university jobs, tutoring, bar/restaurant, retail (€8-10/hour minimum)",
          },
          {
            step: 4,
            title: "Register with Social Security (INPS)",
            timeline: "When hired",
            documents: [
              { name: "Job contract", required: true },
              { name: "Codice Fiscale", required: true },
            ],
            notes: "Employer handles registration. Student jobs often casual (no contract)",
          },
        ],
      },
      health: {
        id: "health",
        name: "Health & Insurance",
        icon: "⚕️",
        description: "Healthcare and health insurance in Italy",
        estimatedTotalTime: "2-3 weeks",
        totalCost: "Free via public health system",
        roleplayScenario: "Practice doctor appointment in Italian",
        sources: ["Servizio Sanitario Nazionale", "ASL", "Universities Italy"],
        processSteps: [
          {
            step: 1,
            title: "Register with National Health Service (SSN)",
            timeline: "Within 30 days of arrival",
            documents: [
              { name: "Passport", required: true },
              { name: "Anagrafe registration", required: true },
              { name: "University enrollment", required: true },
            ],
            notes: "Public healthcare is free for students. Register at local ASL office",
          },
          {
            step: 2,
            title: "Get Health Card (Tessera Sanitaria)",
            timeline: "2-3 weeks",
            documents: [{ name: "SSN registration confirmation", required: true }],
            notes: "Used for all doctor visits and prescriptions",
          },
          {
            step: 3,
            title: "Register with Family Doctor (Medico di Base)",
            timeline: "First month",
            documents: [
              { name: "Health card (once received) or registration proof", required: true },
            ],
            notes: "Choose from list of doctors. Referrals needed for specialists",
          },
          {
            step: 4,
            title: "Visit University Health Center (optional)",
            timeline: "As needed",
            documents: [{ name: "Student ID", required: true }],
            notes: "Most universities have free health clinics for students",
          },
        ],
      },
      transport: {
        id: "transport",
        name: "Transport & Travel",
        icon: "🚌",
        description: "Public transportation and student travel discounts",
        estimatedTotalTime: "1 week",
        totalCost: "€20-50/month (city), €50-120 (national)",
        roleplayScenario: "Practice buying train tickets and asking directions",
        sources: ["Trenitalia", "Local Transport", "Student Services"],
        processSteps: [
          {
            step: 1,
            title: "Get Local Transport Card",
            timeline: "First month",
            documents: [
              { name: "Student ID", required: true },
              { name: "Photo", required: false },
            ],
            notes: "Each city has different system. Rome: ATAC, Milan: ATM, Florence: ATAF",
          },
          {
            step: 2,
            title: "Understand Local Transport",
            timeline: "First week",
            documents: [{ name: "Transport map", required: false }],
            notes:
              "Italy: Metro, tram, bus, regional trains. Apps: Google Maps, Citymapper, Moovit",
          },
          {
            step: 3,
            title: "Get National Train Discount (Carta Giovani)",
            timeline: "Anytime",
            documents: [
              { name: "Student ID or passport", required: true },
              { name: "Photo", required: false },
            ],
            notes:
              "Student train card gives 10-50% discount on Trenitalia and regional trains (~€10/year)",
          },
          {
            step: 4,
            title: "Download Travel Apps",
            timeline: "1-2 days",
            documents: [{ name: "Smartphone", required: true }],
            notes: "Trenitalia app, Flixbus (intercity), local city transport apps",
          },
        ],
      },
    },
  },
};
