/**
 * Single source of truth for every word on the site.
 *
 * Sourced from Akinmade Faruq Adeoye's existing portfolio
 * (fharuk.github.io/portfolio) and the documents in the shared Drive folder.
 * Metrics are the ones reported in the project materials — simulation and
 * prototype results, not field performance. That caveat is preserved on the
 * page rather than quietly dropped.
 */

export type Category = 'engineering' | 'ai' | 'software' | 'research'

export type Project = {
  slug: string
  category: Category
  title: string
  metric: string
  desc: string
  links?: { label: string; href: string }[]
}

export type P6Model = {
  slug: string
  group: string
  title: string
  summary: string
  stats: { label: string; value: string }[]
  budget: string
}

export type ResearchRecord = {
  title: string
  method: string
  finding: string
  href: string
}

export type EducationEntry = {
  degree: string
  school: string
  date: string
}

export type Role = {
  period: string
  title: string
  org: string
  summary: string
  note?: string
}

export type Credential = {
  title: string
  issuer: string
  note?: string
  /**
   * Public verification URL for this specific certificate — the Coursera
   * /verify/<id>, Credly badge, or EF SET certificate page. Only ever set from
   * a link the issuer actually generated for him; never constructed by hand,
   * because a "verify" link that does not verify is worse than no link.
   */
  verify?: string
}

export const categoryLabels: Record<Category, string> = {
  engineering: 'Engineering',
  ai: 'AI & data',
  software: 'Software & IT',
  research: 'Research',
}

