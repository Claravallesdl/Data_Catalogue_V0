import { ColumnInfo } from "../../types";

interface TranslationSet {
  language_label: string;
  coming_soon: string;
  category_onco_clinical: string;
  category_onco_pharma: string;
  category_omics: string;
  category_images: string;
  search_placeholder: string;
  columns_suffix: string;
  label_col: string;
  variable_col: string;
  type_col: string;
  description_col: string;
  keys_col: string;
  values_col: string;
  pk_label: string;
  fk_label: string;
  [key: string]: string | (ColumnInfo & { label?: string })[];
}

export const dataModelTranslations: Record<string, TranslationSet> = {
  en: {
    language_label: "EN",
    coming_soon: "Coming soon",
    category_onco_clinical: "OncoClinical",
    category_onco_pharma: "OncoPharma",
    category_clinical_trials: "Clinical Trials",
    category_prescreening: "Prescreening",
    category_omics: "Omics data",
    category_images: "Images",
    search_placeholder: "Search tables...",
    variables_suffix: "variables",
    label_col: "Label",
    variable_col: "Variable",
    type_col: "Type",
    description_col: "Description",
    keys_col: "Keys",
    values_col: "Values",
    pk_label: "Primary Key",
    fk_label: "Foreign Key"
  },
  es: {
    language_label: "ES",
    coming_soon: "Próximamente",
    category_onco_clinical: "OncoClinical",
    category_onco_pharma: "OncoPharma",
    category_clinical_trials: "Ensayos Clínicos",
    category_prescreening: "Prescreening",
    category_omics: "Omics data",
    category_images: "Images",
    search_placeholder: "Buscar tablas...",
    variables_suffix: "variables",
    label_col: "Etiqueta",
    variable_col: "Variable",
    type_col: "Tipo",
    description_col: "Descripción",
    keys_col: "Claves",
    values_col: "Valores",
    pk_label: "Clave Primaria",
    fk_label: "Clave Foránea"
  },
  ca: {
    language_label: "CA",
    coming_soon: "Properament",
    category_onco_clinical: "OncoClinical",
    category_onco_pharma: "OncoPharma",
    category_clinical_trials: "Assajos Clínics",
    category_prescreening: "Prescreening",
    category_omics: "Omics data",
    category_images: "Images",
    search_placeholder: "Cercar taules...",
    variables_suffix: "variables",
    label_col: "Etiqueta",
    variable_col: "Variable",
    type_col: "Tipus",
    description_col: "Descripció",
    keys_col: "Claus",
    values_col: "Valors",
    pk_label: "Clau Primària",
    fk_label: "Clau Forana"
  }
};
