
import { DashboardRecord, DataRequest, SavedQuery } from '../types';

// The data provided by the user (Cancer type -> Count)
const CANCER_DISTRIBUTION = [
  { tumor: 'adrenal_gland', count: 52 },
  { tumor: 'ampulla_of_vater', count: 96 },
  { tumor: 'anus', count: 15 },
  { tumor: 'appendix', count: 46 },
  { tumor: 'biliary_tract', count: 760 },
  { tumor: 'bladder', count: 407 },
  { tumor: 'bone', count: 111 },
  { tumor: 'bowel', count: 402 },
  { tumor: 'brain', count: 817 },
  { tumor: 'breast', count: 10178 },
  { tumor: 'cervix', count: 217 },
  { tumor: 'cns', count: 4 },
  { tumor: 'colon', count: 4307 },
  { tumor: 'cup', count: 6 },
  { tumor: 'endometrium', count: 289 },
  { tumor: 'esophagus', count: 217 },
  { tumor: 'eye', count: 37 },
  { tumor: 'gallbladder', count: 108 },
  { tumor: 'head_neck', count: 656 },
  { tumor: 'kidney', count: 474 },
  { tumor: 'liver', count: 181 },
  { tumor: 'lung', count: 2472 },
  { tumor: 'multiple', count: 225 },
  { tumor: 'other', count: 355 },
  { tumor: 'ovary', count: 1091 },
  { tumor: 'pancreas', count: 2755 },
  { tumor: 'penis', count: 14 },
  { tumor: 'peritoneum', count: 55 },
  { tumor: 'pleura', count: 184 },
  { tumor: 'prostate', count: 521 },
  { tumor: 'rectum', count: 1588 },
  { tumor: 'skin', count: 411 },
  { tumor: 'soft_tissue', count: 425 },
  { tumor: 'stomach', count: 808 },
  { tumor: 'testis', count: 21 },
  { tumor: 'thymus', count: 46 },
  { tumor: 'thyroid', count: 394 },
  { tumor: 'urinary_tract', count: 36 },
  { tumor: 'uther_renal_pelivs', count: 140 },
  { tumor: 'vagina', count: 14 },
  { tumor: 'vulva', count: 51 }
];

// Seeded random for consistency
let seed = 123;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

function pickMany<T>(arr: T[], max: number = 3): T[] {
  const count = Math.floor(random() * max) + 1;
  const shuffled = [...arr].sort(() => 0.5 - random());
  return shuffled.slice(0, count);
}

const AGES = ['0-18', '19-29', '30-44', '45-59', '60-74', '75+'] as const;
const TREATMENTS = ['Androgen/Estrogen Deprivation Therapy', 'Chemotherapy','Experimental Therapy','Hormonal Therapy','Immunotherapy','Nuclear Therapy','Targeted Therapy','UNK'] as const;
const SITES = ['liver', 'lung', 'lymph_node', 'bone', 'brain', 'skin', 'peritoneum', 'soft_tissue', 'bowel', 'bladder', 'adrenal_gland', 'other'] as const;
const OMICS = ['WGS', 'WES', 'RNA-sq', 'scRNA-sq', 'miRNA-seq', 'ATAC-seq', 'ChIP -seq'] as const;
const MOLECULAR = ['Mutation', 'CNA', 'TMB', 'HRD', 'Fusion', 'Amplification'] as const;
const IMAGES = ['CT Scan', 'MRI', 'PET Scan', 'X-Ray', 'Pathology Slide'] as const;

