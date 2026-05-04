
import { BiologicalSex, AgeRange, MetPrim, Treatment } from './types';

export const PRIMARY_TUMORS = [
  'adrenal_gland', 'ampulla_of_vater', 'anus', 'appendix', 'biliary_tract', 'bladder', 'bone', 'bowel', 'brain', 'breast',
  'cervix', 'cns', 'colon', 'cup', 'endometrium', 'esophagus', 'eye', 'gallbladder', 'head_neck', 'kidney', 'liver', 'lung',
  'multiple', 'NULL', 'other', 'ovary', 'pancreas', 'penis', 'peritoneum', 'pleura', 'prostate', 'rectum', 'skin',
  'soft_tissue', 'stomach', 'testis', 'thymus', 'thyroid', 'urinary_tract', 'uther_renal_pelivs', 'vagina', 'vulva'
];

export const BIOPSY_SITES = [
  'abdomen', 'abdominal_wall', 'acetabulum', 'adipose_tissue', 'adrenal', 'anal', 'appendix', 'artheria', 'auricula',
  'axilla', 'biliary_tract', 'Biopsy_site', 'bladder', 'blood', 'bone', 'bone_marrow', 'brain', 'breast', 'bronchius',
  'bucal_mucose', 'cartilage', 'cavum', 'cecum', 'cerebelum', 'cervix', 'choroides', 'clavicle', 'colon', 'craneum',
  'cranial_nerve', 'diaphragma', 'duodenum', 'endometrium', 'epiglotis', 'epiploic_appendix', 'esophagus',
  'etmoidal_sinus', 'eye', 'eyelid', 'fallopian_tube', 'femur', 'gallbladder', 'gastric_fundus', 'gastric_mucose',
  'gastrointestinal_tract', 'gum', 'head', 'heart', 'humerus', 'hypopharynx', 'hypophysis', 'ileon', 'ileum',
  'inguinal', 'jaw', 'jejunum', 'kidney', 'labia_majora', 'lacrimal', 'larynx', 'leg', 'liver', 'lung', 'lymph_node',
  'maxillar', 'maxillar_sinis', 'mediastinum', 'meninges', 'mesenterium', 'mouth', 'muscle', 'nasal_cavity',
  'nasal_septum', 'nasopharynx', 'nervous_system', 'nodes', 'nose', 'omentum', 'optical_nerve', 'oral_cavity',
  'oral_mucose', 'orbita', 'oropharynx', 'ovary', 'palate', 'pancreas', 'paraganglion', 'paranasal', 'paranasal_sinus',
  'parathyroid_gland', 'parotide', 'pelvis', 'penis', 'pericardiac_liquid', 'pericardium', 'perineum',
  'periotenal_liquid', 'peritoneum', 'pharynx', 'pleura', 'pleural_liquid', 'prostate', 'pyriform_sinus',
  'rectal_mucose', 'rectum', 'renal_pelvis', 'retroperitoneum', 'rib', 'round_ligament', 'sacrum', 'salivary', 'scalp',
  'seminal_vesicle', 'skin', 'small_bowel', 'soft_tissue', 'sphenoid_sinus', 'spinal_cord', 'spleen', 'sternum',
  'stomach', 'sublingual_gland', 'submaxilar', 'temporal_lobe', 'testis', 'thigh', 'thorax', 'thymus', 'thyroid',
  'tongue', 'tonsil', 'trachea', 'uge', 'umbilical', 'UNK', 'upper_limb', 'uraco_bladder', 'urether', 'urethra',
  'uterus', 'uterus_falopian_tube', 'vagina', 'vater_ampoule', 'vein', 'vertebra', 'vulva'
];

export const SEXES: BiologicalSex[] = ['Male', 'Female', 'Unknown'];
export const AGE_RANGES: AgeRange[] = ['0-18', '19-29', '30-44', '45-59', '60-74', '75+'];
// Changed to match mock data keys for functional filtering
export const TYPES: MetPrim[] = ['Met', 'Prim'];
export const TREATMENTS: Treatment[] = ['Androgen/Estrogen Deprivation Therapy', 'Chemotherapy','Experimental Therapy','Hormonal Therapy','Immunotherapy','Nuclear Therapy','Targeted Therapy','UNK'];

export const OMICS_DATA = ['WGS', 'WES', 'RNA-sq', 'scRNA-sq', 'miRNA-seq', 'ATAC-seq', 'ChIP -seq'];
export const MOLECULAR_INFO = [
  'CNA (Copy Number Alteration)',
  'Mutation',
  'TMB (Tumor Mutational Burden)',
  'HRD (Homologous Recombination Deficiency)',
  'Overexpression',
  'Fusion',
  'VIGEx (Virus Integration and Gene Expression)',
  'Tumor Cellularity Quantification',
  'MSI Status (Microsatellite Instability Status)',
  'Amplification',
  'Rearrangement'
];

export const IMAGE_TYPES = [
  'CT Scan',
  'MRI',
  'PET Scan',
  'X-Ray',
  'Pathology Slide'
];

export const HIERARCHY_ORDER: string[] = [
  'primaryTumor',
  'sex',
  'rangeAge',
  'type',
  'treatment',
  'biopsySite',
  'omicsData',
  'molecularInfo',
  'images'
];

export const COLORS = {
  primary: '#2563eb', // Blue 600
  secondary: '#64748b', // Slate 500
  accent: '#0ea5e9', // Sky 500
  background: '#f8fafc', // Slate 50
  white: '#ffffff',
  chart: [
    '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe',
    '#1e40af', '#1e3a8a', '#1d4ed8', '#4f46e5', '#6366f1'
  ]
};
