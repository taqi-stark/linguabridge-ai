export interface ResourceLink {
  title: string;
  url: string;
  description: string;
}

export interface GuideCategoryBlog {
  id: string;
  name: string;
  icon: string; // Lucide icon name, e.g. "Passport"
  description: string;
  markdownContent?: string;
  links: ResourceLink[];
  roleplayScenario?: string;
}

export interface CountryBlogGuide {
  country: string;
  countryCode: string;
  categories: Record<string, GuideCategoryBlog>;
}

export const studentGuideBlogData: Record<string, CountryBlogGuide> = {
  de: {
    country: "Germany",
    countryCode: "DE",
    categories: {
      visa: {
        id: "visa",
        name: "Student Visa",
        icon: "Passport",
        description: "AI-Powered personalized visa guide for Germany.",
        links: [
          { title: "Make it in Germany", url: "https://www.make-it-in-germany.com", description: "Official Federal Government Portal for professionals and students." },
          { title: "Fintiba (Blocked Account)", url: "https://www.fintiba.com", description: "Fastest way to set up your mandatory blocked account (Sperrkonto)." }
        ],
        roleplayScenario: "Practice your German visa interview with the border officer.",
      },
      housing: {
        id: "housing",
        name: "Housing",
        icon: "Building",
        description: "Find your ideal accommodation in Germany.",
        markdownContent: "Finding housing in Germany is highly competitive and often the biggest challenge for international students. Expect to spend 1 to 3 months searching.\n\n### Types of Accommodation\n- **Studentenwohnheim (Student Dorms):** Managed by the *Studierendenwerk*, these are the cheapest option (€200-€400/month). You must apply months in advance as waitlists are incredibly long.\n- **WG (Wohngemeinschaft):** Sharing an apartment with other students. Use platforms like WG-Gesucht. You will likely go through a 'WG-Casting' where current flatmates interview you to see if you fit their vibe.\n- **Private studio:** The most expensive option (€500-€900+ depending on the city).\n\n### The 'Anmeldung' (Registration)\nIn Germany, you are legally obligated to register your address (Anmeldung) at the local Citizens' Office (*Bürgeramt*) within 14 days of moving in. Without this document (*Meldebescheinigung*), you cannot open a bank account, sign a long-term phone contract, or get your tax ID.",
        links: [
          { title: "WG-Gesucht", url: "https://www.wg-gesucht.de", description: "Largest ad portal for shared flats (WGs) in Germany." },
          { title: "ImmobilienScout24", url: "https://www.immobilienscout24.de", description: "Main platform for private apartments and long-term renting." }
        ],
        roleplayScenario: "Practice asking questions during a flat viewing (WG-Casting) to impress your future roommates.",
      },
      banking: {
        id: "banking",
        name: "Banking",
        icon: "Landmark",
        description: "Open your German Girokonto.",
        markdownContent: "Germany operates heavily on a specific type of local debit system known as the *Girocard* (formerly EC-Karte). Many smaller supermarkets, bakeries, and government offices do not accept Visa or Mastercard, so having a Girocard is essential.\n\n### Opening your account\nAs an enrolled student, most traditional banks like Deutsche Bank, Sparkasse, and Commerzbank offer a free student account (*Studenten-Girokonto*). You will need:\n- Your Passport/ID\n- Your University Enrollment Certificate (*Immatrikulationsbescheinigung*)\n- Your City Registration (*Meldebescheinigung*)\n\n### Mobile Banks\nFor immediate setup upon arrival, banks like N26 and Revolut are extremely popular because they offer English-first apps and require no physical branch visits. However, note that N26 issues a Mastercard Debit, which might not be accepted by legacy merchants who only take Girocard.",
        links: [
          { title: "N26", url: "https://n26.com", description: "Top English-friendly mobile bank, zero fees for basic accounts." },
          { title: "Deutsche Bank", url: "https://www.deutsche-bank.de", description: "Largest traditional German bank offering free student accounts." }
        ],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "Briefcase",
        description: "Work regulations for international students.",
        markdownContent: "Germany has specific, strict rules regarding student employment. Non-EU students hold a residence permit that allows them to work precisely 120 full days or 240 half days per calendar year.\n\n### Minijobs\nA 'Minijob' is an employment setup where you earn up to €538 per month. The massive benefit of a Minijob is that it is completely tax-free and exempt from social security contributions for the employee. Many students work in cafes, delivery, or retail under this scheme.\n\n### Working Student (Werkstudent)\nIf you want to gain professional experience, you can work as a *Werkstudent* in a corporation or startup. During the semester, you are allowed to work a maximum of 20 hours per week (to maintain your full-time student status for health insurance). During semester breaks, you can work full-time (40 hours).",
        links: [
          { title: "Make it in Germany Job Market", url: "https://www.make-it-in-germany.com/en/working-in-germany", description: "Official guidelines on working alongside your studies." }
        ],
        roleplayScenario: "Practice a part-time job interview at a local bakery or tech startup.",
      },
      health: {
        id: "health",
        name: "Healthcare",
        icon: "Heart",
        description: "Navigating the mandatory public health insurance.",
        markdownContent: "Health insurance is absolutely mandatory in Germany. You cannot enroll at a university without presenting proof of valid health insurance.\n\n### Public Insurance\nIf you are under 30 years old, you are eligible for the discounted public student health insurance (*gesetzliche Krankenversicherung*). Providers like TK, AOK, and Barmer charge a legally fixed rate (currently around €120 - €130 per month). This covers almost everything: doctor visits, hospital stays, basic dental care, and prescriptions (you only pay a tiny copay of €5-€10 for medicine).\n\n### How it works\nOnce registered, you will receive a Health Insurance Card (*Versichertenkarte*) with an NFC chip in the mail. Whenever you visit any doctor or hospital, you simply hand them this card—there are generally no upfront payments and no complicated reimbursement claims. It is an incredibly efficient system.",
        links: [
          { title: "Techniker Krankenkasse (TK)", url: "https://www.tk.de", description: "Germany's largest public health insurer, highly popular among international students." }
        ],
      },
      transport: {
        id: "transport",
        name: "Transport",
        icon: "Train",
        description: "Trains, subways, and the Deutschlandticket.",
        markdownContent: "Germany boasts a highly developed public transit network consisting of U-Bahn (Subway), S-Bahn (Suburban train), Tram, and Bus.\n\n### The Semesterticket & Deutschlandticket\nWhen you pay your semester contribution to the university, you usually receive a *Semesterticket*. Recently, many universities have upgraded this to a discounted student version of the **Deutschlandticket**. The Deutschlandticket allows you to use ALL regional and local transport (buses, trams, subways, and regional trains) anywhere in Germany for free!\n\n### Long Distance Travel\nIf you want to travel between major cities (e.g., Berlin to Munich), you must use high-speed trains like the ICE (Intercity-Express) operated by Deutsche Bahn (DB). The Deutschlandticket is **not** valid on ICE trains. Always book ICE tickets well in advance via the DB Navigator app to get 'Super Sparpreis' discounts.",
        links: [
          { title: "DB Navigator", url: "https://int.bahn.de/en", description: "The definitive app for routing and buying tickets for local and national trains." }
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
        icon: "Passport",
        description: "AI-Powered personalized visa guide for the UK.",
        roleplayScenario: "Practice your UK Border control interview.",
        links: [{ title: "UK Visas", url: "https://www.gov.uk/student-visa", description: "Official UK government student visa portal." }],
      },
      housing: {
        id: "housing",
        name: "Housing",
        icon: "Building",
        description: "Halls of residence and private renting.",
        markdownContent: "UK universities guarantee 'Halls of Residence' almost exclusively for 1st-year undergraduates. Master's students and continuing undergrads usually rent privately.\n\n### HMO Houses\nA House in Multiple Occupation (HMO) is the standard student living situation. You rent a 4-6 bedroom house in a student neighborhood with friends. Rent is usually advertised per week (pw) rather than per month.\n\n### Guarantors\nUK landlords strictly require a UK-based financial guarantor (someone earning a specific salary in the UK) to co-sign the lease. If you are an international student without a UK-based person to act as your guarantor, you are commonly forced to pay 6 to 12 months of rent upfront. Alternatively, you can use paid guarantor services like HousingHand.",
        links: [{ title: "SpareRoom", url: "https://www.spareroom.co.uk", description: "The premier portal to find sublets, roommates, and shared housing." }],
      },
      banking: {
        id: "banking",
        name: "Banking",
        icon: "Landmark",
        description: "Open a UK bank account.",
        markdownContent: "To receive wages or pay bills easily, you need a UK 'Sort Code' and 'Account Number'. \n\n### The traditional route\nHigh street banks like Lloyds, HSBC, and Barclays offer student accounts. They require extensive documentation including a 'Bank Letter' physically stamped by your university registry, and proof of your UK address.\n\n### Disrupter Banks\nDigital banks like Monzo and Starling have revolutionized banking in the UK. You can open an account in 10 minutes from your phone using just your passport and BRP (Biometric Residence Permit). They offer zero-fee accounts with excellent budget-tracking apps.",
        links: [{ title: "Monzo", url: "https://monzo.com", description: "The most popular digital challenger bank in the UK." }],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "Briefcase",
        description: "National Insurance Numbers and working limits.",
        markdownContent: "If studying at degree level on a Student Route visa, you are legally restricted to working a strict maximum of 20 hours per week during term-time. Working 20 hours and 1 minute is a violation of immigration law that can lead to deportation.\n\n### Realities of finding work\nStudent-oriented cities have vast hospitality and retail sectors hungry for part-time workers. Finding work as a barista, bartender, or retail assistant is generally straightforward.\n\n### National Insurance\nBefore you can start getting paid, you must apply for a National Insurance (NI) Number. This uniquely tracks your tax contributions. You can apply for this online via Gov.uk as soon as you enter the country.",
        links: [{ title: "Apply for NI Number", url: "https://www.gov.uk/apply-national-insurance-number", description: "Official portal to apply for your NI number." }],
      },
      health: {
        id: "health",
        name: "Healthcare",
        icon: "Heart",
        description: "Access the National Health Service (NHS).",
        markdownContent: "Upon receiving your visa, you pay the Immigration Health Surcharge (IHS). This hefty upfront fee grants you full, free access to the world-renowned National Health Service (NHS) for the duration of your visa.\n\n### General Practitioners (GP)\nThe very first thing you must do upon arriving in the UK is register with a local GP surgery. You cannot easily see a doctor if you are not registered. All non-emergency medical issues are handled by your GP.\n\n### Prescriptions and Emergencies\nVisits to the doctor, hospital treatments, and ambulance services are 100% free at the point of use. If you need medicine, you will pay a flat prescription fee (around £9.65 in England, but free in Scotland/Wales) at the pharmacy regardless of the actual cost of the drug.",
        links: [{ title: "Find a GP", url: "https://www.nhs.uk/service-search/find-a-gp", description: "Search for NHS GPs accepting new patients near your postcode." }],
      },
      transport: {
        id: "transport",
        name: "Transport",
        icon: "Train",
        description: "Railcards and local buses.",
        markdownContent: "The UK relies heavily on privately operated regional bus networks and a franchised national rail system.\n\n### Student Discounts\nYou must buy a 16-25 Railcard (or 26-30 Railcard). It costs £30 a year but gives you a massive 1/3 off all national train tickets. If you take trains more than twice a year, it pays for itself instantly.\n\n### Local Transit\nIn London, use the TfL Oyster Card or contactless payments for the Tube and buses (get an 18+ Student Oyster for 30% off travelcards). In other cities, buses are managed by companies like Stagecoach or FirstBus, and you can buy heavily discounted student term passes directly through their mobile apps.",
        links: [{ title: "Trainline", url: "https://www.thetrainline.com", description: "The best app to check train schedules and buy digital tickets." }],
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
        icon: "Passport",
        description: "AI-Powered personalized visa guide for France.",
        links: [{ title: "Campus France", url: "https://www.campusfrance.org", description: "The ultimate official hub for studying in France." }],
      },
      housing: {
        id: "housing",
        name: "Housing & CAF",
        icon: "Building",
        description: "CROUS dorms, Visale, and housing aid.",
        markdownContent: "French bureaucracy surrounding housing is infamously dense. It is highly recommended to finalize housing before arriving.\n\n### CROUS and Private rentals\nThe government run 'CROUS' dorms are cheap and reliable, but strictly prioritized for scholarship students. If renting privately, French landlords demand extensive dossiers (proof of income, guarantor details, ID).\n\n### The 'Visale' system\nMost landlords demand a French financial guarantor. The government offers 'Visale', an absolutely free scheme where the French state acts as your guarantor. You must apply for the Visale certificate online before signing a lease.\n\n### CAF (Housing Subsidy)\nOne of the biggest perks of studying in France is 'CAF' or 'APL' (Aide Personnalisée au Logement). The French government subsidizes a portion of your rent (sometimes up to €200/month) based on your income, regardless of your nationality! Apply on the CAF website immediately after getting your lease.",
        links: [{ title: "Visale", url: "https://www.visale.fr", description: "Free government-backed guarantor service." }, { title: "CAF", url: "https://www.caf.fr", description: "Portal to apply for your housing benefit." }],
      },
      banking: {
        id: "banking",
        name: "Banking",
        icon: "Landmark",
        description: "Open a French RIB.",
        markdownContent: "Having a French bank account is practically mandatory. You will need what is called a RIB (Relevé d'Identité Bancaire)—a piece of paper detailing your IBAN. Landlords need a RIB to withdraw rent, and CAF needs a RIB to deposit your housing aid.\n\n### Navigating Banks\nTraditional banks like Société Générale, BNP Paribas, and LCL frequently offer large cash bonuses (e.g., €80 free money) to students just for opening an account. However, setting them up requires a physical appointment and dealing with intense French paperwork.\nAlternatively, digital European banks like N26 or local challengers like Lydia offer instantaneous setup, but ensure your landlord accepts a non-French IBAN if you use N26 (though legally they must, some still refuse).",
        links: [],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "Briefcase",
        description: "Working in France as a student.",
        markdownContent: "French student visas explicitly authorize you to take on part-time employment to supplement your income.\n\n### Limits and Wages\nYou are allowed to work up to 964 hours per year, which equates to exactly 60% of the legal annual working time in France. France has a strictly enforced national minimum wage known as the SMIC. Your student job must legally pay you at least the hourly SMIC rate, ensuring fair compensation regardless of the job type.",
        links: [],
      },
      health: {
        id: "health",
        name: "Healthcare",
        icon: "Heart",
        description: "L'Assurance Maladie and Carte Vitale.",
        markdownContent: "France boasts one of the most generous healthcare systems in the world, and as an international student, you are fully integrated into it.\n\n### Inscription\nRegistration with 'L'Assurance Maladie' (The French Social Security system) is completely free for all students. You must register online via the specific student portal as soon as you are enrolled.\n\n### The Carte Vitale\nMonths after registering, you will receive a green 'Carte Vitale'. When you visit a doctor, they swipe this card. Usually, the state reimburses 70% of the consultation fee directly into your bank account. To cover the remaining 30%, students often purchase a cheap private 'Mutuelle' (top-up insurance) for €15-€30 a month, making healthcare effectively 100% free.",
        links: [{ title: "Ameli etudiant", url: "https://etudiant-etranger.ameli.fr", description: "The portal to register for free Social Security." }],
      },
      transport: {
        id: "transport",
        name: "Transport",
        icon: "Train",
        description: "SNCF and city metros.",
        markdownContent: "France's national pride is the TGV (Train à Grande Vitesse), high-speed rail that blankets the country.\n\n### SNCF Carte Avantage\nIf you take the train occasionally, you must purchase the 'Carte Avantage Jeune' from SNCF. It costs around €49 per year and permanently locks in massive 30% discounts and price caps on all high-speed trains.\n\n### Metro and Tramways\nLocal city transit is excellent. Cities like Paris, Lyon, and Strasbourg offer highly subsidized annual transport passes for residents under 26. In Paris, the 'Imagine R' pass gives you unlimited, unrestricted transit access across the entire Île-de-France region for a fraction of the adult price.",
        links: [{ title: "SNCF Connect", url: "https://www.sncf-connect.com", description: "Official app to buy high-speed train tickets." }],
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
        icon: "Passport",
        description: "AI-Powered personalized visa guide for Italy.",
        links: [{ title: "Universitaly", url: "https://www.universitaly.it", description: "Official pre-enrollment platform for Italian universities." }],
      },
      housing: {
        id: "housing",
        name: "Housing",
        icon: "Building",
        description: "Finding accommodation and avoiding scams.",
        markdownContent: "Student dormitories exist via the regional body (EDISU/DSU), but they are heavily income-tested and extremely hard to get. The vast majority of international students rent private rooms in shared apartments.\n\n### The 'Contratto Regolare'\nYou absolutely must ensure your landlord offers a 'contratto d'affitto regolare' (registered rental contract). Without a legally registered contract, it is impossible to apply for your Residency Permit (*Permesso di Soggiorno*). Be extremely cautious of landlords offering lower rent for an unregistered 'black market' contract.",
        links: [{ title: "Immobiliare", url: "https://www.immobiliare.it", description: "Italy's primary real estate platform for rentals." }],
      },
      banking: {
        id: "banking",
        name: "Banking",
        icon: "Landmark",
        description: "Get an Italian bank account.",
        markdownContent: "Opening a traditional Italian bank account (e.g., Intesa Sanpaolo, UniCredit) can be bureaucratic. \n\n### Codice Fiscale\nThe absolute prerequisite for a bank account—and practically everything else in Italy—is your Tax Code (*Codice Fiscale*). You must go to the *Agenzia delle Entrate* (Revenue Agency) to request this paper document immediately upon arrival. Once you have it, opening an account is smooth.",
        links: [],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "Briefcase",
        description: "Working rules for Italian student visas.",
        markdownContent: "Student residence permits allow you to work part-time. The legal limit is a maximum of 20 hours per week, up to a strict limit of 1,040 hours per year.\n\nFinding English-speaking part-time jobs in Italy can be very challenging outside of massive tourist hubs (Rome, Florence, Milan, Venice). Speaking at least B1 Italian is highly recommended for retail or service sectors.",
        links: [],
      },
      health: {
        id: "health",
        name: "Healthcare",
        icon: "Heart",
        description: "Servizio Sanitario Nazionale (SSN).",
        markdownContent: "As a non-EU student, you have two options: buy cheap private insurance just for emergencies (often required for the visa), or voluntarily register with the national healthcare service (SSN).\n\n### SSN Registration\nRegistering for the SSN is highly recommended. You pay a heavily discounted flat fee (traditionally €149 per calendar year, though local rates may vary recently). This grants you absolute full coverage identical to an Italian citizen, including a dedicated General Practitioner (*Medico di Base*) and near-free medicine.",
        links: [],
      },
      transport: {
        id: "transport",
        name: "Transport",
        icon: "Train",
        description: "Trenitalia and local buses.",
        markdownContent: "Italy's national train network (Trenitalia and the private competitor Italo) connects the entire peninsula rapidly.\n\n### Local Transport\nCity transit relies heavily on bus networks and trams. Almost every major Italian city offers drastically reduced annual or monthly transit passes specifically subsidized for enrolled university students. You typically buy these at the primary transport office showing your student ID.",
        links: [{ title: "Trenitalia", url: "https://www.trenitalia.com", description: "The national rail operator." }],
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
        icon: "Passport",
        description: "AI-Powered personalized visa guide for Spain.",
        links: [{ title: "Study in Spain", url: "http://www.studyinspain.info/en/", description: "Portal." }],
      },
      housing: {
        id: "housing",
        name: "Housing",
        icon: "Building",
        description: "Finding flats and TIE registration.",
        markdownContent: "You will spend your first few weeks looking for 'Pisos Compartidos' (shared apartments).\n\n### Empadronamiento\nThe most critical administrative step in Spain is the *Empadronamiento*. Once you rent a room, you must register your address at the local Town Hall (*Ayuntamiento*). You cannot get your physical residency card (TIE) without the 'Padron' certificate. Some unscrupulous landlords refuse to let you register—never rent a room if they say 'Sin Padron'.",
        links: [{ title: "Idealista", url: "https://www.idealista.com", description: "The undisputed king of Spanish property portals." }],
      },
      banking: {
        id: "banking",
        name: "Banking",
        icon: "Landmark",
        description: "Open a Spanish bank account.",
        markdownContent: "Spain is a hybrid card/cash society, but 'Bizum' (an instantaneous peer-to-peer money transfer system integrated into banking apps) is universally used to split bills. You absolutely need a Spanish bank account to use Bizum.\n\nYou usually need your NIE (Foreigner Identity Number) and an acceptance letter to open a free 'Cuenta Joven' (Youth Account) at banks like Santander or BBVA.",
        links: [],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "Briefcase",
        description: "Working while studying.",
        markdownContent: "Historically restrictive, Spanish student visas now allow up to 30 hours of work per week, provided the employment schedule is compatible with your study hours. Your employer must ensure the contract explicitly reflects this.",
        links: [],
      },
      health: {
        id: "health",
        name: "Healthcare",
        icon: "Heart",
        description: "Spanish health insurance.",
        markdownContent: "Unlike Germany or France, non-EU students residing in Spain on a study visa do NOT qualify for the public healthcare system. \n\n### Private Insurance Mandate\nTo obtain your visa and TIE, you are legally obligated to purchase a comprehensive private Spanish health insurance policy (e.g., Sanitas, Adeslas). Vitally, this policy must have NO copayments (sin copagos) and NO coverage limits (sin carencias), ensuring full repatriation.",
        links: [],
      },
      transport: {
        id: "transport",
        name: "Transport",
        icon: "Train",
        description: "Renfe and city metros.",
        markdownContent: "Spain features magnificent public transport infrastructure.\n\n### The Abono Joven\nIn the Community of Madrid, if you are under 26, the legendary *Abono Joven* allows you completely unlimited access to the entire metro, bus, and suburban rail network across the entire region for incredibly cheap (often €10-€20 a month). Other regions offer similar highly subsidized student passes.",
        links: [{ title: "Renfe", url: "https://www.renfe.com", description: "National high-speed train networks." }],
      },
    },
  },
  nl: {
    country: "Netherlands",
    countryCode: "NL",
    categories: {
      visa: {
        id: "visa",
        name: "Student Visa",
        icon: "Passport",
        description: "AI-Powered personalized visa guide for the Netherlands.",
        links: [{ title: "Study in Holland", url: "https://www.studyinholland.nl", description: "Official portal." }],
      },
      housing: {
        id: "housing",
        name: "Housing",
        icon: "Building",
        description: "Kamernet and BSN Registration.",
        markdownContent: "### The Housing Crisis\nThe Netherlands is experiencing a profound housing crisis. It is common to search for 6+ months for a room. Universities actively advise international students: 'If you haven't found housing by August, do not come.'\n\n### The BSN\nJust like Germany's Anmeldung, you must register your address at the municipality (*Gemeente*) to receive your *Burgerservicenummer* (BSN). You cannot open a bank account or legally work without a BSN. Therefore, you must find a room where you are legally allowed to register.",
        links: [{ title: "Kamernet", url: "https://kamernet.nl", description: "Premium subscription-based portal for student rooms." }],
      },
      banking: {
        id: "banking",
        name: "Banking",
        icon: "Landmark",
        description: "Dutch bank accounts and iDEAL.",
        markdownContent: "The entire country relies on an online payment system called 'iDEAL'. You cannot easily pay rent, buy train tickets online, or order food without iDEAL. \n\niDEAL requires a Dutch bank account. ABN AMRO and ING offer straightforward free student accounts, provided you have a valid BSN from your municipality.",
        links: [],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "Briefcase",
        description: "Working regulations and permits.",
        markdownContent: "Non-EU students face strict regulations. You can choose to work a maximum of 16 hours per week year-round, OR you can work full-time exclusively during the summer months (June–August). \n\nCrucially, your employer MUST apply for a specific work permit (TWV) on your behalf. This is an administrative hurdle that makes some employers reluctant to hire non-EU students for casual part-time work.",
        links: [],
      },
      health: {
        id: "health",
        name: "Healthcare",
        icon: "Heart",
        description: "Zorgverzekering obligations.",
        markdownContent: "The Dutch healthcare rule is complex:\n\n1. If you are ONLY studying, you keep your private/international student health insurance (like AON Student Insurance).\n2. If you take ANY paid job or a paid internship—even for 1 hour a week—you become legally obligated under Dutch law to take out basic Dutch public health insurance (*Basisverzekering*). This costs about €130-€140 a month. However, if you are forced to buy it, you are usually also eligible for the *Zorgtoeslag* (Healthcare Allowance) from the government, which pays most of it back.",
        links: [],
      },
      transport: {
        id: "transport",
        name: "Transport",
        icon: "Train",
        description: "Bikes and the OV-chipkaart.",
        markdownContent: "### Bicycles\nDo not bother with buses for local transit. Buy a cheap second-hand bike immediately, or get a Swapfiets (monthly bike subscription). The infrastructure is perfect, it is safe, and it is how 99% of students commute.\n\n### OV-chipkaart\nFor trains between cities, you must purchase a personal *OV-chipkaart*. You tap in and tap out at train stations. Non-EU students do not typically get the free transit pass that Dutch students receive, but you can buy discount subscriptions from NS (Dutch Railways) allowing 40% off off-peak travel.",
        links: [{ title: "NS", url: "https://www.ns.nl/en", description: "Dutch Railways for intercity train schedules." }],
      },
    },
  },
  us: {
    country: "United States",
    countryCode: "US",
    categories: {
      visa: {
        id: "visa",
        name: "Student Visa",
        icon: "Passport",
        description: "AI-Powered personalized visa guide for the United States.",
        links: [{ title: "Study in the States", url: "https://studyinthestates.dhs.gov", description: "Official DHS portal." }],
      },
      housing: {
        id: "housing",
        name: "Housing",
        icon: "Building",
        description: "Dorms and off-campus leasing.",
        markdownContent: "U.S. universities heavily focus on on-campus dormitories for first-year students, but off-campus leasing is standard afterward.\n\n### Form I-20 and Leasing\nTo lease an apartment off-campus, you will typically need to show your F-1 Visa and Form I-20 as proof of legal residency. Landlords usually run credit checks (SSN required), but since international students lack a U.S. credit history, you will almost always be required to pay a higher security deposit (often 1-2 months of rent) or provide a guarantor.",
        links: [],
      },
      banking: {
        id: "banking",
        name: "Banking",
        icon: "Landmark",
        description: "Opening a US Checking Account.",
        markdownContent: "In the U.S., you will primarily use a 'Checking Account' with a Debit Card. Cash is rarely used.\n\n### Requirements\nMost major banks (Chase, Bank of America, Wells Fargo) allow you to open a student checking account *without* a Social Security Number (SSN). You will simply need your Passport, Form I-20, and proof of address.",
        links: [],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "Briefcase",
        description: "F-1 Visa employment strictly limited.",
        markdownContent: "Under an F-1 visa, your employment options are incredibly restricted.\n\n### On-Campus Only\nYou are legally authorized to work **only on-campus** for a maximum of 20 hours per week during the school term. Off-campus employment is strictly illegal unless you receive authorization under CPT (Curricular Practical Training) or severe economic hardship, which requires USCIS approval.",
        links: [],
      },
      health: {
        id: "health",
        name: "Healthcare",
        icon: "Heart",
        description: "Mandatory university health plans.",
        markdownContent: "Healthcare in the United States is entirely private and notoriously expensive.\n\n### University Health Plans\nAlmost all US universities categorically mandate that you purchase their specific Student Health Insurance Plan (SHIP) to enroll. This can aggressively cost $2,000–$4,000 per year. You can sometimes waive this if you prove you purchased an alternate private plan that exactly meets perfectly strict coverage minimums (e.g., ISO Insurance).",
        links: [],
      },
      transport: {
        id: "transport",
        name: "Transport",
        icon: "Train",
        description: "Cars and campus shuttles.",
        markdownContent: "Unlike Europe, most US cities outside the Northeast corridor severely lack robust public transit.\n\nExcept in massive cities like NYC, Chicago, or Boston, you will rely entirely on free campus shuttles, bicycles, or purchasing a used car. If you buy a car, obtaining a state Driver's License and extremely expensive auto insurance is legally required.",
        links: [],
      },
    },
  },
  ca: {
    country: "Canada",
    countryCode: "CA",
    categories: {
      visa: {
        id: "visa",
        name: "Study Permit",
        icon: "Passport",
        description: "AI-Powered personalized study permit guide.",
        links: [{ title: "IRCC Portal", url: "https://www.canada.ca/en/immigration-refugees-citizenship.html", description: "Official Canadian immigration portal." }],
      },
      housing: {
        id: "housing",
        name: "Housing",
        icon: "Building",
        description: "Basement suites and rentals.",
        markdownContent: "Canada has a mix of University Residences and private renters.\n\n### Off-Campus Renting\nIn major cities like Toronto and Vancouver, rents are astronomically high. International students frequently rent 'Basement Suites' in suburban houses. Always ensure you sign a standard provincial lease (e.g., Ontario Standard Lease) to protect your tenant rights.",
        links: [],
      },
      banking: {
        id: "banking",
        name: "Banking",
        icon: "Landmark",
        description: "Interac e-Transfer.",
        markdownContent: "Opening a student account at the 'Big Five' banks (RBC, TD, Scotiabank, BMO, CIBC) is trivial and usually free. \n\n### Interac e-Transfer\nThe backbone of Canadian payments is *Interac e-Transfer*, which allows you to send money instantly using just a person's email address or phone number. You will pay rent and share bills exactly this way.",
        links: [],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "Briefcase",
        description: "Off-campus work limits and SIN.",
        markdownContent: "Canadian Study Permits generously allow you to work off-campus. Recently, rules have fluctuated, but generally, you can work up to 20 hours per week during the semester and full-time during breaks.\n\nTo be paid, you must apply for a Social Insurance Number (SIN) at a Service Canada office.",
        links: [],
      },
      health: {
        id: "health",
        name: "Healthcare",
        icon: "Heart",
        description: "Provincial Health Insurance.",
        markdownContent: "Healthcare is publicly funded, but eligibility for international students strictly depends on the province.\n\nIn British Columbia (MSP) and Alberta (AHCIP), international students are generally covered completely under the free provincial health system. Conversely, in Ontario, international students are categorically excluded from OHIP and must purchase UHIP through their university.",
        links: [],
      },
      transport: {
        id: "transport",
        name: "Transport",
        icon: "Train",
        description: "TTC and regional transit.",
        markdownContent: "Transit depends highly on your city. In Toronto, the TTC covers subways and buses. Vancouver relies heavily on the SkyTrain. Universities universally negotiate heavily discounted 'U-Pass' transit cards included in your tuition fees.",
        links: [],
      },
    },
  },
  au: {
    country: "Australia",
    countryCode: "AU",
    categories: {
      visa: {
        id: "visa",
        name: "Student Visa",
        icon: "Passport",
        description: "AI-Powered personalized visa guide.",
        links: [{ title: "Home Affairs", url: "https://immi.homeaffairs.gov.au", description: "Official department." }],
      },
      housing: {
        id: "housing",
        name: "Housing",
        icon: "Building",
        description: "Share houses and flatmates.",
        markdownContent: "### Sharehouses\nRenting an entire house is difficult and incredibly expensive. You will likely rely heavily on apps like *Flatmates.com.au* to find an established 'Sharehouse'. Rent is widely quoted weekly (e.g., $300/pw). Be intensely aware of scams requesting massive 'bonds' before seeing the property.",
        links: [],
      },
      banking: {
        id: "banking",
        name: "Banking",
        icon: "Landmark",
        description: "The Big Four and TFN.",
        markdownContent: "The 'Big Four' banks (CBA, Westpac, ANZ, NAB) dominate. You can actually set up your account online up to 3 months before even arriving in Australia, then identify yourself in a branch upon landing to activate it.\n\n### File Number\nSimultaneously, you will explicitly need a Tax File Number (TFN) from the ATO.",
        links: [],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "Briefcase",
        description: "Generous work conditions & high wages.",
        markdownContent: "Australia allows international students to work up to 48 hours per fortnight (2 weeks) during the academic term, and unlimited hours during recognized breaks.\n\nAustralia famously has one of the highest true minimum wages globally. However, ensure you are not paid 'cash in hand' below the legal Award rate (wage theft is common in hospitality towards international students).",
        links: [],
      },
      health: {
        id: "health",
        name: "Healthcare",
        icon: "Heart",
        description: "OSHC (Overseas Student Health Cover).",
        markdownContent: "You categorically cannot receive an Australian Student Visa (Subclass 500) without prepaying for OSHC for the complete, exact duration of your visa.\n\nOSHC providers (Bupa, Medibank, Allianz) cover doctor visits to the Medicare Benefit Schedule (MBS) level and public hospital admissions. It is a strictly private system acting like public Medicare.",
        links: [],
      },
      transport: {
        id: "transport",
        name: "Transport",
        icon: "Train",
        description: "Opal Cards, Myki, and GoCards.",
        markdownContent: "Each state aggressively maintains its own segregated smartcard system. Sydney uses the 'Opal' card, Melbourne uses the intensely polarizing 'Myki', and Brisbane uses 'GoCard'.\n\nUnlike domestic students, international students unfortunately rarely receive massive public transit concessions (e.g. in NSW and VIC), which leads to high travel costs.",
        links: [],
      },
    },
  },
  jp: {
    country: "Japan",
    countryCode: "JP",
    categories: {
      visa: {
        id: "visa",
        name: "Student Visa",
        icon: "Passport",
        description: "AI-Powered personalized visa guide.",
        links: [],
      },
      housing: {
        id: "housing",
        name: "Housing",
        icon: "Building",
        description: "Key money, Guarantors, and Sharehouses.",
        markdownContent: "Renting independently in Japan as a foreigner is legendary for its extreme cultural difficulty.\n\n### Unique Fees\nWhen renting a classic apartment, you are forced to pay 'Key money' (Reikin—a non-refundable 'gift' to the landlord equivalent to 1-2 months rent), a deposit (Shikikin), and agency fees. Total move-in costs frequently equal 5x the monthly rent.\n\n### The Solution\nConsequently, almost all international students use explicit 'Sharehouses' (like Sakura House or Oakhouse) which entirely nullify key money, guarantors, and furnish the complex.",
        links: [],
      },
      banking: {
        id: "banking",
        name: "Banking",
        icon: "Landmark",
        description: "Hanko seals and Yuucho bank.",
        markdownContent: "Japanese banking is notoriously analogue and paper-heavy.\n\nMany banks demand you be resident for 6+ months to open an account, except the Japan Post Bank (*Yucho Ginko*), which is universally standard for students. Opening an account requires your strictly registered 'Residence Card' (*Zairyu Card*). Some banks may also require a personal stamped seal—a *Hanko* (or Inkan)—instead of a signature.",
        links: [],
      },
      work: {
        id: "work",
        name: "Part-time Work",
        icon: "Briefcase",
        description: "AruBaito and the 28-hour limit.",
        markdownContent: "A Student Visa strictly forbids any labor fundamentally. To work legally, you must definitively apply for 'Permission to Engage in Activity Other Than That Permitted Under the Status of Residence Previously Granted' at immigration.\n\nOnce granted, you can work up to precisely 28 hours per week (up to 8 hours a day during strict holidays). Part-time jobs (Arubaito) in combinis (convenience stores) are hugely popular.",
        links: [],
      },
      health: {
        id: "health",
        name: "Healthcare",
        icon: "Heart",
        description: "National Health Insurance (NHI).",
        markdownContent: "Registration with the Japanese National Health Insurance (*Kokumin Kenko Hoken*) is absolutely strictly mandatory for any foreigner staying over 3 months.\n\n### How it works\nYou register immediately at your local ward office. It covers 70% of total medical costs, meaning you strictly pay a flat 30% out-of-pocket for any clinic visit or prescription. Because you are a student with essentially zero prior-year Japanese income, your monthly NHI premium is vastly discounted to around ¥1,500 - ¥2,000.",
        links: [],
      },
      transport: {
        id: "transport",
        name: "Transport",
        icon: "Train",
        description: "Suica, Pasmo, and Commuter Passes.",
        markdownContent: "### IC Cards\nTransit is completely privatized but seamlessly integrated. You must immediately purchase a prepaid IC card (Suica or Pasmo in Tokyo, ICOCA in Kansai). You explicitly do not need separate tickets—just tap globally.\n\n### Commuter Pass (*Teikiken*)\nAs an enrolled university degree student (excluding some language schools), you are eligible to purchase a deeply discounted Commuter Pass that grants completely unlimited travel between your exact home station and university station.",
        links: [],
      },
    },
  },
};
