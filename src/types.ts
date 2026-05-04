
export type BiologicalSex = 'Male' | 'Female' | 'Unknown';
export type AgeRange = '0-18' | '19-29' | '30-44' | '45-59' | '60-74' | '75+';
export type MetPrim = 'Metastatic' | 'Primary' | 'Met' | 'Prim';

export interface RequestedData {
  patientDemographics: string[];
  patientFirstVisit: string[];
  previousTumor: string[];
  biopsyClinical: string[];
  treatmentHistory: string[];
  clinicalTrials: string[];
  omicsData: string[];
  molecularInfo: string[];
  images: string[];
}

export type Treatment = 'Androgen/Estrogen Deprivation Therapy' | 'Chemotherapy' | 'Experimental Therapy' |'Hormonal Therapy' | 'Immunotherapy' | 'Multiple Therapy' |'Nuclear Therapy' |'Targeted Therapy' | 'Other' | 'UNK';
export type BiopsySite = string;

export interface PatientInfo {
  sap: string;
  primaryTumor: string;
  gender: BiologicalSex;
  ageDx: number | null;
  rangeAge: string | null;
  treatment: string;
}

export interface BiopsyInfo {
  sap: string;
  patientId: string;
  biopsyId: string;
  primaryTumor: string;
  biopsySite: string;
  type: MetPrim;
  omicsData: string[];
  molecularInfo: string[];
  images: string[];
}

// The joined record that the dashboard consumes
export interface DashboardRecord extends BiopsyInfo {
  gender: BiologicalSex;
  rangeAge: string;
  treatment: string;
  databases: string[];
}

export type HierarchyField = keyof Omit<DashboardRecord, 'sap' | 'patientId' | 'biopsyId'>;

export interface FilterState {
  primaryTumors: string[];
  sex: string[];
  ageRanges: string[];
  biopsySites: string[];
  types: string[];
  treatments: string[];
  omicsData: string[];
  molecularInfo: string[];
  images: string[];
  treatmentLogic: 'any' | 'all';
  omicsLogic: 'any' | 'all';
  molecularLogic: 'any' | 'all';
  imagesLogic: 'any' | 'all';
}

export enum ViewMode {
  Sunburst = 'Sunburst',
  Table = 'Table View'
}

export interface HierarchyNode {
  name: string;
  value?: number;
  children?: HierarchyNode[];
}

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'draft';

export interface AvailabilityMetric {
  label: string;
  percent: number;
  count: number;
  total?: number;
  level?: 'patient' | 'biopsy';
  unit?: string;
}

export interface GroupedAvailability {
  title: string;
  items: AvailabilityMetric[];
}

export interface ResearcherInvolved {
  name: string;
  function: string;
  email: string;
  isDataContact: boolean;
}

export interface DataRequest {
  id: string;
  requester: string;
  title: string;
  date: string;
  status: RequestStatus;
  justification: string;
  requestedData: RequestedData;
  cohortFilters?: FilterState;
  patientCount?: number;
  availabilitySummary?: GroupedAvailability[];
  
  // Formal application fields
  registrationTime: string;
  applicationDate: string;
  applicantDetails: {
    name: string;
    email: string;
    group: string;
    isMulticenter: boolean;
    centerDetails?: string;
    principalInvestigator?: string;
  };
  researchersInvolved: ResearcherInvolved[];
  projectBriefSummary: string;
  projectDetailedDescription: {
    previousWork: string;
    objectiveResearchApproach: string;
    anticipatedResults: string;
  };
}

export interface SavedQuery {
  id: string;
  name: string;
  date: string;
  filters: FilterState;
  hierarchy: HierarchyField[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  isPK: boolean;
  isFK: boolean;
  description: string;
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  description: string;
}

export interface DatabaseInfo {
  name: string;
  tables: TableInfo[];
}

export interface MyPetition extends DataRequest {}
