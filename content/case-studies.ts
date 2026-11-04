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
      'Fault-diagnosis models are cheap to train on simulated data and unreliable when they meet a real machine, because the two distributions differ in exactly the ways a model cannot see. The question behind this project was whether physics could close that gap in a data-scarce setting.',
    approach:
      'A digital twin supplies the physical behaviour, a 1D convolutional network learns from it, and the adaptation step carries the representation onto measured bearing data — the CWRU dataset, the standard benchmark for this class of problem.',
    result:
      'The project record reports 100% precision and 100% recall on the target set.',
    limits:
      'A benchmark result at that level is a statement about a clean, well-labelled dataset, not about a plant floor. It is reported here as the record reports it, and no field deployment is claimed.',
  },
  'pi-gans-fault-diagnosis': {
    context:
      'The harder version of the same problem: diagnose a fault in a domain you have no labelled examples from at all, so an adaptation step would have nothing to adapt against.',
    approach:
      'Physics-informed generative modelling — the physical constraint shapes what the generator is allowed to produce, so the synthetic target-domain data stays inside the behaviour the machine can actually exhibit.',
    result:
      'The record reports 98.72% zero-shot accuracy and 77.22% once interpolating between domains.',
    limits:
      'Zero-shot accuracy is measured against held-out labelled data in the study, not against a live asset. The 77.22% inter-domain figure is the honest cost of moving between domains and is included for that reason.',
  },
  'active-vibration-control': {
    context:
      'Vibration control in a nonlinear system is usually handled by a hand-tuned PID loop — competent near the operating point it was tuned for, and wrong as soon as the system moves.',
    approach:
      'A Soft Actor-Critic agent adjusts the PID gains online instead of a human choosing them once, learning a policy over states rather than a fixed set of constants.',
    result:
      'The record reports a 40% reduction in settling time and a 17% efficiency gain against Ziegler–Nichols tuning.',
    limits:
      'This is a simulation result measured against a classical baseline. The comparison is with Ziegler–Nichols specifically, not with every tuning method in the literature.',
  },
  'spiking-saturation': {
    context:
      'A spiking network can look excellent on a classification metric while its population is doing something completely unlike the behaviour the model was supposed to have. This study went looking for that failure mode.',
    approach:
      'Recurrent spiking networks under homeostatic L2 regularisation, with activity tracked separately from accuracy so the two could be compared rather than conflated.',
    result:
      'High-activity regimes can persist even where classification accuracy is high — the regulariser does not guarantee the behaviour it is named for.',
    limits:
      'A model-behaviour study, not a benchmark entry. It reports a phenomenon and does not claim a fix.',
  },
  'riemannian-bci': {
    context:
      'Brain–computer interfaces break down across subjects: a decoder calibrated on one person’s motor-imagery signal does not transfer to the next, and recalibrating per subject is the thing that stops these systems leaving the lab.',
    approach:
      'Euclidean alignment to remove the per-subject covariance shift, then SimCLR-style self-supervised pre-training to learn a representation that survives the transfer.',
    result:
      'The record reports 79.3% cross-subject accuracy with 0.27 ms inference latency.',
    limits:
      'Reported accuracy on a public motor-imagery dataset. The latency figure is inference only and says nothing about the rest of a real-time pipeline.',
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