export const site = {
  name: 'Faruq',
  fullName: 'Akinmade Faruq Adeoye',
  // A nickname he goes by. Presented as "known as", never as a title or a
  // credential: "Dr." here is not a doctorate, and the site must not imply one.
  nickname: 'Dr. Archimedis',
  role: 'Electrical & Electronics Engineer',
  // The master's is named separately from `discipline`: the hero slot that
  // renders these is only about 22 characters wide, so one long credential
  // string would wrap into a column of fragments. Both are rendered together,
  // studies first, and "in progress" stays attached to the MScFE.
  studying: 'MSc Financial Engineering · in progress',
  discipline: 'B.Eng. Electrical & Electronics Engineering · FUNAAB',
  location: 'Lagos, Nigeria',
  timezone: 'WAT · UTC+1',
  available: true,

  /** The one line the whole page has to earn. */
  positioning:
    'I work across power systems, applied machine learning and project planning — and I care most about the seam between them, where a model has to survive contact with a schedule, a budget and a real constraint.',

  hero: {
    lead: 'Power systems.',
    mid: 'Applied intelligence.',
    tail: 'Delivery that holds.',
    sub: 'Electrical & Electronics Engineer from FUNAAB, working across energy, machine learning, software and project planning.',
  },

  about: [
    'My centre is electrical engineering: power, circuits, control, signal processing and embedded systems. Everything else extends from there.',
    'That has meant solar-simulated microgrid agents and predictive-maintenance models; 1D-CNNs and physics-informed GANs for industrial fault diagnosis; Primavera P6 models for offshore-wind and pipeline scopes measured in hundreds of activities and millions of dollars; and enough technical support work to know that a system is only as good as the person trying to use it.',
    'I work in Nigerian contexts with global tools. Access and transition are not abstractions to me — they are the conditions the work has to function in.',
  ],

  /**
   * What the work is actually made of.
   *
   * Every entry here appears in the project records or the papers — no
   * aspirational additions, nothing learned once and abandoned. The groupings
   * follow the disciplines rather than a job-board taxonomy, so the list reads
   * as a toolkit instead of a checklist.
   */
  stack: [
    {
      group: 'Electrical & control',
      items: ['MATLAB', 'Simulink', 'PID & state-space control', 'Power-system analysis', 'Digital twins', 'PCB & breadboard prototyping'],
    },
    {
      group: 'Machine learning',
      items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'NumPy', 'Pandas', 'SHAP', 'XGBoost', 'Stable-Baselines3', 'Gymnasium'],
    },
    {
      group: 'Applied AI',
      items: ['Gemini 2.5 Flash', 'Vision & multimodal agents', 'RAG', 'Google AI Studio', 'Hugging Face'],
    },
    {
      group: 'Software & delivery',
      items: ['Python', 'Streamlit', 'Flask / REST', 'TypeScript / React', 'Next.js', 'Tailwind', 'Docker', 'Google Cloud Run', 'Git & GitHub Actions'],
    },
    {
      group: 'Hardware & edge',
      items: ['Arduino', 'ESP32', 'Embedded C++', 'Sensor interfacing', 'TinyML'],
    },
    {
      group: 'Planning',
      items: ['Primavera P6', 'Schedule logic & resource loading', 'Risk registers'],
    },
  ],

  principle:
    'Build with technical depth. Explain with clarity. Keep the human context in view.',

  pillars: [
    {
      title: 'Electrical engineering',
      body: 'Power, circuits, control, signal processing and embedded systems.',
    },
    {
      title: 'Machine learning',
      body: 'Applied ML, research and AI prototypes with an emphasis on what the metric actually claims.',
    },
    {
      title: 'Energy & delivery',
      body: 'Energy-transition themes and Primavera P6 planning models for complex scopes.',
    },
    {
      title: 'Software & IT',
      body: 'Python tools, web apps, troubleshooting and technical support.',
    },
    {
      title: 'Education & service',
      body: 'STEM teaching, student governance, mentoring and community work.',
    },
  ],

  // ---- Primavera P6 planning models -------------------------------------
  p6: [
    {
      slug: 'nigeria-offshore-wind',
      group: 'Offshore wind',
      title: 'Nigeria Offshore Wind Farm — Electrical Balance of Plant',
      summary:
        'Portfolio planning model for a 300 MW offshore wind electrical balance-of-plant scope: multi-discipline work packages, international calendars and marine campaign sequencing.',
      stats: [
        { label: 'Activities', value: '339' },
        { label: 'Relationships', value: '423' },
        { label: 'Assignments', value: '1,386' },
        { label: 'Risk records', value: '71' },
      ],
      budget: 'US$450m',
    },
    {
      slug: 'trans-delta-rehabilitation',
      group: 'Pipeline · rehabilitation',
      title: 'Trans-Delta 24-inch Export Pipeline Rehabilitation & Life Extension',
      summary:
        'Schedule model across rehabilitation, inspection, repair, procurement and construction interfaces for a long-life export pipeline scope.',
      stats: [
        { label: 'Activities', value: '226' },
        { label: 'Relationships', value: '405' },
        { label: 'Assignments', value: '1,507' },
        { label: 'Risk records', value: '34' },
      ],
      budget: 'US$60.6m',
    },
    {
      slug: 'pipeline-replacement-10km',
      group: 'Pipeline · replacement',
      title: '24-inch Crude Oil Pipeline Replacement — 10 km',
      summary:
        'Planning model for mixed-terrain replacement — laterite, creek/HDD and swamp work areas — working back from a defined completion constraint.',
      stats: [
        { label: 'Activities', value: '157' },
        { label: 'Relationships', value: '272' },
        { label: 'Assignments', value: '723' },
        { label: 'Risk records', value: '24' },
      ],
      budget: 'US$17.35m',
    },
  ] as P6Model[],

  p6Note:
    'These are planning models, not claims of executed projects or approved contract budgets. The BoP model is a portfolio exercise, not an execution baseline.',

  // ---- Research records ------------------------------------------------
  research: [
    {
      title: 'Riemannian Transfer Learning for Cross-Subject BCI',
      method: 'Euclidean alignment + SimCLR pre-training',
      finding: '79.3% accuracy and 0.27 ms inference latency reported',
      href: 'https://zenodo.org/records/18714046',
    },
    {
      title: 'Zero-Shot Industrial Fault Diagnosis via PI-GANs',
      method: 'Physics-informed generative modelling',
      finding: '98.72% zero-shot accuracy, 77.22% inter-domain accuracy reported',
      href: 'https://zenodo.org/records/18745734',
    },
    {
      title: 'Autonomous Active Vibration Control via Deep Reinforcement Learning',
      method: 'Soft Actor-Critic for dynamic PID tuning',
      finding: '40% settling-time reduction and 17% efficiency gain vs. Ziegler–Nichols reported',
      href: 'https://zenodo.org/records/18794732',
    },
    {
      title: 'Binary Saturation in Recurrent Spiking Neural Networks',
      method: 'Model-behaviour study under homeostatic regularisation',
      finding: 'High-activity regimes can persist despite high classification accuracy',
      href: 'https://zenodo.org/records/18794753',
    },
    {
      title: 'Physics-Informed Domain Adaptation for Industrial Fault Diagnosis',
      method: 'Digital twin + 1D-CNN · CWRU bearing dataset',
      finding: '100% precision and recall reported in the project record',
      href: 'https://zenodo.org/records/18794765',
    },
  ] as ResearchRecord[],

  researchNote:
    'Research records, not peer-reviewed publications. Figures refer to the reported datasets and simulations, not validated field outcomes.',

  // ---- Experience ------------------------------------------------------
  // Newest first, so the column reads as one timeline: the roles still running
  // lead (longest-running first), then every completed role in the order it
  // ended. Editing this list means re-sorting by hand — the dates are strings
  // ("present", "Sep 2020") and parsing them at runtime would buy nothing.
  experience: [
    {
      period: 'Sep 2020 — present',
      title: 'IT Support Technician',
      org: 'Arkvolt · Lagos · Part-time · Hybrid',
      summary:
        'Built a personal computer and upgraded an existing one for optimal performance — hands-on work with hardware components and system configuration, carried into ongoing technical support.',
    },
    {
      period: 'Jun 2023 — present',
      title: 'Engineer Intern',
      org: 'Transmission Company of Nigeria · Lagos · Part-time',
      summary:
        'Power-system analysis and troubleshooting inside the national transmission operator.',
    },
    {
      period: 'Jun 2026 — Oct 2026',
      title: 'Financial Engineer',
      org: '10th International Conference on ICICPE · Chiang Mai, Thailand · Remote',
      summary:
        'Published the paper “Explainable Machine Learning for Credit Risk Assessment Under Macroeconomic Stress: A Nigerian Economic Context Framework”.',
    },
    {
      period: 'Jul 2025 — Nov 2025',
      title: 'Field Engineer',
      org: 'Axon Integrated Services Limited · Gbagada, Lagos',
      summary: 'Supervised the telecommunication network.',
    },
    {
      period: 'Aug 2016 — Sep 2024',
      title: 'High School Science Teacher',
      org: 'Continuous Education Centre, Ansar-ud-Deen · Lagos · Part-time',
      summary:
        'Taught science across the secondary curriculum for eight years, planning lessons, tracking progress and adapting instruction to the learner.',
    },
    {
      period: 'Feb 2023 — Mar 2023',
      title: 'Assisting Presiding Officer',
      org: 'INEC Nigeria',
      summary:
        'Supervised the electoral process for over 500 voters, working to strict guidelines under pressure.',
    },
    {
      period: 'Jul 2022 — Oct 2022',
      title: 'School Teacher',
      org: 'Phenomenal Scholars School',
      summary:
        'Developed and delivered lesson plans in Mathematics and Basic Science for 40+ students, raising participation.',
    },
    {
      period: 'Jan 2021 — Dec 2021',
      title: 'Logistics Specialist',
      org: 'CHI Limited · Lagos',
      summary: 'Managed high-value inventory and coordinated goods distribution with drivers.',
    },
    {
      period: 'Oct 2016 — Jul 2017',
      title: 'School Teacher',
      org: 'Conscience International School · Lagos',
      summary: 'Classroom teaching in Mathematics and Basic Science.',
    },
  ] as Role[],

  leadership: [
    {
      title: 'Project Coordinator',
      org: 'FUNAAB Electrical & Electronics Engineering Department',
      summary:
        'Led three department projects, managed cross-functional teams and delivered on schedule.',
    },
    {
      title: 'Rotaract Club Member',
      org: 'District 9111 · FUNAAB',
      summary: 'Community-service and leadership initiatives.',
    },
  ],

  // Most recent first. The MScFE follows WorldQuant University's own naming.
  // Both the MScFE and the BBA are in progress and say so: enrolled is not the
  // same claim as graduated, and a portfolio should never blur those two.
  education: [
    {
      degree: 'MSc Financial Engineering',
      school: 'WorldQuant University',
      date: 'Jan 2026 — Jan 2028 · in progress',
    },
    {
      degree: 'BBA Business Administration and Management',
      school: 'University of the People',
      date: 'Sep 2025 — Sep 2029 · in progress',
    },
    {
      degree: 'B.Eng. Electrical & Electronics Engineering',
      school: 'Federal University of Agriculture, Abeokuta (FUNAAB)',
      date: 'Oct 2021 — May 2025',
    },
  ] as EducationEntry[],

  // Every `verify` URL below was opened and read back before it was written
  // here: the title, issuer and date on the page are what the entry claims.
  // Where a record did not resolve, no link is set — a dead verification link
  // is worse than none.
  credentials: {
    'Project & leadership': [
      {
        title: 'Google Project Management Professional Certificate',
        issuer: 'Google / Coursera · 7 courses · Oct 2026',
        verify: 'https://www.credly.com/badges/f49890ce-74c7-4a1b-a417-04a17aecd270/public_url',
      },
      {
        title: 'Project Planning: Putting It All Together',
        issuer: 'Google / Coursera · Oct 2026',
        verify: 'https://www.coursera.org/account/accomplishments/verify/O9ENY070O7RX',
      },
      {
        title: 'Project Initiation: Starting a Successful Project',
        issuer: 'Google / Coursera · Oct 2026',
        verify: 'https://www.coursera.org/account/accomplishments/verify/3F6246IXJ47Q',
      },
      {
        title: 'Microsoft Project Management: Build Job-Ready Skills',
        issuer: 'Microsoft / Coursera · Sep 2025',
        verify: 'https://www.coursera.org/account/accomplishments/specialization/P5PG13KDB5YU',
      },
      { title: 'Project Engineering Management Training Programme for Engineering Graduates', issuer: 'NCDMB with Elevated Express Limited · Lagos · Oct 2026' },
      { title: 'Aspire Leaders Program', issuer: 'Aspire Institute · 40 hours · Dec 2025' },
      { title: 'Security Risk Management Professional – Country (SRMP-C)', issuer: 'INSSA · May 2024 · 3-year validity stated' },
      { title: 'Certificate in Project Management Professional', issuer: 'Seal-Sea Concept · Feb 2024 · training certificate, not PMI PMP' },
      { title: 'Leading Organizational Change (BUS643)', issuer: 'Course certificate · Jun 2024' },
      { title: 'Project Management', issuer: 'DisasterReady / Cornerstone OnDemand · 2.5 hours · May 2024' },
      { title: 'Project Management Essentials Certified', issuer: 'Management and Strategy Institute · Jun 2024' },
      { title: 'Business Management Essentials Certified', issuer: 'Management and Strategy Institute · Jun 2024' },
    ] as Credential[],
    'Engineering & energy': [
      { title: 'IoT Wireless & Cloud Computing Emerging Technologies', issuer: 'Yonsei University / Coursera · Jun 2025' },
      { title: 'Energy Access and Just Transition', issuer: 'Green Hub Africa · Jul 2025' },
      {
        title: 'Complete Course in AutoCAD: 2D and 3D',
        issuer: 'CADCIM Technologies / Udemy · Jun 2024',
        verify: 'https://www.udemy.com/certificate/UC-a9967c42-b093-411e-9f4a-5e18caa00a3b/',
      },
      {
        title: 'Electronics Mastery: The Beginner’s Course in Electronics',
        issuer: 'Lab Awesome / Udemy · Jun 2024',
        verify: 'https://www.udemy.com/certificate/UC-ad7d88cb-17ae-42a3-9815-b609f7d743d1/',
      },
    ] as Credential[],
    'Data & AI': [
      {
        title: 'IBM Data Science Professional Certificate',
        issuer: 'IBM / Coursera · 12 courses · Aug 2025',
        verify: 'https://www.coursera.org/account/accomplishments/specialization/ANTIF5ILAP1N',
      },
      { title: 'Applied Data Science Lab', issuer: 'WorldQuant University · Aug 2025' },
      {
        title: 'Microsoft Python Development',
        issuer: 'Microsoft / Coursera · Sep 2025',
        verify: 'https://www.coursera.org/account/accomplishments/specialization/L824QT8XAWEE',
      },
      {
        title: 'Data Science Essentials with Python',
        issuer: 'Cisco · Sep 2025',
        verify: 'https://www.credly.com/badges/07241441-feb7-48fc-983b-93273d212339/public_url',
      },
      {
        title: '5-Day AI Agents Intensive Course with Google',
        issuer: 'Kaggle · Dec 2025',
        verify: 'https://www.kaggle.com/certification/badges/faruqakinmade/105',
      },
      { title: 'Ethics of AI', issuer: 'University of Helsinki · 2 ECTS · Jul 2025' },
      {
        title: 'Data Literacy — What Is It and Why Does It Matter?',
        issuer: '4EU+ Alliance / Coursera · Jul 2025',
        verify: 'https://www.coursera.org/account/accomplishments/verify/2VIOAY4HJLTU',
      },
      {
        title: 'Excel Fundamentals for Data Analysis',
        issuer: 'Macquarie University / Coursera · Jul 2025',
        verify: 'https://www.coursera.org/account/accomplishments/verify/CL5Q81SOJET1',
      },
      { title: 'What Is Data Science?', issuer: 'IBM / Coursera · Jul 2025' },
      { title: 'What Is Generative AI?', issuer: 'LinkedIn Learning · Jun 2025' },
      {
        title: 'Basic Information Literacy',
        issuer: 'University at Buffalo / Coursera · Jun 2025',
        verify: 'https://www.credly.com/badges/23019061-c528-49ef-b7d3-adec3c42e93d/public_url',
      },
    ] as Credential[],
    'IT & software': [
      {
        title: 'IBM IT Support Professional Certificate',
        issuer: 'IBM / Coursera · 9 courses · Aug 2025',
        verify: 'https://www.coursera.org/account/accomplishments/professional-cert/2854SZHKQDWG',
      },
      {
        title: 'Microsoft IT Support Specialist Professional Certificate',
        issuer: 'Microsoft / Coursera · 6 courses · Aug 2025',
        verify: 'https://www.coursera.org/account/accomplishments/professional-cert/8C5NN09PK77Q',
      },
      {
        title: 'Dell Technologies Technical Customer Support Specialist',
        issuer: 'Dell Technologies / Coursera · 5 courses · Aug 2025',
        verify: 'https://www.coursera.org/account/accomplishments/professional-cert/Q0IJCAH3P1GO',
      },
      { title: 'Microsoft 365 Ultimate Guide', issuer: 'Udemy · 22.5 hours · Jun 2024' },
    ] as Credential[],
    'Education & communication': [
      { title: 'Teaching English as a Foreign Language (TEFL)', issuer: 'Teacher Record · 120 hours · Distinction · Jun 2024' },
      { title: 'Jobberman Soft-Skills Training', issuer: 'Jobberman / Propel · Jun 2025' },
      { title: 'Mentorship Principles', issuer: 'North American Division Leadership Certification · Jun 2024' },
      {
        title: 'EF SET English Certificate 56/100 (B2 Upper Intermediate)',
        issuer: 'EF SET · Jun 2026',
        verify: 'https://cert.efset.org/en/CmQcu8',
      },
      { title: 'The Fundamentals of Digital Marketing', issuer: 'Google Digital Skills for Africa · May 2022' },
    ] as Credential[],
  },

  contact: {
    email: 'Fharuk147@gmail.com',
    phone: '+234 903 043 8653',
    phoneHref: 'tel:+2349030438653',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/faruqakinmade' },
      { label: 'GitHub', href: 'https://github.com/Fharuk' },
      // Opened and read back before being listed. Credly is the one address
      // that verifies every badge in the credentials list at once; Kaggle
      // carries the notebooks behind the models.
      { label: 'Credly', href: 'https://www.credly.com/users/faruq-akinmade' },
      { label: 'Kaggle', href: 'https://www.kaggle.com/faruqakinmade' },
      { label: 'Earlier portfolio', href: 'https://fharuk.github.io/portfolio/' },
    ],
  },

  disclaimer:
    'Academic models, simulations and software demos are presented for learning and demonstration. Medical and legal-themed tools are not professional advice, diagnosis or validated clinical services.',
}

