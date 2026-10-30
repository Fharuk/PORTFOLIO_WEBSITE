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
  role: 'Electrical & Electronics Engineer',
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
    sub: 'Electrical & Electronics Engineering graduate from FUNAAB, working across energy, machine learning, software and project planning.',
  },

  about: [
    'My centre is electrical engineering: power, circuits, control, signal processing and embedded systems. Everything else extends from there.',
    'That has meant solar-simulated microgrid agents and predictive-maintenance models; 1D-CNNs and physics-informed GANs for industrial fault diagnosis; Primavera P6 models for offshore-wind and pipeline scopes measured in hundreds of activities and millions of dollars; and enough technical support work to know that a system is only as good as the person trying to use it.',
    'I work in Nigerian contexts with global tools. Access and transition are not abstractions to me — they are the conditions the work has to function in.',
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
      title: 'Physics-Informed Domain Adaptation for Industrial Fault Diagnosis',
      method: 'Digital twin + 1D-CNN · CWRU bearing dataset',
      finding: '100% precision and recall reported in the project record',
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
      title: 'Riemannian Transfer Learning for Cross-Subject BCI',
      method: 'Euclidean alignment + SimCLR pre-training',
      finding: '79.3% accuracy and 0.27 ms inference latency reported',
      href: 'https://zenodo.org/records/18794765',
    },
  ] as ResearchRecord[],

  researchNote:
    'Research records, not peer-reviewed publications. Figures refer to the reported datasets and simulations, not validated field outcomes.',

  // ---- Experience ------------------------------------------------------
  experience: [
    {
      period: '2021 — present',
      title: 'PC Specialist',
      org: 'ARKVOLT Tech · Lagos',
      summary:
        'Custom builds, upgrades, component sourcing and after-purchase support. Diagnose hardware and software faults, and advise customers on component choices against real needs and budget.',
    },
    {
      period: '2023 — 2025',
      title: 'Electoral Representative',
      org: 'NUESA & FUNAABSU Independent Electoral Committees',
      summary:
        'Supported governance of student electoral processes, with an emphasis on transparency and fair process.',
    },
    {
      period: '2016 — 2022',
      title: 'Teaching, tutoring & STEM education',
      org: 'Phenomenal Scholars · Ansar-ud-Deen College · Conscience International · private tutoring',
      summary:
        'Taught Mathematics, Basic Science, Physics and technology subjects across school and tutoring settings; planned lessons, tracked progress, adapted instruction to the learner.',
    },
    {
      period: '2021',
      title: 'Logistics Staff',
      org: 'Chi Limited · Lagos',
      summary:
        'Inventory tracking and distribution coordination inside an FMCG operation.',
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

  education: {
    degree: 'B.Eng. Electrical & Electronics Engineering',
    school: 'Federal University of Agriculture, Abeokuta (FUNAAB)',
    date: 'July 2025',
  },

  credentials: {
    'Project & leadership': [
      { title: 'Google Project Management Professional Certificate', issuer: 'Google / Coursera · 7 courses · Oct 2026' },
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
      { title: 'Complete Course in AutoCAD: 2D and 3D', issuer: 'CADCIM Technologies / Udemy · certificate supplied' },
      { title: 'Electronics Mastery: The Beginner’s Course in Electronics', issuer: 'Udemy · certificate supplied' },
    ] as Credential[],
    'Data & AI': [
      { title: 'IBM Data Science Professional Certificate', issuer: 'IBM / Coursera · 12 courses · Aug 2025' },
      { title: 'Applied Data Science Lab', issuer: 'WorldQuant University · Aug 2025' },
      { title: 'Ethics of AI', issuer: 'University of Helsinki · 2 ECTS · Jul 2025' },
      { title: 'Data Literacy — What Is It and Why Does It Matter?', issuer: '4EU+ Alliance / Coursera · Jul 2025' },
      { title: 'Excel Fundamentals for Data Analysis', issuer: 'Macquarie University / Coursera · Jul 2025' },
      { title: 'What Is Data Science?', issuer: 'IBM / Coursera · Jul 2025' },
      { title: 'What Is Generative AI?', issuer: 'LinkedIn Learning · Jun 2025' },
    ] as Credential[],
    'IT & software': [
      { title: 'IBM IT Support Professional Certificate', issuer: 'IBM / Coursera · 9 courses · Aug 2025' },
      { title: 'Microsoft IT Support Specialist Professional Certificate', issuer: 'Microsoft / Coursera · 6 courses · Aug 2025' },
      { title: 'Dell Technologies Technical Customer Support Specialist', issuer: 'Dell Technologies / Coursera · 5 courses · Aug 2025' },
      { title: 'Microsoft 365 Ultimate Guide', issuer: 'Udemy · 22.5 hours · Jun 2024' },
    ] as Credential[],
    'Education & communication': [
      { title: 'Teaching English as a Foreign Language (TEFL)', issuer: 'Teacher Record · 120 hours · Distinction · Jun 2024' },
      { title: 'Jobberman Soft-Skills Training', issuer: 'Jobberman / Propel · Jun 2025' },
      { title: 'Mentorship Principles', issuer: 'North American Division Leadership Certification · Jun 2024' },
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
  { slug: 'energy-grid-agent', category: 'ai', title: 'Autonomous Energy Grid Agent', metric: '5.5% simulated cost savings', desc: 'PPO agent optimising battery discharge in a renewable microgrid simulator, compared against standard simulated controllers.' },
  { slug: 'infrastructure-sentinel', category: 'ai', title: 'Municipal Infrastructure Sentinel', metric: 'Multi-agent prototype', desc: 'Vision verification and geospatial prioritisation to triage city infrastructure reports, using Gemini 2.5 Flash and Folium.' },
  { slug: 'naija-legal-aid', category: 'ai', title: 'Naija Legal Aid', metric: 'Pidgin voice interface', desc: 'Voice-first prototype turning Nigerian Pidgin requests into draft legal-demand documents. A demonstration tool, not legal advice.' },
  { slug: 'naija-marketsense', category: 'ai', title: 'Naija MarketSense', metric: 'Multimodal SME assistant', desc: 'Voice-driven prototype visualising market-price spreads and potential arbitrage for Nigerian SMEs.' },
  { slug: 'breast-cancer-classifier', category: 'ai', title: 'Explainable Breast Cancer Classifier', metric: '98.2% reported accuracy', desc: 'SVM with SHAP explanations on a 30-feature dataset. An educational ML prototype, not a diagnostic device.' },
  { slug: 'disease-prediction', category: 'ai', title: 'Disease Prediction System', metric: '41 classes', desc: 'Multiclass prototype with bulk CSV input and per-class F1 monitoring; not intended for clinical decisions.' },
  { slug: 'heart-disease-risk', category: 'ai', title: 'Heart-Disease Risk Model', metric: 'Stacked ensemble', desc: 'Logistic regression and XGBoost combined for an educational risk-model demonstration.' },
  { slug: 'crop-recommendation', category: 'ai', title: 'Crop Recommendation System', metric: 'Agritech prototype', desc: 'Soil N-P-K inputs to explore crop recommendation for Nigerian agricultural contexts.' },
  { slug: 'sms-spam-detection', category: 'ai', title: 'SMS Spam Detection Engine', metric: 'F1 reported as 0.99', desc: 'TF-IDF, Random Forest and SMOTE pipeline with bulk CSV analysis and feature-importance visualisation.' },

  // software
  { slug: 'wifi-auditor', category: 'software', title: 'WiFi Performance Auditor', metric: 'Event-driven dashboard', desc: 'Bandwidth and latency monitoring dashboard for performance trends and SLA indicators.' },
  { slug: 'credential-leak-auditor', category: 'software', title: 'Credential Leak Auditor', metric: 'Security prototype', desc: 'Audits employee email lists against a mock breach-check API and presents risk by department.' },
  { slug: 'fraud-detection-pipeline', category: 'software', title: 'Financial Fraud Detection Pipeline', metric: '<200 ms simulation', desc: 'Isolation Forest anomaly scoring on simulated transactions, with outlier and geolocation flags.' },
  { slug: 'lagos-route-optimisation', category: 'software', title: 'Lagos Route Optimisation Engine', metric: '25% lower simulated distance', desc: 'Vehicle-routing model for four trucks and sixteen delivery stops, compared with sequential routing and visualised in Folium.' },
  { slug: 'microservices-backend', category: 'software', title: 'Event-Driven Microservices Backend', metric: 'Producer–consumer design', desc: 'Python demonstration of decoupled order and fulfilment services over an asynchronous, file-backed message queue.' },
  { slug: 'invoice-extraction', category: 'software', title: 'Automated Invoice Extraction', metric: 'Document pipeline', desc: 'Watcher and extraction workflow capturing invoice number, date and amount into a CSV log.' },

  // research
  { slug: 'pi-domain-adaptation', category: 'research', title: 'Physics-Informed Domain Adaptation', metric: '100% precision & recall reported', desc: 'Digital-twin and 1D-CNN approach for CWRU-bearing sim-to-real fault diagnosis in a data-scarce setting.', links: [{ label: 'Zenodo', href: 'https://zenodo.org/records/18714046' }] },
  { slug: 'pi-gans-fault-diagnosis', category: 'research', title: 'Zero-Shot Fault Diagnosis via PI-GANs', metric: '98.72% zero-shot accuracy reported', desc: 'Physics-informed GAN study for cross-domain industrial fault diagnosis.', links: [{ label: 'Zenodo', href: 'https://zenodo.org/records/18745734' }] },
  { slug: 'spiking-saturation', category: 'research', title: 'Binary Saturation in Recurrent Spiking Networks', metric: 'Model-behaviour study', desc: 'How homeostatic L2 regularisation can still yield high-activity regimes at high classification accuracy.', links: [{ label: 'Zenodo', href: 'https://zenodo.org/records/18794753' }] },
  { slug: 'riemannian-bci', category: 'research', title: 'Riemannian Transfer Learning for Cross-Subject BCI', metric: '79.3% reported accuracy', desc: 'Euclidean alignment and SimCLR pre-training for motor-imagery decoding, with 0.27 ms reported inference latency.', links: [{ label: 'Zenodo', href: 'https://zenodo.org/records/18794765' }] },
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
