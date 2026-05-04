import { DatabaseInfo } from '../types';

export const DATA_MODEL_SCHEMA: DatabaseInfo[] = [
  {
    name: 'Oncoclinical',
    tables: [
      { name: 'antineoplasic_therapy', columns: [], description: 'Information about cancer treatments and therapies.' },
      { name: 'biopsies_cognos_imported', columns: [], description: 'Imported biopsy data from Cognos systems.' },
      { name: 'committee', columns: [], description: 'Tumor board and committee decisions.' },
      { name: 'demographics', columns: [], description: 'Patient demographic information (age, sex, etc).' },
      { name: 'first_progression', columns: [], description: 'Data regarding the first clinical progression of the disease.' },
      { name: 'met_biopsies_sap_vh', columns: [], description: 'Metastatic biopsy records from SAP VH.' },
      { name: 'molecular_information', columns: [], description: 'Patient-level molecular and genetic summaries.' },
      { name: 'previous_tumors', columns: [], description: 'History of previous oncological events.' },
      { name: 'project_information', columns: [], description: 'Research project assignments and metadata.' },
      { name: 'surgery', columns: [], description: 'Surgical intervention details.' },
      { name: 'survival', columns: [], description: 'Survival and follow-up data.' },
      { name: 'tumor_baseline', columns: [], description: 'Baseline tumor characteristics at diagnosis.' },
    ]
  },
  {
    name: 'Prescreening',
    tables: [
      { name: 'Biopsies', columns: [], description: 'Primary and metastatic biopsy details.' },
      { name: 'Clinical_information', columns: [], description: 'Core clinical profile for prescreening cohorts.' },
      { name: 'Informed_consents', columns: [], description: 'Patient consent status for research.' },
      { name: 'Panel_300', columns: [], description: 'Results from the 300-gene panel.' },
      { name: 'Panel_Amplicon', columns: [], description: 'Results from amplicon-based NGS panels.' },
      { name: 'Panel_CopyNumber', columns: [], description: 'CNA results from NGS panels.' },
      { name: 'Panel_Epsilon', columns: [], description: 'Results from the Epsilon panel.' },
      { name: 'Panel_Fish', columns: [], description: 'NGS-derived FISH-like insights.' },
      { name: 'Panel_Guardant', columns: [], description: 'Guardant liquid biopsy results.' },
      { name: 'Panel_HE', columns: [], description: 'Hematology-Oncology panel results.' },
      { name: 'Panel_IHC', columns: [], description: 'Immunohistochemistry results.' },
      { name: 'Panel_RAD51', columns: [], description: 'RAD51 functional assay results.' },
      { name: 'Requests', columns: [], description: 'Prescreening service requests.' },
      { name: 'Tests', columns: [], description: 'Biological tests summary.' },
      { name: 'vt_ethnicity', columns: [], description: 'Value table for ethnicity.' },
      { name: 'vt_gender', columns: [], description: 'Value table for gender.' },
      { name: 'vt_primary_race', columns: [], description: 'Value table for primary race.' },
    ]
  },
  {
    name: 'OncoPharma',
    tables: [
      { name: 'Treatments_Intravenous', columns: [], description: 'IV treatment records.' },
      { name: 'Treatments_Oral', columns: [], description: 'Oral medication records.' },
      { name: 'v_treatment_schemes', columns: [], description: 'View of treatment schemes.' },
    ]
  },
  {
    name: 'ClinicalTrials',
    tables: [
      { name: 'TrialInclusions', columns: [], description: 'Records of patient inclusions in trials.' },
      { name: 'trials', columns: [], description: 'Metadata for clinical trials (NCT ID, phase, arm details, etc).' },
    ]
  },
];
