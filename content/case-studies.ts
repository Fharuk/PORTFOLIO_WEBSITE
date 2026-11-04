import {
  projects,
  projectNote,
  site,
  type Category,
  type P6Model,
  type Project,
} from '@/content/site'

/**
 * Long-form case studies, keyed by slug.
 *
 * The rule this file is written under: **nothing here may assert anything the
 * project materials do not already say.** The one-line `desc` and `metric` on
 * each project are the primary record; everything below either expands on them
 * or refuses to. Where a number appears, it is the number the record reports,
 * and `limits` says what it does not mean. Where we have no material — the
 * smaller builds — no entry exists and the page falls back to the record
 * itself rather than to invented narrative.
 */

export type CaseStudyDetail = {
  /** Why the thing exists — the constraint that started it. */
  context: string
  /** How it was actually built. */
  approach: string
  /** What the record reports, stated as a report rather than a fact. */
  result: string
  /** What the number above does *not* claim. Omitted when there is nothing to caveat. */
  limits?: string
  /** Tabular figures pulled from the record. */
  figures?: { label: string; value: string }[]
}

const details: Record<string, CaseStudyDetail> = {
  // ---- Research records --------------------------------------------------
  'pi-domain-adaptation': {
    context:
      'Predictive maintenance has a structural problem: run-to-failure data barely exists, so a model trained in simulation has to survive real vibration it has never seen.',
    approach:
      'A digital twin of a DC motor is built from its coupled electromechanical equations — R = 2.0 Ω and B = 0.001 Nm·s/rad healthy, R = 0.5 Ω and B = 0.05 to simulate a stator short and a bearing fault — with zero-mean Gaussian noise standing in for the gap between simulation and sensor. A 1D-CNN learns from that.',
    result:
      'Trained on fully simulated data plus half of the real vibration series, the model returned 100% precision and 100% recall on the CWRU bearing set.',
    limits:
      'One benchmark, one motor model, one fault family. A sim-to-real result is not a plant-floor deployment, and the record does not claim one.',
  },
  'pi-gans-fault-diagnosis': {
    context:
      'The harder version of the same problem: diagnose a fault class the model has never been trained on at all, so there is no target-domain data to adapt against.',
    approach:
      'A GAN whose generator loss carries a differentiable physics engine — Ohm’s and Newton’s laws — beside the adversarial term. Fifty epochs on synthetic DC-motor faults, then inference at R = 0.5 Ω to imitate a stator short circuit on real bearings.',
    result:
      '98.72% zero-shot accuracy across 235 real CWRU signal windows on unseen inner-race faults, 77.22% inter-domain accuracy on outer-race faults, and a physics residual that falls to 78.4% — evidence the generator is obeying the physics rather than the noise.',
    limits:
      'Two fault families on one benchmark. The 77.22% is the honest cost of crossing domains, which is why it is quoted next to the stronger number rather than instead of it.',
  },
  'active-vibration-control': {
    context:
      'A PID loop is tuned once, for one operating point. Nonlinear dynamics punish that: overshoot, oscillation, and energy spent fighting them.',
    approach:
      'A Soft Actor-Critic agent re-tunes the proportional, integral and derivative gains every 10 ms inside a custom Gym environment built on the DC motor’s electromechanical behaviour.',
    result:
      'Overshoot eliminated, settling time down 40%, energy efficiency up 17% against Ziegler–Nichols tuning — and the agent converges on variable-structure logic, hardening or softening the loop as the dynamics demand.',
    limits:
      'Simulated motor dynamics in an in-house environment, compared against a tuning rule rather than a field-tuned controller.',
  },
  'spiking-saturation': {
    context:
      'Spiking networks are sold as energy-efficient because they fire sparsely. Trained with surrogate gradients they can also drift into firing constantly — accurate, and more like a conventional digital circuit than a brain.',
    approach:
      'A rate-coded recurrent SNN with homeostatic L2 regularisation, which is meant to hold the mean firing rate near 5%, trained on a temporal anomaly-detection task.',
    result:
      'The network reached 100% classification accuracy while 49.2% of its neurons were firing. A synaptic-efficiency metric then quantifies what the accuracy cost: the network can be right and still be running far from sparsity.',
    limits:
      'One architecture, one task. The paper argues from that result that sparsity needs hard structural constraints rather than a functional penalty — a claim about this class of training, not a theorem.',
  },
  'riemannian-bci': {
    context:
      'Every new brain–computer interface user pays a calibration tax: minutes of data collection before the decoder works, because EEG differs more between people than between thoughts.',
    approach:
      'Euclidean alignment maps each subject’s covariance structure into a shared space, a shallow ConvNet extracts temporal and spatial features, and SimCLR pre-training on unlabelled recordings carries the representation across subjects.',
    result:
      '79.3% accuracy on a subject excluded entirely from training, against a 25% chance baseline, at 0.27 ms average inference latency — with t-SNE showing clusters that separate classes rather than people.',
    limits:
      'Four-class motor imagery on a public dataset. The claim is a lower calibration cost, not a clinical-grade decoder.',
  },

  // ---- P6 planning models ------------------------------------------------
  'nigeria-offshore-wind': {
    context:
      'A 300 MW offshore wind balance-of-plant scope is a scheduling problem before it is an engineering one: work packages drawn from several disciplines, calendars that do not agree, and marine campaigns that cannot be resequenced on a whim.',
    approach:
      'A portfolio planning model in Primavera P6 — every package as an activity, logic ties carrying the sequencing, resources assigned, and risk records standing against the activities they threaten.',
    result:
      '339 activities, 423 relationships, 1,386 assignments and 71 risk records, against a modelled budget of US$450m.',
    limits:
      'A portfolio exercise, not an execution baseline. The budget is what the model carries, not an approved contract value, and no part of this scope was built.',
    figures: [
      { label: 'Activities', value: '339' },
      { label: 'Relationships', value: '423' },
      { label: 'Assignments', value: '1,386' },
      { label: 'Risk records', value: '71' },
      { label: 'Modelled budget', value: 'US$450m' },
    ],
  },
  'trans-delta-rehabilitation': {
    context:
      'Rehabilitation and life extension of a live export pipeline is a scheduling problem with no clean start: inspection results decide repairs, repairs wait on procurement, and the sequence has to hold across all of it.',
    approach:
      'A P6 schedule built around the interfaces — rehabilitation, inspection, repair, procurement and construction — with the logic ties doing the work of stating where one package may not begin until another ends.',
    result:
      '226 activities, 405 relationships, 1,507 assignments and 34 risk records, against a modelled budget of US$60.6m.',
    limits:
      'A planning model. The figures describe the schedule as built, not a contracted scope or a delivered outcome.',
    figures: [
      { label: 'Activities', value: '226' },
      { label: 'Relationships', value: '405' },
      { label: 'Assignments', value: '1,507' },
      { label: 'Risk records', value: '34' },
      { label: 'Modelled budget', value: 'US$60.6m' },
    ],
  },
  'pipeline-replacement-10km': {
    context:
      'Ten kilometres of replacement across three kinds of ground — laterite, creek and horizontal directional drilling, and swamp — planned backwards from a completion date that was fixed before the plan existed.',
    approach:
      'A P6 model sequenced by work area, with the completion constraint driving the logic rather than emerging from it: the schedule states what would have to be true, at what rate, for the date to hold.',
    result:
      '157 activities, 272 relationships, 723 assignments and 24 risk records, against a modelled budget of US$17.35m.',
    limits:
      'A planning model worked back from a constraint. The rates are modelled, not measured in the field.',
    figures: [
      { label: 'Activities', value: '157' },
      { label: 'Relationships', value: '272' },
      { label: 'Assignments', value: '723' },
      { label: 'Risk records', value: '24' },
      { label: 'Modelled budget', value: 'US$17.35m' },
    ],
  },

  // ---- Builds added from the repository record ---------------------------
  // Written from each repository's own README, which is the only material we
  // have on them. Where the README is silent — traffic, funding, whether it
  // shipped — so is this.
  'omo-onile-radar': {
    context:
      'A Lagos plot is sold off a survey plan, and the plan states its position in the Nigerian Minna Datum — a system no consumer mapping app accepts and most buyers cannot read. The question a buyer actually has is simple: where is this land, and does it fall inside a government acquisition?',
    approach:
      'A Streamlit application: GPT-4 Vision reads the photographed survey plan, the extracted coordinates are reviewed and corrected in the interface, then transformed from Minna Datum (EPSG:26331 and 26332, the western and eastern zones) into WGS84. Folium plots the boundary over Esri satellite imagery, with CSV export, email alerts on submitted leads, and term-based checks for acquisition zones and red-flag wording. A demo mode runs without an API key.',
    result:
      'One path from a photographed plan to a plotted boundary, with both Minna zones supported and the coordinates editable before anything is mapped.',
    limits:
      'The coordinates are editable precisely because the OCR output is reviewed rather than trusted, and the acquisition warning is a term check, not a search of the state register. It supports due diligence; it is not a title search and does not establish ownership.',
  },
  'kith-verified-housing': {
    context:
      'Student housing in Nigeria is transacted on trust in both directions: a room is paid for before it is seen, and a landlord hands over keys to someone they have never met. The constraint was to make the money wait until the facts had been checked — the student verified, the home inspected.',
    approach:
      'A pnpm monorepo: a Next.js web app and a realtime service on Prisma, with four roles (student, landlord, porter, admin) and a PGlite fallback so the build runs without a Postgres server. Reserving writes a pending booking and a pending 85/15 transaction and holds the room, then sends the student to Paystack — or to a mock checkout when no live key is set. Nothing confirms until a signed charge.success webhook arrives, which flips the booking, moves the escrow from pending to held, mints the guest pass and notifies both sides. Tampered amounts, wrong signatures and replays are refused and audited.',
    result:
      'The reserve → pay → escrow → pass path is wired end to end, with NIMC verification and porter inspection standing between a booking and a confirmed tenancy. Scoped to launch at FUNAAB and UNILAG.',
    limits:
      'This is the build, not a launched marketplace: no real tenancies have run through it, and the escrow split is a product decision rather than a regulated deposit scheme. Paystack integration is exercised through its signed-webhook contract and a mock checkout.',
  },
  'arkvolt-storefront': {
    context:
      'A one-engineer IT hardware business in Lagos was running a shop out of WhatsApp threads and memory. The constraint was to give it a storefront and a back office the owner could run without editing code, while leaving payment where the customers already are.',
    approach:
      'A Next.js 14 App Router storefront plus a noindex admin dashboard, over an Express and Prisma API on PostgreSQL. Shared zod schemas and money, date and WhatsApp helpers live in one package so the two surfaces cannot drift. Public routes cover the catalogue, the repair bench, laptop-title requests, the cart and order lookup; admin routes cover products, orders, bookings, enquiries, services and settings, with an audit log and rate limits on the API.',
    result:
      'Both surfaces are built and deployable — storefront and dashboard to Vercel, API and database to Render — with the whole catalogue, booking and enquiry flow operable from the dashboard.',
    limits:
      'No payment gateway by design, so revenue is still confirmed by hand on WhatsApp; the "checkout" records intent, not money. It is a build for one business, not a multi-tenant platform.',
  },
}