export const MOCK_RECORDS: DashboardRecord[] = (() => {
  const records: DashboardRecord[] = [];
  let sapBase = 10000;

  // Sexual distribution weights (total 57750 approx, based on user provided sum)
  // Male: 11523
  // Female: 19043
  // Unknown: 27184
  // Total: 57750
  
  const TOTAL_SEX = 57750;

  CANCER_DISTRIBUTION.forEach(({ tumor, count }) => {
    for (let i = 0; i < count; i++) {
      const sap = (sapBase++).toString();
      const type = random() > 0.3 ? 'Prim' : 'Met';
      
      const databases: string[] = [];
      const sapNum = parseInt(sap, 10);
      if (sapNum % 3 === 0) databases.push('OC');
      if (sapNum % 4 === 0) databases.push('PS');
      if (sapNum % 2 === 0) databases.push('TC');
      if (sapNum % 5 === 0) databases.push('GC');
      if (databases.length === 0) databases.push('OC');

      const randSex = random();
      let gender: 'Male' | 'Female' | 'Unknown' = 'Unknown';
      if (randSex < 11523 / TOTAL_SEX) {
        gender = 'Male';
      } else if (randSex < (11523 + 19043) / TOTAL_SEX) {
        gender = 'Female';
      }

      // Enforce: Primary biopsies must match primaryTumor. Metastasis can be anywhere, including same organ.
      const biopsySite = type === 'Prim' 
        ? tumor 
        : pickOne([...SITES, tumor]);

      records.push({
        sap,
        patientId: `P${sap}`,
        biopsyId: `B${sap}`,
        primaryTumor: tumor,
        biopsySite,
        type: type,
        omicsData: pickMany([...OMICS], 2),
        molecularInfo: pickMany([...MOLECULAR], 3),
        images: pickMany([...IMAGES], 2),
        gender,
        rangeAge: pickOne([...AGES]),
        treatment: pickMany([...TREATMENTS], 2).join(', '),
        databases
      });
    }
  });

  return records;
})();

export const MOCK_INCOMING_REQUESTS: DataRequest[] = [
  { 
    id: 'req_001', 
    requester: 'Dr. Maria Garcia', 
    title: 'Metastatic Breast Cancer v2', 
    date: '2025-05-12', 
    status: 'pending', 
    justification: 'Validation of new biomarker panel in HER2+ cohorts. We require longitudinal data to assess response to therapy over time.',
    requestedData: {
      patientDemographics: ['Gender', 'Survival status (alive/death)'],
      patientFirstVisit: [],
      previousTumor: [],
      biopsyClinical: [],
      treatmentHistory: [],
      clinicalTrials: [],
      omicsData: [],
      molecularInfo: ['Mutation'],
      images: []
    },
    patientCount: 42,
    cohortFilters: {
      primaryTumors: ['breast'],
      sex: ['Female'],
      ageRanges: ['45-59', '60-74'],
      biopsySites: [],
      types: ['Met'],
      treatments: [],
      omicsData: [],
      molecularInfo: [],
      images: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    },
    availabilitySummary: [
      {
        title: 'Patient Clinical Data',
        items: [
          { label: 'Gender', percent: 100, count: 42 },
          { label: 'Survival status (alive/death)', percent: 85, count: 36 }
        ]
      },
      {
        title: 'History & Participation',
        items: [
          { label: 'Treatment History', percent: 78, count: 33 }
        ]
      },
      {
        title: 'Molecular Information',
        items: [
          { label: 'Mutation', percent: 64, count: 27 }
        ]
      }
    ]
  },
  { 
    id: 'req_002', 
    requester: 'Prof. Thomas Miller', 
    title: 'Lung Adenocarcinoma (Multi-omic)', 
    date: '2025-05-10', 
    status: 'approved', 
    justification: 'Meta-analysis of immunotherapy response markers. This study aims to correlate genomic signatures with patient outcomes across multiple trial datasets.',
    requestedData: {
      patientDemographics: ['Survival status (alive/death)'],
      patientFirstVisit: [],
      previousTumor: [],
      biopsyClinical: [],
      treatmentHistory: [],
      clinicalTrials: [],
      omicsData: ['WGS'],
      molecularInfo: ['Mutation'],
      images: []
    },
    patientCount: 28,
    cohortFilters: {
      primaryTumors: ['lung'],
      sex: [],
      ageRanges: [],
      biopsySites: [],
      types: [],
      treatments: [],
      omicsData: [],
      molecularInfo: [],
      images: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    },
    availabilitySummary: [
      {
        title: 'Patient Clinical Data',
        items: [{ label: 'Survival status (alive/death)', percent: 92, count: 26 }]
      },
      {
        title: 'Omics Data (Raw)',
        items: [{ label: 'WGS', percent: 45, count: 13 }]
      }
    ]
  },
  { 
    id: 'req_003', 
    requester: 'Dr. Sarah Chen', 
    title: 'Rare Pancreatic Tumors', 
    date: '2025-05-01', 
    status: 'rejected', 
    justification: 'Commercial diagnostic tool training (Policy mismatch). The request falls outside the scope of academic research as defined by the DAC policy.',
    requestedData: {
      patientDemographics: ['Primary tumor'],
      patientFirstVisit: [],
      previousTumor: [],
      biopsyClinical: ['Associated primary tumor'],
      treatmentHistory: [],
      clinicalTrials: [],
      omicsData: [],
      molecularInfo: [],
      images: []
    },
    patientCount: 12,
    cohortFilters: {
      primaryTumors: ['pancreas'],
      sex: [],
      ageRanges: [],
      biopsySites: [],
      types: [],
      treatments: [],
      omicsData: [],
      molecularInfo: [],
      images: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    }
  },
];