// ---- Projects ------------------------------------------------------------
export const projects: Project[] = [
  // engineering
  { slug: 'power-predictive-maintenance', category: 'engineering', title: 'Power-System Predictive Maintenance', metric: '87% reported accuracy', desc: 'Artificial neural network trained on power-system fault signatures to explore generator-failure prediction and proactive maintenance scheduling.' },
  { slug: 'automatic-power-stabilizer', category: 'engineering', title: 'Automatic Power Stabilizer', metric: '220 V prototype', desc: 'Hardware build with active detection and correction logic, designed to hold stable output across the tested anomaly range.' },
  { slug: 'power-system-generator', category: 'engineering', title: 'Power-System Generator Build', metric: 'Hardware project', desc: 'Repurposed a car alternator to demonstrate regulated DC and AC power conversion.' },
  { slug: 'olfactory-signal-modelling', category: 'engineering', title: 'Olfactory Perception Signal Modelling', metric: '90% reported accuracy', desc: 'MATLAB CNN classifying volatile organic compounds from rat EEG readings, as a final-year engineering project.' },
  { slug: 'wireless-av-transmitter', category: 'engineering', title: 'Wireless Audio-Visual Transmitter', metric: '6-channel analogue RF', desc: 'Analogue RF transmitter broadcasting audio and video to a television receiver.' },
  { slug: 'soccer-substitution-board', category: 'engineering', title: 'Digital Soccer Substitution Board', metric: 'Arduino Mega', desc: 'Embedded C++ display system for managing and showing live player substitutions.' },
  { slug: 'active-vibration-control', category: 'engineering', title: 'Autonomous Active Vibration Control', metric: '40% lower settling time', desc: 'A Soft Actor-Critic agent tunes PID gains in a nonlinear system, with a reported 17% efficiency gain over Ziegler–Nichols control.', links: [{ label: 'Research record', href: 'https://zenodo.org/records/18794732' }] },

  // ai
  { slug: 'energy-grid-agent', category: 'ai', title: 'Autonomous Energy Grid Agent', metric: '5.5% simulated cost savings', desc: 'PPO agent optimising battery discharge in a renewable microgrid simulator, compared against standard simulated controllers.' , links: [{ label: 'Live demo', href: 'https://autonomous-energy-grid-xh2lvsj9lnitmvmqvruq94.streamlit.app/' }, { label: 'Code', href: 'https://github.com/Fharuk/autonomous-energy-grid' }] },
  { slug: 'infrastructure-sentinel', category: 'ai', title: 'Municipal Infrastructure Sentinel', metric: 'Multi-agent prototype', desc: 'Vision verification and geospatial prioritisation to triage city infrastructure reports, using Gemini 2.5 Flash and Folium.' , links: [{ label: 'Live demo', href: 'https://the-municipal-infrastructure-sentinel-askk6sxrharks3db8woukr.streamlit.app/' }, { label: 'Code', href: 'https://github.com/Fharuk/The-Municipal-Infrastructure-Sentinel' }] },
  { slug: 'naija-legal-aid', category: 'ai', title: 'Naija Legal Aid', metric: 'Pidgin voice interface', desc: 'Voice-first prototype turning Nigerian Pidgin requests into draft legal-demand documents. A demonstration tool, not legal advice.' , links: [{ label: 'Live demo', href: 'https://naija-legal-aid-bnwwrslbvyi8rmtpnsqhye.streamlit.app/' }, { label: 'Code', href: 'https://github.com/Fharuk/Naija-Legal-Aid' }] },
  { slug: 'naija-marketsense', category: 'ai', title: 'Naija MarketSense', metric: 'Multimodal SME assistant', desc: 'Voice-driven prototype visualising market-price spreads and potential arbitrage for Nigerian SMEs.' , links: [{ label: 'Live demo', href: 'https://naija-marketsense-sznpezycdvs2oxsv2nnnjd.streamlit.app/' }, { label: 'Code', href: 'https://github.com/Fharuk/Naija-MarketSense' }] },
  { slug: 'breast-cancer-classifier', category: 'ai', title: 'Explainable Breast Cancer Classifier', metric: '98.2% reported accuracy', desc: 'SVM with SHAP explanations on a 30-feature dataset. An educational ML prototype, not a diagnostic device.' , links: [{ label: 'Live demo', href: 'https://breast-cancer-app-5zisoqlcrmb62xfx2vw7jh.streamlit.app' }, { label: 'Code', href: 'https://github.com/Fharuk/breast-cancer-app' }] },
  { slug: 'disease-prediction', category: 'ai', title: 'Disease Prediction System', metric: '41 classes', desc: 'Multiclass prototype with bulk CSV input and per-class F1 monitoring; not intended for clinical decisions.' , links: [{ label: 'Live demo', href: 'https://disease-prediction-app-zn8mic7nrxuerpwxvuzglh.streamlit.app' }, { label: 'Code', href: 'https://github.com/Fharuk/disease-prediction-app' }] },
  { slug: 'heart-disease-risk', category: 'ai', title: 'Heart-Disease Risk Model', metric: 'Stacked ensemble', desc: 'Logistic regression and XGBoost combined for an educational risk-model demonstration.' , links: [{ label: 'Live demo', href: 'https://heart-disease-predictor-atx8csvrdglknzmp28hfay.streamlit.app' }, { label: 'Code', href: 'https://github.com/Fharuk/heart-disease-predictor' }] },
  { slug: 'crop-recommendation', category: 'ai', title: 'Crop Recommendation System', metric: 'Agritech prototype', desc: 'Soil N-P-K inputs to explore crop recommendation for Nigerian agricultural contexts.' , links: [{ label: 'Live demo', href: 'https://intelligent-crop-recommendation-system.streamlit.app' }, { label: 'Code', href: 'https://github.com/Fharuk/Intelligent-Crop-Recommendation-System' }] },
  { slug: 'sms-spam-detection', category: 'ai', title: 'SMS Spam Detection Engine', metric: 'F1 reported as 0.99', desc: 'TF-IDF, Random Forest and SMOTE pipeline with bulk CSV analysis and feature-importance visualisation.' , links: [{ label: 'Live demo', href: 'https://spam-sms-detector-anqt8p2whl9vzfccsa7xrp.streamlit.app' }, { label: 'Code', href: 'https://github.com/Fharuk/spam-sms-detector' }] },

  // software
  { slug: 'wifi-auditor', category: 'software', title: 'WiFi Performance Auditor', metric: 'Event-driven dashboard', desc: 'Bandwidth and latency monitoring dashboard for performance trends and SLA indicators.' , links: [{ label: 'Live demo', href: 'https://wifi-dashboard-fgavfog3iwlm3s25iwnpjd.streamlit.app' }, { label: 'Code', href: 'https://github.com/Fharuk/WiFi-Dashboard' }] },
  { slug: 'credential-leak-auditor', category: 'software', title: 'Credential Leak Auditor', metric: 'Security prototype', desc: 'Audits employee email lists against a mock breach-check API and presents risk by department.' , links: [{ label: 'Live demo', href: 'https://credential-auditor-ft52xzyldqlth7x2wx9drc.streamlit.app' }, { label: 'Code', href: 'https://github.com/Fharuk/credential-auditor' }] },
  { slug: 'fraud-detection-pipeline', category: 'software', title: 'Financial Fraud Detection Pipeline', metric: '<200 ms simulation', desc: 'Isolation Forest anomaly scoring on simulated transactions, with outlier and geolocation flags.' },
  { slug: 'lagos-route-optimisation', category: 'software', title: 'Lagos Route Optimisation Engine', metric: '25% lower simulated distance', desc: 'Vehicle-routing model for four trucks and sixteen delivery stops, compared with sequential routing and visualised in Folium.' },
  { slug: 'microservices-backend', category: 'software', title: 'Event-Driven Microservices Backend', metric: 'Producer–consumer design', desc: 'Python demonstration of decoupled order and fulfilment services over an asynchronous, file-backed message queue.' },
  { slug: 'invoice-extraction', category: 'software', title: 'Automated Invoice Extraction', metric: 'Document pipeline', desc: 'Watcher and extraction workflow capturing invoice number, date and amount into a CSV log.' },

  // research
  { slug: 'pi-domain-adaptation', category: 'research', title: 'Physics-Informed Domain Adaptation', metric: '100% precision & recall reported', desc: 'Digital-twin and 1D-CNN approach for CWRU-bearing sim-to-real fault diagnosis in a data-scarce setting.', links: [{ label: 'Zenodo', href: 'https://zenodo.org/records/18794765' }] },
  { slug: 'pi-gans-fault-diagnosis', category: 'research', title: 'Zero-Shot Fault Diagnosis via PI-GANs', metric: '98.72% zero-shot accuracy reported', desc: 'Physics-informed GAN study for cross-domain industrial fault diagnosis.', links: [{ label: 'Zenodo', href: 'https://zenodo.org/records/18745734' }] },
  { slug: 'spiking-saturation', category: 'research', title: 'Binary Saturation in Recurrent Spiking Networks', metric: 'Model-behaviour study', desc: 'How homeostatic L2 regularisation can still yield high-activity regimes at high classification accuracy.', links: [{ label: 'Zenodo', href: 'https://zenodo.org/records/18794753' }] },
  { slug: 'riemannian-bci', category: 'research', title: 'Riemannian Transfer Learning for Cross-Subject BCI', metric: '79.3% reported accuracy', desc: 'Euclidean alignment and SimCLR pre-training for motor-imagery decoding, with 0.27 ms reported inference latency.', links: [{ label: 'Zenodo', href: 'https://zenodo.org/records/18714046' }] },
]

export const projectNote =
  'Metrics are project- or dataset-level results reported in the project materials. Simulation and prototype results are not claims of field performance.'

/**
 * Stations along the scroll-scrubbed flight. The camera does not cut between
 * them — one spline, five stops, which is why the order reads as a journey
 * through the disciplines rather than a slideshow.
 */
export const scenes = [
  { key: 'power', label: 'Power', caption: 'Generation, conversion and control — where the work starts.' },
  { key: 'signal', label: 'Signal', caption: 'Sensing, modelling, and learning from what a system reports.' },
  { key: 'intelligence', label: 'Intelligence', caption: 'Models that have to earn the metric they claim.' },
  { key: 'delivery', label: 'Delivery', caption: 'Schedules, risk, and the constraint that decides it.' },
  { key: 'load', label: 'Load', caption: 'Built, used, and answered for.' },
] as const