export type CaseStudy = {
  slug: string
  kind: 'project' | 'planning-model'
  title: string
  /** Short label for the discipline, e.g. "AI & data" or "Offshore wind". */
  eyebrow: string
  metric: string
  summary: string
  detail?: CaseStudyDetail
  links: { label: string; href: string }[]
  /**
   * The formal publication behind a research record.
   *
   * The short title above is what fits on a card. This is what the paper is
   * actually called on Zenodo, with its DOI and the editor the record names —
   * so a citation taken from this page can be checked against the source.
   */
  published?: {
    title: string
    doi: string
    editors?: string[]
    venue: string
  }
}

/**
 * Publications, keyed by slug. Titles, DOIs and editors were read back from
 * the Zenodo records themselves — which is how the two crossed entries in the
 * research list were caught — not from the earlier website, which had them in
 * a different order.
 */
const published: Record<string, NonNullable<CaseStudy['published']>> = {
  'pi-domain-adaptation': {
    title:
      'Physics-Informed Domain Adaptation: A Digital Twin Approach to Fault Diagnosis in Data-Scarce Industrial Environments',
    doi: '10.5281/zenodo.18794765',
    editors: ['Aro, Emmanuel'],
    venue: 'Zenodo · journal',
  },
  'pi-gans-fault-diagnosis': {
    title:
      'Zero-Shot Industrial Fault Diagnosis via Physics-Informed Generative Adversarial Networks (PI-GANs): A Cross-Domain Validation Study',
    doi: '10.5281/zenodo.18745734',
    editors: ['Aro, Emmanuel'],
    venue: 'Zenodo · journal',
  },
  'active-vibration-control': {
    title:
      'Autonomous Active Vibration Control: A Deep Reinforcement Learning Approach for Dynamic PID Tuning in Non-Linear Systems',
    doi: '10.5281/zenodo.18794732',
    editors: ['Aro, Emmanuel'],
    venue: 'Zenodo · journal',
  },
  'spiking-saturation': {
    title:
      'Binary Saturation Dynamics in Recurrent Spiking Neural Networks: Limitations of Homeostatic Regularization',
    doi: '10.5281/zenodo.18794753',
    editors: ['Amuzat, Habeeb'],
    venue: 'Zenodo · journal',
  },
  'riemannian-bci': {
    title:
      'Riemannian Transfer Learning for Cross-Subject BCI: A ShallowConvNet Approach to Zero-Calibration Motor Imagery Decoding',
    doi: '10.5281/zenodo.18714046',
    editors: ['Amuzat, Habeeb'],
    venue: 'Zenodo · journal',
  },
}

function fromProject(p: Project): CaseStudy {
  const categoryLabels: Record<Category, string> = {
    engineering: 'Engineering',
    ai: 'AI & data',
    software: 'Software & IT',
    research: 'Research',
  }
  return {
    slug: p.slug,
    kind: 'project',
    title: p.title,
    eyebrow: categoryLabels[p.category],
    metric: p.metric,
    summary: p.desc,
    detail: details[p.slug],
    links: p.links ?? [],
    ...(published[p.slug] ? { published: published[p.slug] } : {}),
  }
}

function fromModel(m: P6Model): CaseStudy {
  return {
    slug: m.slug,
    kind: 'planning-model',
    title: m.title,
    eyebrow: `Primavera P6 · ${m.group}`,
    metric: m.budget,
    summary: m.summary,
    detail: details[m.slug],
    links: [],
  }
}

/** Every case study, in the order they should be listed. */
export const caseStudies: CaseStudy[] = [
  ...site.p6.map(fromModel),
  ...projects.map(fromProject),
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug)
}

export const caseStudySlugs = caseStudies.map((c) => c.slug)

/** The note every case study carries about what its numbers are. */
export const metricNote = projectNote