export const MOCK_MY_PETITIONS: DataRequest[] = [
  { 
    id: 'pet_001', 
    requester: 'Me (Julian Vales)', 
    title: 'Prostate Treatment Outcomes (IDIBELL)', 
    date: '2025-05-15', 
    status: 'pending', 
    justification: 'Comparative study with internal hormone deprivation cohort.',
    requestedData: {
      patientDemographics: ['Gender', 'Survival status (alive/death)'],
      patientFirstVisit: [],
      previousTumor: [],
      biopsyClinical: [],
      treatmentHistory: [],
      clinicalTrials: [],
      omicsData: [],
      molecularInfo: [],
      images: []
    },
    patientCount: 56,
    cohortFilters: {
      primaryTumors: ['prostate'],
      sex: ['Male'],
      ageRanges: [],
      biopsySites: [],
      types: [],
      treatments: ['Androgen/Estrogen Deprivation Therapy'],
      omicsData: [],
      molecularInfo: [],
      images: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    },
    availabilitySummary: [
      {
        title: 'Patient Clinical Data',
        items: [
          { label: 'Gender', percent: 100, count: 56 },
          { label: 'Survival status (alive/death)', percent: 89, count: 50 }
        ]
      },
      {
        title: 'History & Participation',
        items: [{ label: 'Treatment History', percent: 100, count: 56 }]
      }
    ]
  },
  { 
    id: 'pet_002', 
    requester: 'Me (Julian Vales)', 
    title: 'VHIO-Radiomics-Lung', 
    date: '2025-04-20', 
    status: 'approved', 
    justification: 'Fusion of clinical data lake with imaging features.',
    requestedData: {
      patientDemographics: ['Primary tumor'],
      patientFirstVisit: [],
      previousTumor: [],
      biopsyClinical: ['Associated primary tumor'],
      treatmentHistory: [],
      clinicalTrials: [],
      omicsData: [],
      molecularInfo: [],
      images: []
    },
    patientCount: 120,
    cohortFilters: {
      primaryTumors: ['lung'],
      sex: [],
      ageRanges: [],
      biopsySites: [],
      types: [],
      treatments: [],
      omicsData: [],
      molecularInfo: [],
      images: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    }
  },
];

export const MOCK_SAVED_QUERIES: SavedQuery[] = [
  { 
    id: 'q_001', 
    name: 'Metastatic Breast Patients > 45y', 
    date: '2025-05-14', 
    filters: {
      primaryTumors: ['breast'],
      sex: ['Female'],
      ageRanges: ['45-59', '60-74', '75+'],
      biopsySites: [],
      types: ['Met'],
      treatments: [],
      omicsData: [],
      molecularInfo: [],
      images: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    },
    hierarchy: ['primaryTumor', 'rangeAge', 'biopsySite']
  },
  { 
    id: 'q_002', 
    name: 'Colon Chemotherapy Cohort', 
    date: '2025-05-11', 
    filters: {
      primaryTumors: ['colon'],
      sex: [],
      ageRanges: [],
      biopsySites: [],
      types: [],
      treatments: ['Chemotherapy'],
      omicsData: [],
      molecularInfo: [],
      images: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    },
    hierarchy: ['primaryTumor', 'treatment', 'type']
  },
  {
    id: 'q_003',
    name: 'Pancreatic Excellence Multi-omic Cohort',
    date: '2026-04-20',
    filters: {
      primaryTumors: ['pancreas'],
      sex: [],
      ageRanges: [],
      biopsySites: [],
      types: [],
      treatments: [],
      omicsData: ['scRNA-sq', 'miRNA-seq', 'WES'],
      molecularInfo: [],
      images: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any'
    },
    hierarchy: ['primaryTumor', 'rangeAge', 'biopsySite']
  }
];
